import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import useGlobalContexts from '../../context/GlobalContext'
import { socket } from '../../context/sokcet'
import { env } from '../../env'
import blood_group, { relations } from '../../rawData/DataSet'
import Loader from '../../ReusableComponents/Loader'
import AppointmentValidation from '../../Validation/AppointmentValidation'
import UploadDocument from './UploadDocument'

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

function AppointmentModal(props) {
    const { setLoaderState } = useGlobalContexts()
    let history = useHistory();
    const { setShowAppointmentModal, selectedSlot, getCurrentDateSlots, centerId } = props

    const [paymentType, setPaymentType] = useState('cash')
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [slot, setSlot] = useState({})
    const [appointmenerrors, setAppointmentError] = useState({})
    // const [patientId, setPatientId] = useState('')
    const [otherPatient, setOtherPatient] = useState(false)
    const [patient, setPatient] = useState({ name: '', relation: '', blood_group: '' })
    const [selectedPatient, setSelectedPatient] = useState('')
    const [appointmentId, setAppointmentId] = useState('')

    const [uploadDocumentForm, setUploadDocumentForm] = useState(false)
    useEffect(() => {

        patientFamily()
        getSlot()
        // documentUploadModal()

        // Swal.fire('', "appointment done", "success")

    }, [])

    function getSlot() {

        axiosBaseUrl.get(`patients/api/center/slot/${selectedSlot}`)
            .then((res) => {
              
                setSlot(res.data.data)
            }).catch(error => {
               

            })
    }
    function handle(e) {
  
        const newData = { ...patient }
        newData[e.target.name] = e.target.value
        setPatient(newData)

    }


    async function displayRazorpay(data) {
  
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        // checking if the script is added or not
        if (!res) {

            alert("Unable to load the the script")
            return
        }

        var charges = data.charges;
        var appointment_id = data._id;
        // Making an Post api call to the server to proceed the payment
        data = await fetch(`${env.baseUrl}razorpay?total=${data.charges * 100}`, { method: 'POST' }).then((t) =>
            t.json()
        )



        const options = {
            // key: "rzp_test_XxgDcoUUKk6lmz", // Enter the Key ID generated from the Dashboard
            key: "rzp_test_L2zWcegobm7lNI",
            "amount": charges * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": 'INR',
            "name": "Book Care",
            "description": "Test Transaction",
            "image": "img/logo.png",
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                // alert("Payment ID: ",response.razorpay_payment_id);
                // alert("Order ID: ",response.razorpay_order_id);
                // alert("Razorpay Signature: ",response.razorpay_signature)
                createTransaction(data.id, charges, appointment_id, response.razorpay_payment_id)
             
            },
            "error": function (response) {
            
                alert("ERR")
            },
            "prefill": {
                "name": "Himanshu",
                "email": "hgoyal29@example.com",
                "contact": "9964999999"
            },

        };
        setLoading(false)

        // Open the payment window on the screen
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }


    function createTransaction(order_id, amount, appointment_id, transaction_id) {
        var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'appointment' };
    
        axiosBaseUrl.post(`patients/api/create-transaction`, data)
            .then((res) => {
             
                setLoaderState(false)
                socket.emit("notification", centerId, res.data.notification);
                socket.emit("book-slot", { centerId, date: slot.date, data: res.data.notification });
                // socket.emit("book-slot", centerId, slot.date);
                // Swal.fire("", "Your appointment is successfully booked")
                // setMembers(res.data.data)
                documentUploadModal()
                // history.push("/Profile");
                getCurrentDateSlots(slot.date)

            }).catch(error => {
          

            })
    }


    function patientFamily() {

        axiosBaseUrl.get(`patients/api/family-member-list`)
            .then((res) => {
          
                setMembers(res.data.data)

            }).catch(error => {
             

            })
    }

    function bookAppointment() {
   
        setLoaderState(true)
      

        var data = {}
        var patient_error = false;
        if (otherPatient) {

            data = { slot_id: selectedSlot, name: patient.name, relation: patient.relation, blood_group: patient.blood_group, payment_type: paymentType }



            var error_data = AppointmentValidation(data);
          
            setAppointmentError(error_data);
       
            if (Object.keys(error_data).length != 0) {
                patient_error = true
                setLoaderState(false)

            }


        }
        else {
            if (selectedPatient == '') {
                Swal.fire("", "Please select patient")
                patient_error = true;
                setLoaderState(false)
            }
            data = { slot_id: selectedSlot, patient_id: selectedPatient, payment_type: paymentType }
        }


        if (!patient_error) {

            axiosBaseUrl.post(`patients/api/book-appointment`, data)
                .then((res) => {
           
                    socket.emit("book-slot", { centerId, date: slot.date, data: res.data.notification });
                    socket.emit("notification", { roomID: 'admin', data: res.data.notification });
                    // setMembers(res.data.data)
                    setAppointmentId(res.data.data._id)
                    if (paymentType == 'online') {

                        displayRazorpay(res.data.data)
                    }
                    else {
                        socket.emit("book-slot", { centerId, date: slot.date, data: res.data.notification });
                        socket.emit("notification", centerId, res.data.notification);
                        // socket.emit("notification", 'admin', res.data.notification);
                        // Swal.fire("", "Your appointment is successfully booked")
                        getCurrentDateSlots(slot.date)
                        setLoaderState(false)

                        documentUploadModal()


                        // history.push("/Profile");
                    }

                }).catch(error => {
                
                    if (error.response.status == 400) {
                        Swal.fire('', error.response.data.message);
                    }
                    setLoaderState(false)
               

                })
        }
    }

    function documentUploadModal() {

        Swal.fire({
            text: 'Appointment is succesfully booked. Do you want upload document or update Cretenine level .',
            showCancelButton: true,
            confirmButtonText: `Yes`,
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {

                setUploadDocumentForm(true)
            }
            else {
                history.push("/Profile");
            }
        })
    }



    return (
        <>

            {!uploadDocumentForm ?

                <div
                    className="modal fade show"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                // style={{ display: 'none' }}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setShowAppointmentModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                {/* <Loader /> */}
                                {
                                    loading ? <Loader /> : ''
                                }

                                <form className="selected-slot-card">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div className="form-group  card-header">
                                                <h3 className="text-center">Appointment Slots</h3>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-6 mt-3">
                                        <div className="form-group log-f">
                                            <strong>Center Name : {slot.center_id?.name}</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <strong>Address : {slot.center_id?.address + " " + slot.center_id?.city + " " + slot.center_id?.state + " " + slot.center_id?.pincode}</strong>
                                        </div>
                                    </div> */}
                                        <div className="col-md-4">
                                            <div className="form-group log-f">
                                                <strong>Date : {slot.date ? moment(slot.date, 'DD-MM-YYYY').format('DD/MM/YYYY') : ''}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group log-f">
                                                <strong>Time : {slot?.start_time + " - " + slot?.end_time}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group log-f">
                                                <strong>Charges : {slot.center_id?.charges}</strong>
                                            </div>
                                        </div>



                                    </div>
                                    <div className='row'>
                                        <div className="col-md-2">
                                            <div className="form-group log-f">
                                                <strong>Payment Type</strong>
                                            </div>
                                        </div>


                                        <div className="col-md-2">
                                            <div className={paymentType === 'cash' ? "form-group card p-2  payment-type active" : "form-group card p-2 payment-type "}>
                                                <div onClick={e => setPaymentType('cash')}> {paymentType === 'cash' ? <i classname="fas fa-circle mr-2"></i> : <i classname="far fa-circle mr-2"></i>}Cash
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className={paymentType === 'online' ? "form-group card p-2  payment-type active" : "form-group card p-2 payment-type "}>
                                                <div onClick={e => setPaymentType('online')}> {paymentType === 'online' ? <i classname="fas fa-circle mr-2"></i> : <i classname="far fa-circle mr-2"></i>}Online
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-2">
                                        <div className="form-group card p-2">
                                            <div onClick={e => setPaymentType('wallet')}> {paymentType === 'wallet' ? <i classname="fas fa-circle mr-2"></i> : <i classname="far fa-circle mr-2"></i>}Wallet
                                            </div>
                                        </div>
                                    </div> */}

                                    </div>
                                    {/* {selectedPatient} */}

                                    <div className='row mt-5'>




                                        {
                                            !otherPatient ?

                                                members.map((member, index) => {
                                                    return (
                                                        <div className='col-md-3 mb-3'>
                                                            <div className={selectedPatient == member._id ? 'card patient-card active' : 'card patient-card'} onClick={(e) => setSelectedPatient(member._id)}>
                                                                <div className=' text-center image-section'>
                                                                    <img src="https://icon2.cleanpng.com/20180401/adq/kisspng-computer-icons-user-profile-male-user-5ac10d051a6e65.9765964815226012211083.jpg" width="80" />
                                                                </div>
                                                                <div >

                                                                    <div>
                                                                        <p>Name : {member.name}</p>
                                                                        <p>Relation : {member.relation}</p>
                                                                        <p className='text-center'><button type='button' className='btn btn-sm btn-primary' onClick={(e) => setSelectedPatient(member._id)}>Select</button></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className='col-md-6 offset-md-3'>
                                                    <div className='card new-patient-card'>
                                                        <div className=' text-center image-section'>

                                                            <p>
                                                                <input
                                                                    className='form-control'
                                                                    placeholder='Name'
                                                                    name="name"
                                                                    onChange={(e) => handle(e)}
                                                                    value={patient.name} />
                                                                <br />
                                                                <span className='text-danger'>{appointmenerrors.name}</span>
                                                            </p>
                                                            <p className='mt-3'>
                                                                <select

                                                                    className="form-control"
                                                                    name="relation"
                                                                    id="relation"
                                                                    placeholder="Relation"
                                                                    required
                                                                    onChange={(e) => handle(e)}
                                                                    value={patient.relation}
                                                                >
                                                                    <option>Select Relation</option>
                                                                    {
                                                                        relations.map((relation, index) => {
                                                                            return (
                                                                                <option value={relation}>{relation}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                                <br />
                                                                <span className='text-danger'>{appointmenerrors.relation}</span>
                                                            </p>
                                                            <p className='mt-3'>
                                                                <select
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="blood_group"
                                                                    id="blood_group"
                                                                    placeholder="Blood Group*"
                                                                    required
                                                                    onChange={(e) => handle(e)}
                                                                    value={patient.blood_group}
                                                                >
                                                                    <option>Select Blood Group</option>
                                                                    {blood_group.map((x, index) => {
                                                                        return (
                                                                            <option value={x}>{x}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                                <br />
                                                                <span className='text-danger'>{appointmenerrors.blood_group}</span>
                                                            </p>


                                                        </div>

                                                        <div >


                                                        </div>
                                                    </div>
                                                </div>

                                        }
                                    </div>


                                    <div>
                                        <strong>Disclaimer :  Upload a document or to carry physical documents</strong>
                                    </div>
                                    {/* {
                                    !otherPatient ?
                                        <div className="row mt-5">

                                            <div className="col-md-6 offset-md-3 mt-5">
                                                <div className="button-s text-center">
                                                    <a type="button" className="btn-save" onClick={() => setOtherPatient(true)} >Other Patient</a>
                                                </div>
                                            </div>

                                        </div> :
                                        ''
                                } */}

                                    {/* <button type='button' onClick={() => displayRazorpay(200)} className='btn btn-sm btn-secondary'>Test</button> */}
                                </form>


                            </div>
                            <div className="modal-footer text-center">
                                <p className='text-center'>
                                    {
                                        !otherPatient ?

                                            <a type="button" className="btn-service" onClick={() => { setOtherPatient(true); setSelectedPatient('') }} >Other Patient</a>
                                            :
                                            <button type="button" className='btn btn-sm btn-primary ml-1' onClick={() => setOtherPatient(false)}>Back</button>

                                    }
                                    <button type="button" className='btn btn-sm btn-primary ml-1' onClick={() => setShowAppointmentModal(false)}>Cancel</button>


                                    <button type="button" className='btn btn-sm btn-primary ml-1' onClick={() => bookAppointment()}>Book Appointment</button>



                                </p>

                            </div>
                        </div>
                    </div>
                </div> :

                <UploadDocument appointmentId={appointmentId} setUploadDocumentForm={setUploadDocumentForm} setShowAppointmentModal={setShowAppointmentModal} />
            }
        </>
    )
}

export default AppointmentModal
