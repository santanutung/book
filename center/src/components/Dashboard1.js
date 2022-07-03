import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
// import { Doughnut } from 'react-chartjs-2';
import Footer from './partials/Footer';

import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl';
import Loader from '../custom/Loader';
import AppointmentTable from '../custom/List/AppointmentTable';
import { SocketContext } from '../context/socket';
import { Link } from 'react-router-dom';
import { selectCenterName } from '../Redux/userSlice';
import { useSelector } from 'react-redux';


const moment = require('moment')

const cardColors = ["card-tale", "card-dark-blue", "card-darksalmon", "card-light-danger"]

// const data = {
//   labels: ["MONEY MARKET", "FIXED INCOME", "SPECIALTY"],
//   datasets: [{
//     label: "Test2",
//     data: [0, 19, 0, 51, 22, 19],
//     backgroundColor: [
//       'rgba(255, 153, 102, 1)',
//       'rgba(198, 201, 202, 1)',
//       'rgba(128, 116, 110, 1)',
//     ],
//     borderColor: [
//       'rgba(255, 153, 102, 1)',
//       'rgba(198, 201, 202, 1)',
//       'rgba(128, 116, 110, 1)',
//     ],

//   }]
// };


function Dashboard1() {

  const socket = useContext(SocketContext);
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(false)
  const centerName = useSelector(selectCenterName)

  const [appointmentData, setAppointmentData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([1])
  const [filter, setFilter] = useState({})

  const [slots, setSlots] = useState([])
  useEffect(() => {
    getAppointment()
    getCurrentDateSlots()
    // getDashboardData()

    // emit USER_ONLINE event
    // socket.emit("chat message", "hello"); 

    // subscribe to socket events
    // socket.on("hello", (message) => {
    //   alert("test")
    //   console.log(message)
    // }); 







  }, [])

  // function getDashboardData() {
  //   axiosBaseUrl.get(`private/center/dashboard`)
  //     .then((res) => {
  //       console.log(res.data)
  //       setStatsData(res.data.data)

  //       setLoading(false)

  //     }).catch(error => {
  //       console.log(error)
  //       if (error.response) { 
  //         Swal.fire(error.response.data.error, '', 'error')


  //       }
  //       else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log('Error', error.message);
  //       }
  //     })

  // }

  function changePage(page) {
    let temp_pages = [];

    setCurrentPage(page)

    temp_pages.push(page)
    for (let count = 1; count < 5; count++) {
      page = page + 1;
      temp_pages.push(page)

      if (totalPages === page) {
        return false;
      }


    }

    console.log(temp_pages)

    setPages(temp_pages)

  }




  function getAppointment(page, slot_id = '') {

    axiosBaseUrl.get(`private/appointments?date=${moment().format('YYYY-MM-DD')}&appointment_status=ne-cancelled&slot_id=${slot_id}`)

      .then((res) => {
        console.log(res.data, "appointment")
        setAppointmentData(res.data.data)

        setTotalPages(res.data.page)

        changePage(page)

      }).catch(error => {
        console.log(error)
        if (error.response) {
          Swal.fire(error.response.data.error, '', 'error')
          Swal.fire('test1', '', 'error')

        }
        else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      })

  }



  const updateStatusHandler = (id, status, type) => {
    // alert(type)
    if (type === undefined) {
      let placeholder = "";

      if (status === 'pending') {
        placeholder = "Enter Weight before dialysis"
      }
      else {
        placeholder = "Enter Weight after dialysis"
      }
      var weight = 0;

      Swal.fire({
        title: 'Update Status',
        html: ` <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <input id="after_weight" class="form-control search input-box" name="after_weight"  placeholder="${placeholder}"/>
                        </div>
                    </div>
                </div>`,
        confirmButtonText: 'Update',
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
          const after_weight = Swal.getPopup().querySelector('#after_weight').value
          if (!after_weight) {

            if (status === 'pending') {
              Swal.showValidationMessage(`Please Enter Before Dialysis Weight`)

            }
            else {

              Swal.showValidationMessage(`Please Enter After Dialysis Weight`)
            }
          }
          else {
            weight = after_weight

          }
          return { afterWeight: after_weight }
        }
      }).then((result) => {
        console.log("result ", result)

        var data = { 'appointment_status': status === 'pending' ? "ongoing" : "completed" }
        if (status === 'pending') {
          data['before_weight'] = weight
        }
        else {
          data['after_weight'] = weight
        }

        if (result.isConfirmed === true) {
          axiosBaseUrl.put(`private/center/appointment/${id}`, data)
            .then((res) => {
              console.log(res)
              getAppointment()
              Swal.fire("Weight is successfully updated", '', 'success')

            }).catch(error => {
              console.log(error)
              if (error.response) {
                Swal.fire(error.response.data.error, '', 'error')


              }
              else if (error.request) {
                console.log(error.request);
              } else {
                console.log('Error', error.message);
              }
            })


          console.log(result.value.afterWeight, " and ", result.value.updatedStatus)
        }

      })
    }
    else {
      updatePaymentStatus(id)
    }
  }

  const updatePaymentStatus = (id) => {
    Swal.fire({
      title: 'Do you want to update payment status?',
      showCancelButton: true,
      confirmButtonText: `Save`,
    }).then((result) => {
      if (result.isConfirmed) {

        axiosBaseUrl.put(`private/center/appointment/${id}`, {payment_status : 'completed'})
          .then((res) => {

            Swal.fire('', 'Appointment is successfully updated', 'success')
            getAppointment(1)


          }).catch(error => {
            console.log(error)

          })


      }
      else {

      }
    });
  }

  const cancelAppointment = (id, appointment_key) => {
    Swal.fire({
      title: 'Do you want to cancel ' + appointment_key + ' appointment?',
      showCancelButton: true,
      confirmButtonText: `Save`,
    }).then((result) => {
      if (result.isConfirmed) {

        axiosBaseUrl.put(`private/appointment-cancel/${id}`)
          .then((res) => {

            Swal.fire('', 'Appointment is successfully cancelled', 'success')
            getAppointment(1)


          }).catch(error => {
            console.log(error)

          })


      }
      else {

      }
    });
  }


  function getCurrentDateSlots() {
    var date = moment().format('DD-MM-YYYY')
    // setSlots([])

    // setLoading(true)

    axiosBaseUrl.get(`private/dates?date=${date}`)
      .then((res) => {
        console.log(res.data.data)
        setSlots(res.data.data)
        // setLoading(false)


      }).catch(error => {
        console.log(error)
        if (error.response) {
          Swal.fire(error.response.data.error, '', 'error')


        }
        else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })
  }



  return (
    <Layout>

      {loading ? <Loader /> : null}

      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="row">
                <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                  <h3 className="font-weight-bold  text-capitalize">Welcome In {centerName}</h3>

                </div>

              </div>
            </div>
          </div>
          {/* <button onClick={()=>{alert("test");socket.emit("notification", 'admin', {message:"hello"});}}>Send Notification</button> */}
          <div className='grid'>
            {/* <div className='col-md-2'> */}
            <Link className='btn btn-secondary btn-md mr-3' to="/bookAppointment">Book Appointment</Link>
            {/* </div> */}
            {/* <div className='col-md-2'> */}
            <Link className='btn btn-secondary btn-md mr-3' to="/appointmentHistory">Appointment History</Link>
            {/* </div> */}
            {/* <div className='col-md-2'> */}
            <Link className='btn btn-secondary btn-md mr-3' to="/cancelledAppointment">Cancelled Appointment</Link>
            {/* </div> */}
            {/* <div className='col-md-2'> */}
            <Link className='btn btn-secondary btn-md mr-3' to="/offlineAppointment">Offline Appointment</Link>
            {/* </div> */}

            {/* <div className='col-md-3'> */}
            <Link className='btn btn-secondary btn-md mr-3' to="/upcomingAppointments">Upcoming Appointment</Link>
            {/* </div> */}

          </div>
          {/* <div className="row">
            <div className='col-md-2'>
                <Link className='btn btn-secondary btn-md' to="/bookAppointment">Book Appointment</Link>
            </div>
            <div className='col-md-2'>
                <Link className='btn btn-secondary btn-md' to="/appointmentHistory">Appointment History</Link>
            </div>
            <div className='col-md-2'>
                <Link className='btn btn-secondary btn-md' to="/cancelledAppointment">Cancelled Appointment</Link>
            </div>
            <div className='col-md-2'>
                <Link className='btn btn-secondary btn-md' to="/offlineAppointment">Offline Appointment</Link>
            </div>
           
            <div className='col-md-3'>
                <Link className='btn btn-secondary btn-md' to="/upcomingAppointments">Upcoming Appointment</Link>
            </div>
           
          </div> */}


          <AppointmentTable tableHeading={"Today's Appointments"} appointmentData={appointmentData} updateStatusHandler={updateStatusHandler} cancelAppointment={cancelAppointment} getAppointment={getAppointment} totalPages={totalPages} currentPage={currentPage} pages={pages} slots={slots} />


        </div>
        {/* content-wrapper ends */}
        {/* partial:partials/_footer.html */}
        <Footer />
        {/* partial */}
      </div>
      {/* main-panel ends */}


    </Layout>


  )
}

export default Dashboard1
