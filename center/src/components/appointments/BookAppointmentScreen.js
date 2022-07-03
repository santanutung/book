import React, { useState, useEffect } from 'react'
import Layout from '../../Layout';


import Footer from '../partials/Footer';
import Slider from "react-slick";
import BookAppointmentForm from './BookAppointmentForm';
import axiosBaseUrl from '../../axiosBaseUrl';
import Swal from 'sweetalert2';
import ExistUser from './ExistUser';
import Radio from '../../custom/Radio';
import MainScreenLoader from '../../custom/MainScreenLoader';
import ProcessLoader from '../../custom/ProcessLoader';
import useGlobalContexts from '../../context/GlobalState';
import Loader from '../../custom/Loader';
const moment = require('moment')


function BookAppointmentScreen() {

    const { setLoaderState } = useGlobalContexts

    const [loading, setLoading] = useState(true)

    const [processingLoader, setProcessingLoader] = useState(false)

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
    const [selectSlot, setSelectSlot] = useState('')

    const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])




    const [patientForm, setPatientForm] = useState('')


    const [familyMembers, setFamilyMember] = useState([]);

    const [patientDetail, setPatientDetail] = useState({mobile:''})
    const [processLoading, setProcessLoading] = useState(false)

    const handleChangeInput = (e) => {
        const newData = { ...patientDetail }
        if (e.target.name == 'mobile') {
           
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {

                newData[e.target.name] = e.target.value

                setPatientDetail(newData)
            }
        }
       



    }

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
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            })
    }

    function getCurrentDateSlots(date) {
        setActiveDate(date)
        setSlots([])
        setProcessLoading(true)
        axiosBaseUrl.get(`private/dates?date=${date}`)
            .then((res) => {
                // console.log(res.data.data)
                setSlots(res.data.data)
                setLoading(false)
                setProcessLoading(false)


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

    const checkPhoneNumber = (e) => {
        e.preventDefault()


        if (!selectSlot) {
            Swal.fire('Please select a slot', '', 'error')

        }

        else if (!patientDetail.mobile) {
            Swal.fire('Please enter mobile number', '', 'error')
        }
        else if(patientDetail.mobile.length !== 10) {
            Swal.fire('Mobile Number is invalid', '', 'error')
        }

        else {
            setProcessingLoader(true)

            axiosBaseUrl.get(`private/patient/family-member-find/${patientDetail.mobile}`)
                .then((res) => {
                    // if()
                    // console.log(res.data.data)
                    setProcessingLoader(false)

                    if (res.status == 200) {
                        // var data = res.data.data.familyMambers

                        // data.push(res.data.data.user)
                        // console.log(data)
                        setFamilyMember({ 'members': res.data.data.familyMambers, 'user': res.data.data.user })
                        setPatientForm('family')
                    }
                    else {
                        setPatientForm('new')
                    }

                    // setFamilyMember(res.data.data)

                    // if(res.data.data)
                    // setPatientForm('new')


                }).catch(error => {
                    setProcessingLoader(false)

                    // console.log(error.response)
                    if (error.response.status == 422) {
                        setPatientForm('new')
                    }
                    // else if (error.response) {
                    //     Swal.fire(error.response.data.error, '', 'error')


                    // }
                    // else if (error.request) {
                    //     // The request was made but no response was received
                    //     console.log(error.request);
                    // } else {
                    //     // Something happened in setting up the request that triggered an Error
                    //     console.log('Error', error.message);
                    // }
                })


            // setPatientForm('new')

        }





    }


    if (loading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        )
    }


  
    return (
        <Layout>

            <div className="main-panel">
                <div className="content-wrapper">


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




                    <Slider {...settings}>
                        {
                            dates.map(date => {
                                return <div key={date}>
                                    <h3 className={activeDate == date ? "active" : ""} onClick={e => getCurrentDateSlots(date)}>{moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY')} ({moment(date, 'DD-MM-YYYY').format('ddd')}) </h3>
                                </div>
                            })
                        }

                    </Slider>



                    <div className="tab-content book-appointment-slot-list" id="pills-tabContent">

                        <div className="row">

                            {
                                processLoading ?
                                    <div className='col-md-12 mt-2'>
                                        <ProcessLoader />
                                    </div>

                                    :
                                    slots.map(slot => {
                                        return slot.left_bed > 0 ?
                                            <div className="col-md-3 book-appointment-slot-list-item mt-2" key={slot._id}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <Radio select={selectSlot} setSelect={setSelectSlot} id={slot._id} value={moment(slot.start_time, 'hh:mm A').format('hh:mm A') + " to " + moment(slot.end_time, 'hh:mm A').format('hh:mm A') + " (total beds " + slot.left_bed + ")"} />

                                                    </div>
                                                </div>
                                            </div>
                                            : ''

                                    })
                            }



                        </div>




                    </div>

                    {/* <div className="text-right">
                        <button className="btn btn-sm btn-secondary">Next</button>
                    </div> */}

                    {

                        processingLoader ?
                            <ProcessLoader />
                            :
                            patientForm == '' ?
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={checkPhoneNumber}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Enter Patient Mobile Number</label>
                                                        <input className="form-control" placeholder="xxxxxxxxxx" name="mobile"
                                                            onChange={(e) => handleChangeInput(e)} 
                                                            value={patientDetail.mobile} 
                                                            />
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group text-right">
                                                        <button className="btn btn-sm btn-secondary" type="submit">Next</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                                :

                                patientForm == 'new' ?
                                    <BookAppointmentForm getDates={getDates} setPatientForm={setPatientForm} patientDetail={patientDetail} setPatientDetail={setPatientDetail} activeDate={activeDate} selectSlot={selectSlot} setSelectSlot={setSelectSlot} />
                                    :
                                    patientForm == 'family' ?
                                        <ExistUser getDates={getDates} familyMembers={familyMembers} setFamilyMember={setFamilyMember} setPatientForm={setPatientForm} patientDetail={patientDetail} setPatientDetail={setPatientDetail} activeDate={activeDate} selectSlot={selectSlot} setSelectSlot={setSelectSlot} />
                                        : null

                    }




                </div>



                <Footer />

            </div>



        </Layout >


    )
}

export default BookAppointmentScreen
