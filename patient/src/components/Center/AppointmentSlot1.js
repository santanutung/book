import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axiosBaseUrl from '../../axiosBaseUrl';
import { useDispatch } from 'react-redux'
import Layout from '../Layout'
import { Link } from 'react-router-dom';
const moment = require('moment')
function AppointmentSlot1() {

  const params = useParams();
  // const appointmentSlots = slotsRawData;
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [appointmentSlotsData, setAppointmentSlotsData] = useState([]);
  const [appointmentSlotDate, setAppointmentSlotDate] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({ date: '', slot_id: '' })
  // const selectedSlot = useSelector(selectedAppointmentSlot)



  useEffect(() => {
  
    centerSlotDates()
    centerSlots()
  }, [])


  function centerSlots() {

    axiosBaseUrl.get(`patients/api/center/slots/${params.id}`)
      .then((res) => {
     
        setAppointmentSlots(res.data.data)
        setAppointmentSlotsData(res.data.data)

      }).catch(error => {
    

      })
  }


  function centerSlotDates() {

    axiosBaseUrl.get(`patients/api/center/slot/dates/${params.id}`)
      .then((res) => {
       
        setAppointmentSlotDate(res.data.data)

      }).catch(error => {
      

      })
  }


  function selectSlot(id, date) {
    setSelectedSlot({ date: date, slot_id: id })
    localStorage.setItem('slot', id);



  }

  return (
    <Layout>
      <section id="portfolio-details" className="portfolio-details">
        <div className="container">
          <div className="row gy-4">

            {
              appointmentSlotDate.map((x, index) => {

                return (

                  <div key={index} className="col-lg-12">

                    <div className="portfolio-info">
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <h3>{x}</h3>
                          <p>{moment(x, 'DD-MM-YYYY').format('dddd')}</p>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-md-10 offset-md-1">
                          <div className="row">
                            {
                              appointmentSlotsData.map((slot, index) => {

                                return (
                                  slot.date == x ?
                                    <div key={index} className="col-md-4 text-center">
                                      <div className="btn-ap">
                                        <a style={{ cursor: "pointer" }} onClick={() => selectSlot(slot._id, x)} className={selectedSlot.slot_id == slot._id ? `button-time` : `button-time-2`}>{slot.start_time + " - " + slot.end_time}</a>
                                      </div>
                                    </div>
                                    : ''
                                )

                              })
                            }
                            {/* <div className="col-md-4 text-center">
                              <div className="btn-ap">
                                <a className="button-time-1">01:00 AM - 04:00 PM </a>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="btn-ap">
                                <a className="button-time-2">04:00 AM - 08:00 PM </a>
                              </div>
                            </div> */}
                           
                            

                          </div>
                        </div>
                          <div className='text-right col-md-12'>
                          {
selectedSlot.date == x ? <Link className='btn btn-secondary' to="/appointment/book">Next</Link> :''
                            }
                          </div>
                      </div>
                    </div>
                  </div>

                )
              })
            }


          </div>
        </div>
      </section>



    </Layout>
  )
}

export default AppointmentSlot1
