import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import ProcessLoader from '../../ReuseableComponent/ProcessLoader'
import DateSlotModal from './DateSlotModal'
import SlotModal from './SlotModal'



function DateSlots(props) {
    const { centerId } = props
    // const [edit, setEdit] = useState({})
    // const [dateSlots, setDateSlots] = useState([])
    // const [slotLoader, setSlotLoader] = useState(false)
    // const [activeDate, setActiveDate] = useState('')

    // const [showModal, setShowModal] = useState(false)

    // function getDateSlots(date) {

    //     setActiveDate(date)
    //     // alert(e.target.value)
    //     setSlotLoader(true)

    //     axiosBaseUrl.get(`admin/appointment/date-slots/${centerId}?date=${moment(date, 'YYYY-MM-DD').format("DD-MM-YYYY")}`)
    //         .then((res) => {
    //             console.log(res)
    //             setDateSlots(res.data.data)
    //             setSlotLoader(false)

    //         }).catch(error => {
    //             if (error.response) {
    //                 Swal.fire(error.response.data.error, '', 'error')


    //             }
    //             else if (error.request) {
    //                 // The request was made but no response was received
    //                 console.log(error.request);
    //             } else {
    //                 // Something happened in setting up the request that triggered an Error
    //                 console.log('Error', error.message);
    //             }
    //         })

    // }

    // function deleteSlot(id) {
    //     Swal.fire({
    //         title: 'Are You Sure?',
    //         // showDenyButton: true, 
    //         showCancelButton: true,
    //         confirmButtonText: `Delete`,
    //         // denyButtonText: `Don't save`,
    //     }).then((result) => {
    //         /* Read more about isConfirmed, isDenied below */
    //         if (result.isConfirmed) {

    //             axiosBaseUrl.delete(`admin/appointment/date-slot/delete/${id}?centerId=${centerId}`)
    //                 .then((res) => {

    //                     // console.log(res)
    //                     // setCenter(res.data.data)
    //                     Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
    //                     getDateSlots(activeDate)


    //                 }).catch(error => {
    //                     console.log(error.response)

    //                 })




    //         } else if (result.isDenied) {
    //             Swal.fire('Changes are not saved', '', 'info')
    //         }
    //     });
    // }

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
                breakpoint: 1230,
                settings: {
                    slidesToShow: 4,
                    //   slidesToScroll: 2,
                    initialSlide: 2
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

    var date = moment().format('DD/MM/YYYY')
    const [activeDate, setActiveDate] = useState(date)

    // const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])

    // const [patientDetail, setPatientDetail] = useState({})



    useEffect(() => {
        // getDates()
        getCurrentDateSlots(moment().format('DD/MM/YYYY'))
        // setActiveDate(moment().format('DD/MM/YYYY'))
    }, [])


    // function getDates() {


    //     axiosBaseUrl.get(`private/dates`)
    //         .then((res) => {
    //             // console.log(res.data.data)
    //             setDates(res.data.data)

    //             getCurrentDateSlots(res.data.data[0])


    //         }).catch(error => {
    //             console.log(error)
    //             if (error.response) {
    //                 Swal.fire(error.response.data.error, '', 'error')


    //             }
    //             else if (error.request) {
    //                 // The request was made but no response was received
    //                 console.log(error.request);
    //             } else {
    //                 // Something happened in setting up the request that triggered an Error
    //                 console.log('Error', error.message);
    //             }
    //         })
    // }

    function getCurrentDateSlots(date) {
        setActiveDate(date)
        date = moment(date, 'DD/MM/YYYY').format('DD-MM-YYYY')
        setSlots([])

        setLoading(true)

        axiosBaseUrl.get(`admin/appointment/date-slots/${centerId}?date=${date}`)
            .then((res) => {
                console.log(res.data.data)
                setSlots(res.data.data)
                setLoading(false)


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

                axiosBaseUrl.delete(`admin/appointment/date-slot/delete/${id}?centerId=${centerId}`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getCurrentDateSlots(activeDate)


                    }).catch(error => {
                        console.log(error.response)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }



    return (
        <>


<Slider {...settings}>
                        {

                            Array(30).fill().map((_, i) => {
                                //    var prev_date = date
                                var date = moment().add(i, 'days').format('DD/MM/YYYY')
                                //   console.log(activeDate)
                                return (
                                    <div>
                                        {
                                            moment(activeDate, 'DD-MM-YYYY').format('DD/MM/YYYY') === date ?
                                            <>
                                                <h3 className="active" onClick={e => getCurrentDateSlots(date)}>{date} 
                                                
                                                 <span className='ml-1'>({moment(date, 'DD/MM/YYYY').format('ddd')})</span>
                                                </h3>
                                               
                                                </>

                                                :
                                                <>
                                                <h3 className={activeDate === date ? "active" : ""} onClick={e => getCurrentDateSlots(date)}>{date}
                                                <span className='ml-1'>({moment(date, 'DD/MM/YYYY').format('ddd')})</span></h3>
                                                </>
                                        }
                                    </div>
                                )
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
                                    slots.length == 0 ?
                                        <div className='col-md-12'>
                                            <h3 className='text-center'>Slots not available</h3>
                                        </div>
                                        :
                                        slots.map(slot => {
                                            return <>
                                            <div className="col-md-4 book-appointment-slot-list-item mt-2">
                                                <div className="card">
                                                    <div className="card-body d-flex">
                                                        {moment(slot.start_time, 'hh:mm A').format('hh:mm A') + " to " + moment(slot.end_time, 'hh:mm A').format('hh:mm A') + " (total beds " + slot.total_bed + ")" + " (left beds " + slot.left_bed + ")"}
                                                        <div className="slot-edit-section">
                                                            <a className="text-danger mr-2" onClick={e => deleteSlot(slot._id)}><i className="fas fa-trash"></i></a>
                                                            <a className="text-danger" onClick={e => { setShowModal(true); setEdit(slot) }}><i className="fas fa-edit"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        })
                            }



                        </div>




                    </div>

                    {showModal === true ? <SlotModal setShowModal={setShowModal} getCurrentDateSlots={getCurrentDateSlots} date={activeDate} edit={edit} setEdit={setEdit} centerId={centerId} /> : ""}


            {/* <hr />
            <div>

                <div className='row'>
                    <div className='col-md-3'>
                        <input className='form-control' type="date" onChange={(e) => getDateSlots(e.target.value)} value={activeDate} />
                    </div>
                    <div className='col-md-9 text-right'>
                        <button className="btn btn-sm btn-primary" onClick={e => setShowModal(true)}>Add Slot</button>

                    </div>
                </div>


                {

                    slotLoader ?
                        <div className='text-center'>
                            <ProcessLoader />
                        </div>
                        :
                        dateSlots.length > 0 ?
                            <div className='card mt-5'>
                                <div className='card-body'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Total Beds</th>
                                                <th>Left Beds</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dateSlots.map(slot => {
                                                    console.log(slot);

                                                    return (
                                                        <tr>
                                                            <td>
                                                                {slot.start_time + " to " + slot.end_time}
                                                            </td>
                                                            <td>{slot.total_bed}</td>
                                                            <td>{slot.left_bed}</td>
                                                            <td>
                                                                <button className='btn btn-sm btn-danger mr-1' onClick={e => { setShowModal(true); setEdit(slot) }}><i className="fa fa-edit"></i></button>

                                                                <button className='btn btn-sm btn-danger' onClick={() => deleteSlot(slot._id)}><i className='fa fa-trash'></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            :
                            <div className='text-center mt-5'>
                                <h4>
                                    Slots not available
                                </h4>
                            </div>


                }





            </div>

            {
                showModal ? <DateSlotModal setShowModal={setShowModal} getDateSlots={getDateSlots} edit={edit} setEdit={setEdit} centerId={centerId} activeDate={activeDate} setActiveDate={setActiveDate} /> : ''
            } */}

        </>
    )
}

export default DateSlots
