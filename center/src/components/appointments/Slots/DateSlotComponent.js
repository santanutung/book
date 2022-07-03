import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import ProcessLoader from '../../../custom/ProcessLoader';
import SlotModal from './SlotModal';

function DateSlotComponent() {
    const [loading, setLoading] = useState(true)

    const [processingLoader, setProcessingLoader] = useState(false)

    const [edit, setEdit] = useState({})
    const [showModal, setShowModal] = useState(false)

    var settings = {
        // dots: true,
        infinite: false,
        navigator: true,
        speed: 500,
        slidesToShow: 6,
        // slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
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

    const [activeDate, setActiveDate] = useState('')

    const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])

    const [patientDetail, setPatientDetail] = useState({})

   

    useEffect(() => {
        getDates()
    }, [])


    function getDates() {


        axiosBaseUrl.get(`private/dates`)
            .then((res) => {
                // console.log(res.data.data)
                setDates(res.data.data)

                getCurrentDateSlots(res.data.data[0])


            }).catch(error => {
                // console.log(error)
                if (error.response) {
                    Swal.fire(error.response.data.error, '', 'error')


                }
                else if (error.request) {
                    // The request was made but no response was received
                    // console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    // console.log('Error', error.message);
                }
            })
    }

    function getCurrentDateSlots(date) {
        setActiveDate(date)
        setSlots([])

        setLoading(true)

        axiosBaseUrl.get(`private/dates?date=${date}`)
            .then((res) => {
                // console.log(res.data.data)
                setSlots(res.data.data)
                setLoading(false)


            }).catch(error => {
                // console.log(error)
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

                axiosBaseUrl.delete(`private/appointment/date-slot/delete/${id}`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getCurrentDateSlots(activeDate)


                    }).catch(error => {
                        // console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }
    return (
        <div className='mt-5'>
            
            <Slider {...settings}>
                        {
                            dates.map(date => {
                                return <div>
                                    <h3 className={activeDate == date ? "active" : ""} onClick={e => getCurrentDateSlots(date)}>{date} </h3>
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
                                <div className='col-md-12 text-center mt-2'>
                                    <ProcessLoader />
                                </div>
                                :
                                slots.map(slot => {
                                    return <div className="col-md-3 book-appointment-slot-list-item mt-2">
                                        <div className="card">
                                            <div className="card-body d-flex">
                                                {moment(slot.start_time, 'hh:mm A').format('hh:mm A') + " to " + moment(slot.end_time, 'hh:mm A').format('hh:mm A') + " (total beds " + slot.total_bed + ")" + " (left beds " + slot.left_bed + ")"}
                                                <div className="slot-edit-section">
                                                    <a className="text-danger mr-2" onClick={e => deleteSlot(slot._id)}><i className="fas fa-trash"></i></a>
                                                    <a className="text-danger" onClick={e => { setShowModal(true); setEdit(slot) }}><i className="fas fa-pencil"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }



                        </div>




                    </div>
            {showModal === true ? <SlotModal setShowModal={setShowModal} getCurrentDateSlots={getCurrentDateSlots} day={activeDate} edit={edit} setEdit={setEdit} activeDate={activeDate} /> : ""}

        </div>
    )
}

export default DateSlotComponent
