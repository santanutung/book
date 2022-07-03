import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import Loader from '../../custom/Loader';
import ProcessLoader from '../../custom/ProcessLoader';
import Layout from '../../Layout';
import { days } from '../../rawData/dataset';
import AppointmentSlotModal from './AppointmentSlotModal';
import DateSlotComponent from './Slots/DateSlotComponent';
const moment = require('moment')
function AppointmentSlots() {


    var settings = {
        // dots: true,
        infinite: false,
        navigator: true,
        speed: 500,
        slidesToShow: 8,
        // slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 3,
                    //   slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    //   slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    //   slidesToScroll: 1
                }
            }
        ]
    };

    const [editId, setEditId] = useState('')
    const [edit, setEdit] = useState({})
    const [showModal, setShowModal] = useState(false)

    const [activeDay, setActiveDay] = useState('Sunday')
    const [slots, setSlots] = useState([])

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getDaySlots(activeDay)
    }, [])

    function getDaySlots(day) {
        setActiveDay(day)

        setSlots([])
        setLoading(true)
        axiosBaseUrl.get(`private/appointment/slot-details/${day}`)
            .then((res) => {
                setSlots(res.data.data)
                setLoading(false)

            }).catch(error => {
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

    function deleteSlot(id) {
        Swal.fire({
            title: 'Are You Sure?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Delete`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`private/appointment/slot/delete/${id}`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getDaySlots(activeDay)


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    function createDateSLot() {
        Swal.fire({
            title: 'Are You Sure?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Update`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.get(`private/slots`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Update!', 'Date Slot is successfully update', 'success')
                        getDaySlots(activeDay)


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    return (
        <Layout>

            <div className="main-panel">
                <div className="content-wrapper">
                    <div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">


                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"
                                            ><a href="/dashboard">Dashboard</a></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Book Appointment</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="card">
                        </div> */}
                    <div className='text-right'>
                        <button className="btn btn-sm btn-secondary" onClick={e => createDateSLot(e)}>Create Date SLot</button>
                    </div>

                    <Slider {...settings}>
                        {
                            days.map(day => {
                                return <div key={day}>
                                    <h3 className={activeDay == day ? "active" : ""} onClick={e => getDaySlots(day)}>{day}</h3>
                                </div>
                            })
                        }

                    </Slider>


                    <div className="tab-content book-appointment-slot-list" id="pills-tabContent">

                        <div className="row">
                            <div className="col-12 text-right">
                                <button className="btn btn-sm btn-secondary" onClick={e => setShowModal(true)}>Add Slot</button>

                            </div>

                            {
                                loading ?
                                    <div className='col-md-12 mt-2'>
                                        <ProcessLoader />
                                    </div>
                                    :
                                    slots.map(slot => {
                                        return <div className="col-md-3 book-appointment-slot-list-item mt-2" key={slot._id}>
                                            <div className="card">
                                                <div className="card-body d-flex">
                                                    {moment(slot.start_time, 'hh:mm A').format('hh:mm A') + " to " + moment(slot.end_time, 'hh:mm A').format('hh:mm A') + " (total beds " + slot.total_beds + ")"}
                                                    <div className="slot-edit-section">
                                                        <a className="text-danger mr-2" onClick={e => deleteSlot(slot._id)}><i className="fas fa-trash"></i></a>
                                                        <a className="text-danger" onClick={e => { setShowModal(true); setEditId(slot._id); setEdit(slot)}}><i className="fas fa-pencil"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })
                            }



                        </div>




                    </div>


                    {showModal === true ? <AppointmentSlotModal setShowModal={setShowModal} getDaySlots={getDaySlots} day={activeDay} editId={editId} setEditId={setEditId} edit={edit} setEdit={setEdit} /> : ""}
                    </div>
                    <hr />
                    <div>
                        <h3 className='text-center'>Date Slots</h3>
                    </div>
                    <hr/>
                    <DateSlotComponent />
                </div>
            </div>


        </Layout>
    )
}

export default AppointmentSlots
