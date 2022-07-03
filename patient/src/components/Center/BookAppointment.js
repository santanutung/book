import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import { env } from '../../env'
import Layout from '../Layout'
import Slider from "react-slick";

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
function BookAppointment() {

  let history = useHistory();
  const [paymentType, setPaymentType] = useState()
  const [members, setMembers] = useState([])
  const [slot, setSlot] = useState({})
  // const [patientId, setPatientId] = useState('')
  const [otherPatient, setOtherPatient] = useState(false)
  const [patient, setPatient] = useState({ name: '', relation: '', blood_group: '' })
  useEffect(() => {

    patientFamily()
    getSlot()
  
  }, [])

  function getSlot() {

    axiosBaseUrl.get(`patients/api/center/slot/${localStorage.getItem('slot')}`)
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
    // alert("test")
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    // checking if the script is added or not
    if (!res) {

      alert("Unable to load the the script")
      return
    }


    var charges = data.charges;
    var appointment_id = data._id;
    // Making an Post api call to the server to proceed the payment
    data = await fetch(`${env.baseUrl}razorpay?total=${data.charges*100}`, { method: 'POST' }).then((t) =>
      t.json()
    )




    const options = {
      key: "rzp_test_XxgDcoUUKk6lmz", // Enter the Key ID generated from the Dashboard
      "amount": charges*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
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

    // Open the payment window on the screen
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()

  }


  function createTransaction(order_id, amount, appointment_id, transaction_id) {
    var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'appointment' };
  
    axiosBaseUrl.post(`patients/api/create-transaction`, data)
      .then((res) => {
   
        // alert("succes")
        Swal.fire("Appointment is successfully booked", 'success')
        // setMembers(res.data.data)
        history.push("/Profile");

      }).catch(error => {
        // alert('false')
      

      })
  }


  function patientFamily() {

    axiosBaseUrl.get(`patients/api/family-member-list`)
      .then((res) => {

        setMembers(res.data.data)

      }).catch(error => {
    

      })
  }

  function bookAppointment(patientId) {
    // alert(patientId)
    var slot_id = localStorage.getItem('slot');
  
  

    axiosBaseUrl.post(`patients/api/book-appointment`, { slot_id: slot_id, patient_id: patientId })
      .then((res) => {
       
        // setMembers(res.data.data)
        if(paymentType == 'online') {

          displayRazorpay(res.data.data)
        }
        else {
          Swal.fire("", "Your appointment is successfully booked and your appointment id is ",res.data.data.appointment_id)
          history.push("/Profile");
        }

      }).catch(error => {
      

      })
  }

  function bookAppointmentOther() {

    var slot_id = localStorage.getItem('slot');
  
    axiosBaseUrl.post(`patients/api/book-appointment`, { slot_id: slot_id, name: patient.name, relation: patient.relation, blood_group: patient.blood_group })
      .then((res) => {
   
        displayRazorpay(slot.center_id?.charges)

        // setMembers(res.data.data)

      }).catch(error => {
      

      })
  }


  return (
    <Layout>
      <section className="login-l">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className='row'>
                <div className='col-m-3'>
                  <div><input type="radio" /></div>
                </div>
                <div className='col-md-3'></div>
              </div>
            </div>
            <div className="col-md-12">

              <form className="php-email-form selected-slot-card">
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <div className="form-group  card-header">
                      <h3 className="text-center">Appintment SLots</h3>
                    </div>
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="form-group log-f">
                      <strong>Center Name : {slot.center_id?.name}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group log-f">
                      <strong>Address : {slot.center_id?.address + " " + slot.center_id?.city + " " + slot.center_id?.state + " " + slot.center_id?.pincode}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group log-f">
                      <strong>Date : {slot?.date}</strong>
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
                    <div className="form-group card p-2">
                      <div onClick={e => setPaymentType('cash')}> {paymentType === 'cash' ? <i className="fas fa-circle mr-2"></i> : <i className="far fa-circle mr-2"></i>}Cash
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group card p-2">
                      <div onClick={e => setPaymentType('online')}> {paymentType === 'online' ? <i className="fas fa-circle mr-2"></i> : <i className="far fa-circle mr-2"></i>}Online
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group card p-2">
                      <div onClick={e => setPaymentType('wallet')}> {paymentType === 'wallet' ? <i className="fas fa-circle mr-2"></i> : <i className="far fa-circle mr-2"></i>}Wallet
                      </div>
                    </div>
                  </div>

                </div>

                <div className='row mt-5'>




                  {
                    !otherPatient ?
                      members.map((member, index) => {
                        return (
                          <div className='col-md-3'>
                            <div className='card patient-card'>
                              <div className=' text-center image-section'>
                                <img src="https://icon2.cleanpng.com/20180401/adq/kisspng-computer-icons-user-profile-male-user-5ac10d051a6e65.9765964815226012211083.jpg" width="100" />
                              </div>
                              <div >

                                <div>
                                  <p>Name : {member.name}</p>
                                  <p>Relation : {member.relation}</p>
                                  <p className='text-center'><button type='button' className='btn btn-sm btn-primary' onClick={(e) => bookAppointment(member._id)}>Book Appointment</button></p>
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
                            <div className="form-group log-f">
                              <div className="file-text text-center">

                                <input
                                  type="file"
                                  className="custom-file-upload"
                                  id="myFile" required=""

                                  name="image"
                                />
                              </div>
                            </div>
                            <p>
                              <input
                                className='form-control'
                                placeholder='Name'
                                name="name"
                                onChange={(e) => handle(e)}
                                value={patient.name} />
                            </p>
                            <p>
                              <input
                                className='form-control'
                                placeholder='Relation'
                                name="relation"
                                onChange={(e) => handle(e)}
                                value={patient.relation} />
                            </p>
                            <p>
                              <input
                                className='form-control'
                                placeholder='Blood Group'
                                name="blood_group"
                                onChange={(e) => handle(e)}
                                value={patient.blood_group}
                              />
                            </p>
                            <p className='text-center'>
                              <button type="button" className='btn btn-sm btn-primary mr-2' onClick={() => setOtherPatient(false)}>Back</button>
                              <button type="button" className='btn btn-sm btn-primary' onClick={() => bookAppointmentOther()}>Book Appointment</button>
                            </p>

                          </div>

                          <div >


                          </div>
                        </div>
                      </div>

                  }
                </div>


                {
                  !otherPatient ?
                    <div className="row mt-5">

                      <div className="col-md-6 offset-md-3 mt-5">
                        <div className="button-s text-center">
                          <a type="button" className="btn-save" onClick={() => setOtherPatient(true)} >Other Patient</a>
                        </div>
                      </div>

                    </div> :
                    ''
                }

                {/* <button type='button' onClick={() => displayRazorpay(200)} className='btn btn-sm btn-secondary'>Test</button> */}
              </form>

            </div>
          </div>
        </div>
      </section>


    </Layout>
  )
}

export default BookAppointment
