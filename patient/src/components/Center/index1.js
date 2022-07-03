import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';
import numberFormat from '../../functions';
import Layout from '../Layout'
import About from './About';
import Reviews from './Reviews';
import Slots from './Slots';

function Center2(props) {

    const [showReviewModal, setShowReviewModal] = useState(false)

    const params = useParams();

   
    const [centerDetails, setCenterDetails] = useState({})
    const [centerListData, setCenterListData] = useState([])
    const [reviews, setReviews] = useState([])
    const [times, setTimes] = useState([])

    const [activeTab, setActiveTab] = useState("appointment")



    useEffect(() => {
     
        centerDetail()
        centerList()
    }, [])


    function centerDetail() {

        axiosBaseUrl.get(`patients/api/center/${params.id}`)
            .then((res) => {
             
                setCenterDetails(res.data.data)
                setTimes(res.data.data.times)
                setReviews(res.data.reviews)

            }).catch(error => {
                console.log(error)

            })
    }

    function centerList() {
        // navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position.coords.latitude)
        // console.log(position.coords.longitude);

        axiosBaseUrl.get(`patients/api/all-center?&verify_status=approved&status=active`
            // , { lat: position.coords.latitude, long: position.coords.longitude }
        )
            .then((res) => {
                // console.log(res.data)
                // setCenterListData(res.data.data)

            }).catch(error => {
                console.log(error)

            })
        // })

    }

    function rating(rating1, rating2, rating3) {
        return (parseInt(rating1) + parseInt(rating2) + parseInt(rating3))
    }



    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <Layout>
            <div className='card mt-6'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-3'>
                            <img src={env.imageurl + centerDetails?.primaryImage} width="100%" className='center-desc-image' alt={centerDetails?.name} />
                        </div>
                        <div className='col-md-5 mt-3'>
                            <p><h3 className='center-name'>{centerDetails?.name}</h3></p>
                            <p>

                                <ul className='center-rating '>

                                    {

                                        Array(centerDetails?.rating ? parseInt(centerDetails?.rating) : 0).fill().map((_, i) => {

                                            return (
                                                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                            )
                                        })
                                    }




                                </ul>
                            </p>
                            <p className='mt-1'><h6>{centerDetails?.address + " " + (centerDetails.area != null ? centerDetails.area : ' ') + " " + centerDetails?.city + " " + centerDetails?.state + " - " + centerDetails?.pincode}</h6></p>

                            <p className='price mt-1'>{numberFormat(centerDetails.charges).replace('.00', '')} Per Dialysis</p>
                            <p className='d-flex total-let-beds mt-1'>Today Available beds <span className="bed-l">{centerDetails.total_beds}</span></p>


                        </div>
                        <div className='col-md-4'>
                            <div className="service-i center-timing">
                                <p ><strong>Timings </strong>
                                    <br />
                                    <ul  >
                                        {
                                            times.map((time, t_index) => {
                                                return <li key={time._id + "time"}>{time.day + "(" + time.opening_time + " - " + time.closing_time + ")"}</li>
                                            })
                                        }
                                    </ul>
                                </p>

                                {/* <p className="monthly-subscription"><a href="#appointment-section" type="button" className="btn-service">Book a slot</a></p> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='container'>
                <div classname="table-responsive">
                    <div classname="table text-center">
                        <ul className="nav justify-content-center">
                            <li className="nav-item">
                                <a class={activeTab === 'appointment' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("appointment")}>Booking Slots</a>
                            </li>
                           

                            <li className="nav-item">
                                <a class={activeTab === 'reviews' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("reviews")}>Review Ratings</a>
                            </li>

                            <li className="nav-item">
                                <a class={activeTab === 'about' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("about")}>About   </a>
                            </li>





                        </ul>
                    </div>

                    {activeTab === 'appointment' ?
                        <Slots centerId={params.id} />
                        :
                        (
                            activeTab === 'reviews' ?
                                <Reviews centerId={params.id} centerDetails={centerDetails} centerDetail={centerDetail} />
                                :
                                <About center={centerDetails} />

                        )
                    }

                </div>

            </div>
        </Layout>
    )
}

export default Center2
