import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import { socket } from '../../context/sokcet';
import { env } from '../../env';
import numberFormat from '../../functions';
import blood_group, { relations } from '../../rawData/DataSet';
import AppointmentValidation from '../../Validation/AppointmentValidation';

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

function SelectSlotModal(props) {
    const { showModal, setShowModal, center, selectedSlot } = props
    const [members, setMembers] = useState([])
    const [otherPatient, setOtherPatient] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState('')
    const [paymentType, setPaymentType] = useState('cash')
    const [patient, setPatient] = useState({ name: '', relation: '', blood_group: '' })
    const [appointmenerrors, setAppointmentError] = useState({})
    const { setLoaderState } = useGlobalContexts()
    const [appointmentId, setAppointmentId] = useState('')
    const [self, setSelf] = useState({})
    // const [appointment, setAppointment] = useState({})
    const history = useHistory()
    useEffect(() => {
        patientFamily()
    }, []);

    function handle(e) {
     
        const newData = { ...patient }
        newData[e.target.name] = e.target.value
        setPatient(newData)

    }

    function patientFamily() {

        axiosBaseUrl.get(`patients/api/family-member-list`)
            .then((res) => {
               
                setMembers(res.data.data)

                var self_data = res.data.data.filter((user, index) => {
                    if(user.relation === 'self' ) {
                        return user;
                    }
                })
            

                setSelf(self_data[0])

            }).catch(error => {
             

            })
    }

    function bookAppointment() {
   
        setLoaderState(true)
      

        var data = {}
        var patient_error = false;
        if (otherPatient) {

            data = { slot_id: selectedSlot._id, name: patient.name, relation: patient.relation, blood_group: patient.blood_group, payment_type: paymentType }



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
            data = { slot_id: selectedSlot._id, patient_id: selectedPatient, payment_type: paymentType }
        }


        if (!patient_error) {

            axiosBaseUrl.post(`patients/api/book-appointment`, data)
                .then((res) => {
                  
                    socket.emit("book-slot", { centerId:center._id, date: selectedSlot.date, data: res.data.notification });
                    socket.emit("notification", { roomID: 'admin', data: res.data.notification });
                    // setMembers(res.data.data)
                    setAppointmentId(res.data.data._id)
                    localStorage.setItem('apt_key',res.data.data._id);
                    if (paymentType == 'online') {

                        displayRazorpay(res.data.data)
                    }
                    else {
                        socket.emit("book-slot", { centerId:center._id, date: selectedSlot.date, data: res.data.notification });
                        socket.emit("notification", center._id, res.data.notification);
                        // socket.emit("notification", 'admin', res.data.notification);
                        // Swal.fire("", "Your appointment is successfully booked")
                        // getCurrentDateSlots(slot.date)
                        setLoaderState(false)

                        // documentUploadModal()
                        // setAppointment(res.data.data)
                        history.push({ 
                            pathname: '/upload-document',
                            state: {
                                appointment_id:res.data.data._id,
                                appointment:res.data.data
                            }
                           })
                       
        
                        // history.push("/upload-document");
                    }

                }).catch(error => {
               
                    if (error.response.status == 400) {
                        Swal.fire('', error.response.data.message);
                    }
                    setLoaderState(false)
                   

                })
        }
    }

    async function displayRazorpay(data) {
        // alert("test")
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        // checking if the script is added or not
        if (!res) {

            alert("Unable to load the the script")
            return
        }

        var appointment = data
        var charges = data.charges;
        var appointment_id = data._id;
        // Making an Post api call to the server to proceed the payment
        data = await fetch(`${env.baseUrl}razorpay?total=${data.charges * 100}`, { method: 'POST' }).then((t) =>
            t.json()
        )

     



        const options = {
            // key: "rzp_test_t9VIr7uZmekfPI", // Enter the Key ID generated from the Dashboard
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
                createTransaction(data.id, charges, appointment_id, response.razorpay_payment_id, appointment)
           
            },
            "error": function (response) {
             
                alert("ERR")
            },
            "prefill": {
                "name": self.name,
                "email": self.email,
                "contact": self.phone
            },

        };
        setLoaderState(false)

        // Open the payment window on the screen
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }


    function createTransaction(order_id, amount, appointment_id, transaction_id, appointment) {
        var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'appointment' };
     
        axiosBaseUrl.post(`patients/api/create-transaction`, data)
            .then((res) => {
             
                // alert("succes")

                setLoaderState(false)
                socket.emit("notification", center._id, res.data.notification);
                socket.emit("book-slot", { centerId:center._id, date: selectedSlot.date, data: res.data.notification });
                // socket.emit("book-slot", centerId, slot.date);
                // Swal.fire("", "Your appointment is successfully booked")
                // setMembers(res.data.data)
                
                // history.push("/upload-document");

                history.push({ 
                    pathname: '/upload-document',
                    state: {
                        appointment_id:appointment_id,
                        appointment:appointment
                    }
                   })
               

            }).catch(error => {
                

            })
    }



    return <>


        <Modal 
        show={showModal}
        dialogClassName="modal-m-width-4-vw"
         onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            {/* <form id="Login" onSubmit={signInHandler} > */}
            <Modal.Body>

                {/* <section id="portfolio-details" className="portfolio-details">
  <div className="container"> */}
                <div className="row gy-4">
                    <div className="col-lg-12">
                        <div className="service-info">
                            <div className="row" style={{ borderBottom: "2px solid #457b9d29" }}>
                                <div className="col-md-6 col-6">
                                    <h3 className='capitalize'>{center.name}</h3>
                                    <p className='center-address'>{center.area + " " + center.city}</p>
                                </div>
                                <div className="col-md-6 col-6">
                                    <h3 style={{ textAlign: "right" }}>{numberFormat(center.charges).replace('.00', '')}</h3>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-4 col-6">
                                    <div className="btn-d">
                                        <button className="btn btn-b">{moment(selectedSlot.date, 'DD-MM-YYYY').format('D MMM ‘YY')}</button>
                                    </div>
                                </div>
                                <div className="col-md-4 col-6">
                                    <div className="btn-d">
                                        <button className="btn btn-b">{selectedSlot.start_time}</button>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <p className="dial-l">Dialysis takes upto 4-6 hours</p>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-12">
                                    <form
                                        action="#"
                                        method="post"
                                        role="form"
                                        className="php-email-form1"
                                    >
                                        <div className="row">

                                            {
                                                !otherPatient ?

                                                    members.map((member, index) => {
                                                        return (

                                                            <div className="col-md-6 mt-1" onClick={(e) => setSelectedPatient(member._id)}>
                                                                <div className={selectedPatient === member._id ? "card booking-l active" : "card booking-l"}>
                                                                    <div className="card-body circle-sv">
                                                                        <div className="">
                                                                            <h3>{member.name?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</h3>
                                                                        </div>
                                                                        <p className="booking-p capitalize">{member.name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    : 
                                                <div className=''>
                                                    <div className=''>
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
                                                            <p className='mt-1'>
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
                                                            <p className='mt-1'>
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


                                            {/* <div className="col-md-6">
                                                <div className="card booking-l">
                                                    <div className="card-body circle-sv">
                                                        <div className="">
                                                            <h3>SV</h3>
                                                        </div>
                                                        <p className="booking-p">Sanchit Vatsa</p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {
                                                !otherPatient ? 
                                                <div className="col-md-6 mt-1" onClick={() => { setOtherPatient(true); setSelectedPatient('') }} >
                                                                <div className="card add-more-booking-l ">
                                                                    <div className="card-body circle-sv">
                                                                        <div className="">
                                                                            <h3> <i className="fa fa-plus" aria-hidden="true" /></h3>
                                                                        </div>

                                                                            <p className="booking-p">Other Patient</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                
                                            //     <div className="col-md-6" onClick={() => { setOtherPatient(true); setSelectedPatient('') }} >
                                            //     <div className="circle-plus">
                                            //         <i className="fa fa-plus" aria-hidden="true" />
                                                    
                                            //     </div>
                                            // </div> 
                                            : ''
                                            }
                                            
                                        </div>
                                        {/* <br />
                                        
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-check check-b" onClick={() => setPaymentType('online')}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        checked={paymentType === 'online' ? true : false}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Online
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-check check-b" onClick={() => setPaymentType('cash')}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        checked={paymentType === 'cash' ? true : false}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Cash on appointment
                                                    </label>
                                                    <br />
                                                    <br />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="tersm-l">
                                                    <p><Link to="/term-&-user" target="blank">Terms and conditions</Link> | <Link to="/privacy-policy" target="blank">Privacy Policy</Link></p>
                                                    <p className="terms-k">
                                                        Disclaimer: Upload your documents online or carry
                                                        physical documents.
                                                    </p>
                                                </div>
                                            </div>
                                        </div> */}
                                        <br />
                                        <br />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="button-k">
                                                    <a className="btn-cancel" onClick={() => setShowModal(false)}>
                                                        Cancel
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="button-s">
                                                    <a className="btn-save" onClick={bookAppointment}>
                                                        Confirm
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div>
</section> */}



            </Modal.Body>

            {/* </form> */}


        </Modal>


    </>
}

export default SelectSlotModal;
