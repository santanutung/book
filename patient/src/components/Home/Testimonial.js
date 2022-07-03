import React, {useState, useEffect} from 'react'

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { TestimonialData } from '../../rawData/TestimonialData';
import TestimonialModal from './TestimonialModal';
import {LOGIN, selectUserId, selectUserToken } from './../../Redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 2
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 2
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

function Testimonial() {

    const [showTestimonialModal, setShowTestimonialModal] = useState(false)
    const userToken = useSelector(selectUserToken)
    const dispatch = useDispatch()
    const [testimonials, setTestimonials] = useState([])
    const [reviewsExist, setReviewsExist] = useState(false)
    const userId = useSelector(selectUserId)
    useEffect(() => {
        const activeUser = localStorage.getItem('activeUser');
   

        if (activeUser) {
            dispatch(LOGIN({ userToken: activeUser }))
        }
        getTestimonials()
        if(userId) {

            checkCenterFeeback()
        }

    }, [])

    function getTestimonials() {
        axiosBaseUrl
          .get(`patients/api/testimonials/`)
          .then((res) => {
            setTestimonials(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }



    function checkCenterFeeback() {


        axiosBaseUrl.get(`patients/api/check-testimonial`)
            .then((res) => {
          
                setReviewsExist(res.data.data)
              

            }).catch(error => {
                console.log(error)

            })

    }
    return (
        <section id="testimonials" className="testimonials section-bg">
            <div className="container">

                <div className="section-title" data-aos="fade-up">
                    <h2>Testimonials</h2>
                </div>

                <div className={testimonials.length == 0  ? "text-center mt-3" : "text-right mt-3" }>
                {userToken != null && !reviewsExist? <a className='btn-service' onClick={() => setShowTestimonialModal(true)}>Add Feedback</a> : ''}
                   </div>

                <div className="testimonials-slider swiper" data-aos="fade-up" data-aos-delay="100">
                   
                  
                   
                    <Carousel
                        autoPlay={true}
                        autoPlaySpeed={2500}
                        infinite={true}
                        arrows={true}
                        responsive={responsive}

                    >
                        {
                            testimonials.map((testimonial, index) => {
                                return (<div className="swiper-slide" key={testimonial._id+"testimonial"}>
                                    <div className="testimonial-wrap">
                                        <div className="testimonial-item">
                                            <img src={testimonial.userId.profile_photo_path ? env.imageurl+testimonial.userId.profile_photo_path : "assets/img/user-icon.png"} className="testimonial-img" alt="" />
                                            <h3>{testimonial.userId?.name}</h3>
                                            <p>
                                                <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                                                {testimonial.review}
                                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>)
                            })
                        }

                    </Carousel>

                    <div className="swiper-pagination" ></div>
                </div>

            </div>
            <TestimonialModal showTestimonialModal={showTestimonialModal} setShowTestimonialModal={setShowTestimonialModal} checkCenterFeeback={checkCenterFeeback} />

          </section>
    )
}

export default Testimonial
