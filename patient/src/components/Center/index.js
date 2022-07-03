import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';
import numberFormat from '../../functions';
import Layout from '../Layout'
import About from './About';
import Reviews from './Reviews';
import Slots from './Slots';
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import $ from "jquery";
import useGlobalContexts from '../../context/GlobalContext';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';
import SelectSlotModal from './SelectSlotModal';
import { DatePickerComponent, DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
// import '../../ce'
import '../../center.css';
import PreviewModal from './PreviewModal';
import { socket } from '../../context/sokcet';
const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const responsiveMoreCenter = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 3
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
}


const responsiveSlot = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 4
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
    }
};

function Center(props) {
    let location = useLocation();
  
    const { setLoaderState } = useGlobalContexts()
    const history = useHistory()
    const [tab, setTab] = useState('slot')
    const params = useParams();
    const [showModal, setShowModal] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const { loginState, setLoginState } = useGlobalContexts();

    const [centerDetails, setCenterDetails] = useState({})
    const [centerListData, setCenterListData] = useState([])
    const [reviews, setReviews] = useState([])
    const [times, setTimes] = useState([])

    const [activeTab, setActiveTab] = useState("appointment")
    const [reviewList, setReviewsList] = useState([])
    const [todayTime, setTodayTime] = useState("Today Closed")


    const [activeDate, setActiveDate] = useState('')

    const [dates, setDates] = useState([])
    const [dateLimit, setDateLimit] = useState([])
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState({})
    const [loading, setLoading] = useState(true)


    const [totalDate, setTotalDate] = useState(1)


    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            getSize()
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    function getSize() {
        if (window.innerWidth <= 542) {
            setTotalDate(1)
        }
        else if (window.innerWidth > 464 && window.innerWidth <= 767) {
            setTotalDate(2)
            // alert("est")

        }
        else if (window.innerWidth > 767 && window.innerWidth <= 1070) {
            setTotalDate(2)

        }
        else {
            setTotalDate(3)
        }
      
        setSize([window.innerWidth, window.innerHeight]);
    }

    useEffect(() => {

        getSize()
     
        centerDetail()
        centerList()
        // getReviews()
        scroll()
        centerSlotDates()
    }, [params])

    function scroll() {
   

        window.scroll(0, document.getElementById('center-profile').offsetTop - 50);
    }


    function centerDetail() {
        // navigator.geolocation.getCurrentPosition((position) => {
            var url = `patients/api/center/${params.id}?`

            // url += `&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`

            axiosBaseUrl.get(url)
                .then((res) => {
              
                    setCenterDetails(res.data.data[0])
                    setTimes(res.data.data[0].times)
                    setReviews(res.data.reviews)
                    todayTiming(res.data.data[0].times)

                }).catch(error => {
               

                })
        // }
        // )

    }





    function centerList() {

        var url = `patients/api/all-center?page=1&limit=10&verify_status=approved&status=active`;

        // navigator.geolocation.getCurrentPosition((position) => {


        //     url += `&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`


        axiosBaseUrl.get(url)
            .then((res) => {

                setCenterListData(res.data.data.docs)


            }).catch(error => {
              

            })


        // })

    }



    function centerSlotDates() {

        axiosBaseUrl.get(`patients/api/center/slot/dates/${params.id}`)
            .then((res) => {
           
                setDates(res.data.data)

                    if(location.state.searchData.date) {
                     
                        // alert(location.state.searchData.date)
                        getCurrentDateSlots(moment(location.state.searchData.date, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                    }
                    else {

                        getCurrentDateSlots(res.data.data[0])
                    }


            }).catch(error => {
               

            })
    }

    function getCurrentDateSlots(date) {
 
        setActiveDate(date)
        setSlots([])
        setLoading(true)

        axiosBaseUrl.get(`patients/api/center/slot/dates/${params.id}?date=${date}`)
            .then((res) => {
               
                setSlots(res.data.data)
                setLoading(false)
                total_beds = 0;


            }).catch(error => {
           
                if (error.response) {
                    Swal.fire(error.response.data.error, '', 'error')


                }
                else if (error.request) {
                    // The request was made but no response was received
                   
                } else {
                    // Something happened in setting up the request that triggered an Error
                 
                }
            })
    }

    function todayTiming(times) {
        var time = times.filter((time, index) => {
            if (time.day.toLowerCase() === moment().format('dddd').toLowerCase()) {
                return time
            }
        })
        if (time.length > 0) {
            var today_time = time[0].opening_time + " - " + time[0].closing_time;
            setTodayTime(today_time)
        }
    }

    var total_beds = 0

    function selectSlotHandler(slot) {
        if (localStorage.getItem('activeUser') !== undefined && localStorage.getItem('activeUser') !== null) {

            setSelectedSlot(slot); setShowModal(true)
        }
        else {

            setLoginState(true)

        }



    }


    function rescheduleAppointment(selectedslot) {
        var appointment_id = location.state.appointment_id
        Swal.fire({
            title: 'Do you want to reschedule appoinment?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
        }).then((result) => {

            setLoaderState(true)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`patients/api/reschedule-appointment/${appointment_id}`, { slot_id: selectedslot })
                    .then((res) => {
                        setLoaderState(false)
                        Swal.fire('Rescheduled!', 'Appointment is successully reschedule', 'success')
                        // alert("test")
                        socket.emit("notification", params.id, res.data.data);
                        history.push("/profile");
                        // socket.emit("cancel-appointment",  appointmentDetail.center_id._id);


                    }).catch(error => {
                     
                        if (error.response) {
                            if(error.response.status === 423) {

                                Swal.fire("", error.response.data.message, '', 'error')
                            }
        
        
                        }
                        else if (error.request) {
                            // The request was made but no response was received
                           
                        } else {
                            // Something happened in setting up the request that triggered an Error
                         
                        }
                        setLoaderState(false)
                  

                    })




            }
            else {
                setLoaderState(false)
            }
        });
    }

    return (
        <Layout>
            <>
                <div className='center-profile pt-4' id="center-profile">
                    <>
                        <section className="centre-sec">
                            <div className="container">
                                <div className="row">
                                    <div className="content-wrap">
                                        <section className="content-current">
                                            <div className="card max-lab">
                                                <div className="container-fluid">
                                                    <div className='row'>
                                                        <div className="wrapper wrapper-row">
                                                            {/* <div className="preview col-4 main-image" style={{ backgroundImage: "url(" + env.imageurl + centerDetails.primaryImage + ")" }}>
                                                      
                                                    </div> */}

                                                            <div className="col-5 rs-right">
                                                                <div className='row'>
                                                                    <div className='col-8 col-md-10'>
                                                                        <div className="preview-pic tab-content relative">
                                                                            <div className="tab-pane active" id="pic-1">
                                                                                <img src={env.imageurl + centerDetails?.primaryImage} />
                                                                            </div>

                                                                            {
                                                                                centerDetails.distance ? <a href="#" className="btn btn-info btn-t center-profile-distance">

                                                                                    {centerDetails.distance.toFixed(2)} KM Away
                                                                                </a> : ""
                                                                            }


                                                                            {/* <div className="map-circle center-profile-mobile">
                                                                                <p>
                                                                                    View on
                                                                                    Maps
                                                                                </p>
                                                                                <img src="img/center-img1.jpg" />
                                                                            </div> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-4 col-md-2'>
                                                                        <div className='row'>
                                                                            <ul className="preview-thumbnail nav nav-tabs">
                                                                                {
                                                                                    centerDetails.images ?
                                                                                        centerDetails.images.slice(0, 2).map((image, index) => {
                                                                                            return (
                                                                                                <li>
                                                                                                    <a data-target="#pic-2" data-toggle="tab">
                                                                                                        <img
                                                                                                            src={env.imageurl + image?.image}
                                                                                                            style={{ borderRadius: 10 }}
                                                                                                        />
                                                                                                    </a>
                                                                                                </li>
                                                                                            )
                                                                                        })

                                                                                        : ''
                                                                                }
                                                                                <li className="view-btn" onClick={() => setShowPreviewModal(true)}>
                                                                                    <a data-target="#pic-3" data-toggle="tab" className='view-btnss'>
                                                                                        View More
                                                                                    </a>
                                                                                </li>

                                                                            </ul>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='center-profile-mobile row'>
                                                                    {/* <div className="col-6">
                                                                        <div className='map-circle'>
                                                                            <span>View on maps</span>
                                                                            <img src="img/center-img1.jpg" />
                                                                        </div>
                                                                    </div> */}
                                                                    <div className="col-12 d-flex">
                                                                        <div className='map-circle mr-1'>

                                                                            <img src="img/view-map.png" />
                                                                        </div>
                                                                        <p className='rating-heading ml-3'>Rating <br />
                                                                            <ul className="rating-li">
                                                                                {
                                                                                    centerDetails.rating ?

                                                                                        Array(5).fill().map((_, i) => {

                                                                                            return (
                                                                                                <li key={i + "star"}><i className={i < parseInt(centerDetails.rating.split('.')[0]) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                                            )
                                                                                        })
                                                                                        : ''
                                                                                }


                                                                            </ul>
                                                                        </p>
                                                                        <p>

                                                                        </p>
                                                                    </div>

                                                                    {/* <div className='row'>
                                                                                    <div className='col-md-6'>
                                                                                    <p >Rating</p>
                                                                                    </div>
                                                                                    <div className='col-md-6'>
                                                                                      
                                                                                <p>
                                                                                    <ul className="rating-li">
                                                                                        {
                                                                                            centerDetails.rating ?
                                                                                                Array(5).fill().map((_, i) => {
                                                                                                    return (
                                                                                                        <li key={i + "star"}><i className={i < parseInt(centerDetails.rating.split('.')[0]) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                                                    )
                                                                                                })
                                                                                                : ''
                                                                                        }
                                                                                    </ul>
                                                                                </p>
                                                                                    </div>
                                                                                </div> */}


                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className='row'>
                                                                    <div className="details col-md-8">
                                                                        <h3 className="product-title capitalize">{centerDetails.name}</h3>
                                                                        <p className="delhi-l delhi-dh">{centerDetails.area ? centerDetails.area : ''} {centerDetails.city} {centerDetails.state}</p>

                                                                        <div className="col-6 center-profile-desktop">
                                                                            <div className='map-circle'>

                                                                                <img src="img/view-map.png" />
                                                                            </div>
                                                                        </div>
                                                                        <ul className="timing-k time-d">
                                                                            <li>No. of beds available {centerDetails.total_left_bed}</li>
                                                                            <li>Timings {todayTime}</li>

                                                                        </ul>
                                                                        <ul className="service-rightp">
                                                                            <li>
                                                                                <strong>{numberFormat(centerDetails.charges).replace('.00', '')}</strong>
                                                                            </li>
                                                                            <li className="session-ll" style={{ fontSize: 14 }}>
                                                                                Per Dialysis
                                                                            </li>
                                                                            <li>
                                                                                <i
                                                                                    className="fa fa-exclamation-circle"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="col-md-4 center-profile-desktop">
                                                                        <div className="text-right">

                                                                            {/* <i className="fa fa fa-heart-o" /> */}

                                                                            {/* <br />
                                                                            <br /> */}

                                                                            <div className='rating-p center-profile-desktop'>
                                                                                <p >Rating</p>
                                                                                <p>
                                                                                    <ul className="rating-li">
                                                                                        {
                                                                                            centerDetails.rating ?

                                                                                                Array(5).fill().map((_, i) => {

                                                                                                    return (
                                                                                                        <li key={i + "star"}><i className={i < parseInt(centerDetails.rating.split('.')[0]) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                                                    )
                                                                                                })
                                                                                                : ''
                                                                                        }


                                                                                    </ul>
                                                                                </p>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabs tabs-style-shape">

                                                <nav className="respo___nav">
                                                    {/* <div className='row'>
                                                    <div className='col-md-8 offset-md-2 row'>
                                                        <div className='col-6 nav-item'>
                                                            <a
                                                                onClick={() => setTab('slot')}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="pills-home"
                                                                aria-selected="true"
                                                            >
                                                               
                                                               <img className="tab__css" src={tab === 'slot' ? "img/tab-design-1.png" : ""} />
                                                                <h5 className="img__position__tabcss">Slot Booking </h5>
                                                            </a>
                                                        </div>
                                                        <div className='col-6 nav-item'>
                                                            <a
                                                                onClick={() => setTab('about')}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="pills-home"
                                                                aria-selected="true"
                                                            >
                                                              
                                                                <img className="tab__css" src={tab === 'about' ? "img/tab-design-1.png" : ""} />
                                                                <h5 className="img__position__tabcss">About Centre</h5>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                    <ul className="nav nav-pills mb-3 desktop-tab" id="pills-tab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a
                                                                onClick={() => setTab('slot')}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="pills-home"
                                                                aria-selected="true"
                                                            >
                                                                <svg viewBox="0 0 80 60" preserveAspectRatio="none">
                                                                    <use
                                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                        xlinkHref="#tabshape"
                                                                    />
                                                                </svg>
                                                                <img className={tab === 'slot' ? "tab__css" : "tab__css text1"} src="img/tab-design-1.png" />

                                                                <h5 className="img__position__tabcss">Slot Booking </h5>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a
                                                                onClick={() => setTab('about')}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="pills-home"
                                                                aria-selected="true"
                                                            >
                                                                <svg viewBox="0 0 80 60" preserveAspectRatio="none">
                                                                    <use
                                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                        xlinkHref="#tabshape"
                                                                    />
                                                                </svg>
                                                                <img className={tab === 'about' ? "tab__css" : "tab__css text1"} src="img/tab-design-1.png" />

                                                                <h5 className="img__position__tabcss">About Centre</h5>
                                                            </a>
                                                        </li>

                                                        {/* <li className="nav-item about" role="presentation">
                                                            <a
                                                                onClick={() => setTab('about')}
                                                                id="pills-home-tab"
                                                                data-bs-toggle="pill"
                                                                data-bs-target="#pills-home"
                                                                type="button"
                                                                role="tab"
                                                                aria-controls="pills-home"
                                                                aria-selected="true"
                                                            >
                                                                <svg viewBox="0 0 80 60" preserveAspectRatio="none">
                                                                    <use
                                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                        xlinkHref="#tabshape"
                                                                    />
                                                                </svg>
                                                                <img className={tab === 'about' ? "tab__css" : "tab__css hide"} src="img/tab-design-1.png" />
                                                                <h5 className="img__position__tabcss">About Centre </h5>
                                                            </a>
                                                        </li>
                                                         */}
                                                    </ul>

                                                    <div className="tab-content mobile-tab" id="pills-tabContent">
                                                        <div
                                                            onClick={() => setTab('slot')}
                                                            className={tab === 'slot' ? "tab-pane show active" : "tab-pane"}
                                                            id="pills-home"
                                                            role="tabpanel"
                                                            aria-labelledby="pills-home-tab"
                                                        >
                                                            Slot Booking
                                                        </div>
                                                        <div
                                                            onClick={() => setTab('about')}
                                                            className={tab === 'about' ? "tab-pane show active" : "tab-pane"}
                                                            id="pills-profile"
                                                            role="tabpanel"
                                                            aria-labelledby="pills-profile-tab"
                                                        >
                                                            About Centre
                                                        </div>
                                                    </div>

                                                </nav>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </section>


                        <section className={tab === 'about' ? "tabs tabs-style-shape active tab-list" : "tabs tabs-style-shape tab-list"} id="section-shape-2">
                            <div className="">
                                <div className="container-fliud1">
                                    <div className="wrapper row  container-fliud">
                                        <div dangerouslySetInnerHTML={{ __html: centerDetails.introduction }} />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="heading-r">Ratings</h3>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-md-8 offset-md-2">
                                            <div className="row">
                                                <div className="col-4 col-md-4">
                                                    <div className="rate-h">
                                                        <h3>Cleanliness</h3>
                                                        <ul>


                                                            {

                                                                Array(5).fill().map((_, i) => {

                                                                    return (
                                                                        <li><i className={i < parseInt(centerDetails?.cleanliness_rating) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                    )
                                                                })
                                                            }

                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4">
                                                    <div className="rate-h">
                                                        <h3>Hygiene</h3>
                                                        <ul>

                                                            {

                                                                Array(5).fill().map((_, i) => {

                                                                    return (
                                                                        <li><i className={i < parseInt(centerDetails?.hygiene_rating) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4">
                                                    <div className="rate-h">
                                                        <h3>Service</h3>
                                                        <ul>

                                                            {

                                                                Array(5).fill().map((_, i) => {

                                                                    return (
                                                                        <li><i className={i < parseInt(centerDetails?.service_rating) ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i></li>
                                                                    )
                                                                })
                                                            }

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </div>

                                </div>
                            </div>
                        </section>
                        <section className={tab === 'slot' ? "tabs tabs-style-shape active tab-list" : "tabs tabs-style-shape tab-list"} id="section-shape-1">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">


                                        <div className="tabset">

                                            <div className="row row-tab">

                                                {
                                                    dates.slice(0, totalDate).map(date => {
                                                        return (
                                                            <>
                                                                <div className='col-4 col-md-3 relative pointer' onClick={() => { setActiveDate(date); getCurrentDateSlots(date) }}>
                                                                    <p>
                                                                        <b>{moment(date, 'DD-MM-YYYY').format('D MMM ‘YY')}</b> <br />
                                                                        {moment(date, 'DD-MM-YYYY').format('ddd')}
                                                                    </p>
                                                                    <img className={activeDate === date ? "date-tab-1" : "date-tab-1 hide"} src="img/second-tab.png" />
                                                                </div>



                                                            </>)
                                                    })
                                                }
                                                {
                                                    dates.length > 0 ?

                                                        <div className='col-4 col-md-3 relative pointer' >

                                                            <h5 className="date-txt date-calendar">

                                                                <label htmlFor="tab4 relative">
                                                                    <i className="fa fa-calendar " aria-hidden="true" />
                                                                    <span className="select-date">{activeDate ? moment(activeDate, 'DD-MM-YYYY').format('D MMM ‘YY') : 'Select a date'}</span>

                                                                    <DatePickerComponent

                                                                        min={new Date()}
                                                                        max={dates.slice(-1)}
                                                                        onChange={(e) => {
                                                                           
                                                                            setActiveDate(moment(e.target.value).format('DD-MM-YYYY')); getCurrentDateSlots(moment(e.target.value).format('DD-MM-YYYY'))
                                                                        }

                                                                        }

                                                                        id="datepicker" placeholder="Enter date"
                                                                    />
                                                                </label>
                                                            </h5>
                                                            <img className={!dates.slice(0, totalDate).includes(activeDate) ? "date-tab-1" : "date-tab-1 hide"} src="img/second-tab.png" />
                                                        </div>



                                                        : ''
                                                }

                                               
                                            </div>

                                         


                                            <div className="tab-panels">
                                                <section className="tab-panel">
                                                    <div className="row">
                                                        {
                                                            slots.map((slot, index) => {

                                                                total_beds = slot.left_beds + total_beds
                                                                return (
                                                                    <div className="col-md-6 col-lg-4 slot-item">
                                                                        {/* <div className=""> */}
                                                                        <a className={selectedSlot._id === slot._id ? "button-time active" : "button-time"} onClick={() => {  location.state && location.state.appointment_id ? rescheduleAppointment(slot._id) : selectSlotHandler(slot) }}>{slot.start_time + " - " + slot.end_time} </a>
                                                                        {/* </div> */}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                        {
                                                            total_beds === 0 ? <div><h4 className='text-center not-available'>Slots are not available</h4></div> : ''
                                                        }


                                                    </div>
                                                </section>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <br />
                                <div className="row mb-3">
                                    <div className="col-lg-6 offset-lg-3">
                                        <div className="row">
                                            <div className="col-6 col-md-6 text-center">
                                                <i className="fa fa-circle blue-circle" aria-hidden="true" />
                                                <p className="slots-l">Slot Selected</p>
                                            </div>
                                        
                                            <div className="col-6 col-md-6 text-center">
                                                <i className="fa fa-circle single-circle" aria-hidden="true" />
                                                <p className="slots-l">Slot Available</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </section>
                    </>

                    <Reviews centerId={params.id} />




                    <section>
                        <div className="container">
                            <div className="row">
                                <h3 className="options-l">More Related Options</h3>
                                <div className="owl-carousel owl-carousel-1 owl-theme">
                                    <Carousel responsive={responsiveMoreCenter}>


                                        {centerListData.map((center, index) => {
                                            return (
                                                <>
                                                    <div className="item">
                                                        <Link to={"/centre/" + center._id}>
                                                            <div className="col-md-4 box-img">
                                                                <div className="">
                                                                    <img src={env.imageurl + center.primaryImage} width="100%" className="img-fluid" alt={center.name} />

                                                                </div>
                                                                <div className="hospital-head">
                                                                    <h3 className="center-name">{center.name}</h3>
                                                                    <span>{center.city + " " + center.state}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </>
                                            );
                                        })}


                                    </Carousel>



                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>

            <SelectSlotModal showModal={showModal} setShowModal={setShowModal} center={centerDetails} selectedSlot={selectedSlot} />
            <PreviewModal showModal={showPreviewModal} setShowModal={setShowPreviewModal} center={centerDetails} />

        </Layout >
    )
}

export default Center