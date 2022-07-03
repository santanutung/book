import React, { useState, useEffect } from 'react'
import Layout from '../../Layout'
import Slider from "react-slick";

import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl'
import { useParams } from 'react-router-dom';
import AppointmentSlotModal from './AppointmentSlotModal';
import moment from 'moment';
import Loader from '../../ReuseableComponent/Loader';
import ProcessLoader from '../../ReuseableComponent/ProcessLoader';
import DateSlots from './DateSlots';
// import {days} from '../../../rawData/dataSet'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Slots() {
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
                breakpoint: 600,
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

    const [edit, setEdit] = useState('')
    const [showModal, setShowModal] = useState(false)

    const [activeDay, setActiveDay] = useState('Sunday')
    const [loader, setLoader] = useState(false)
   
    const [slots, setSlots] = useState([])
   
    const { centerId } = useParams();


    useEffect(() => {
        getDaySlots(activeDay)
    }, [])

    function getDaySlots(day) {
        setActiveDay(day)

        setSlots([])

        setLoader(true)

        axiosBaseUrl.get(`admin/appointment/slot-details/${centerId}/${day}`)
            .then((res) => {
                setSlots(res.data.data)
                setLoader(false)

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

                axiosBaseUrl.delete(`admin/appointment/slot/delete/${centerId}/${id}`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getDaySlots(activeDay)


                    }).catch(error => {
                        console.log(error.response)

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

                axiosBaseUrl.get(`admin/slots/${centerId}`)
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
                                                <li className="breadcrumb-item"><Link to="/manageCentre">Manage Centres</Link></li>
                                                <li className="breadcrumb-item"><Link to={`/centreProfile/${centerId}`}>Centre Profile</Link></li>
                                                <li className="breadcrumb-item active" aria-current="page">Centre Slots</li>
                                            </ol>
                                        </nav>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className='text-right'>
                            <button className="btn btn-sm btn-primary" onClick={e => {createDateSLot(e)}}>Create Date SLot</button>
                        </div>


                        <Slider {...settings}>
                            {
                                days.map(day => {
                                    return <div>
                                        <h5 className={activeDay == day ? "active" : ""} onClick={e => getDaySlots(day)}>{day}</h5>
                                    </div>
                                })
                            }

                        </Slider>
                        <div className="tab-content book-appointment-slot-list" id="pills-tabContent">

                            <div className="row">
                                <div className="col-12 text-right">
                                    <button className="btn btn-sm btn-primary" onClick={e => {setShowModal(true);setEdit('')}}>Add Slot</button>

                                </div>





                                {
                                    loader ? <ProcessLoader /> :

                                        slots.length > 0 ?
                                            slots.map(slot => {

                                                return <div className="col-md-3 book-appointment-slot-list-item mt-2">
                                                    <div className="card">
                                                        <div className="card-body d-flex">
                                                            {moment(slot.start_time, 'hh:mm A').format('hh:mm A') + " to " + moment(slot.end_time, 'hh:mm A').format('hh:mm A')}<br />
                                                            {"(total beds " + slot.total_beds + ")"}
                                                            <div className="slot-edit-section">
                                                                <a className="text-danger mr-2" onClick={e => deleteSlot(slot._id)}><i className="fas fa-trash"></i></a>
                                                                <a className="text-danger" onClick={e => { setShowModal(true); setEdit(slot) }}><i className="fas fa-edit"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            })
                                            :
                                            <div className='col-md-12 text-center'>
                                                <h4>{activeDay} slots not available</h4>
                                            </div>

                                }



                            </div>




                        </div> */}
                    <DateSlots centerId={centerId} />
                    </div>




                </div>
            </div>


            {showModal === true ? <AppointmentSlotModal setShowModal={setShowModal} getDaySlots={getDaySlots} day={activeDay} edit={edit} setEdit={setEdit} centerId={centerId} /> : ""}
        </Layout>
    )
}

export default Slots
