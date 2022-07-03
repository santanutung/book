import React, { useState, useEffect, useLayoutEffect } from 'react'
import Carousel from 'react-multi-carousel';
import axiosBaseUrl from '../../axiosBaseUrl'
import { env } from '../../env'
import ReviewModal from '../../ReusableComponents/ReviewModal'
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
function Reviews(props) {
    const { centerId } = props
    const [showReviewModal, setShowReviewModal] = useState(false)
    // const [reviewsList, setReviewsList] = useState([])
    const [reviewsExist, setReviewsExist] = useState(false)
    const [reviewList, setReviewsList] = useState([])

    const [testimonialLength, setTestimonialLength] = useState(0);
    const [extendTestimonial, setExtendTestimonial] = useState('');
    useLayoutEffect(() => {
      
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
  
  
    function updateSize() {
        
        if(window.innerWidth <= 367) {
          setTestimonialLength(100)
        }
        else  if(window.innerWidth <= 767) {
          setTestimonialLength(200)
        }
        else  if(window.innerWidth <= 951) {
          setTestimonialLength(400)
        }
        else {
          setTestimonialLength(400)
        }
        // setSize([window.innerWidth, window.innerHeight]);
    }

    

    useEffect(() => {
        updateSize()
        getReviews()
        checkCenterFeeback()
    }, [])
   
    function getReviews() {

        axiosBaseUrl.get(`patients/api/center/${centerId}/reviews`)
            .then((res) => {
               
                setReviewsList(res.data.data)
              
                checkCenterFeeback()


            }).catch(error => {
            

            })
    }


    function checkCenterFeeback() {


        axiosBaseUrl.get(`patients/api/check-center-feedback?center_id=${centerId}`)
            .then((res) => {

                if (res.data.check_appointment === true && res.data.data === false) {
                    setReviewsExist(true)
                }


            }).catch(error => {
             

            })

    }
    return (
        <>



            <div className="demo">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 offset-md-1">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h3 className="customer-h">Customer’s Feedback

                                    </h3>
                                </div>
                                <div className='col-md-6'>
                                    {

                                        reviewsExist ?
                                            <div className='text-right mt-3 mb-5'>
                                                <a className='btn-service feedback-btn' onClick={() => setShowReviewModal(true)}>Add Feedback</a>
                                            </div> : ''
                                    }
                                </div>
                            </div>

                            {/* <div id="testimonial-slider" className="owl-carousel"> */}




                            <Carousel
                                autoPlay={false}
                                autoPlaySpeed={2500}
                                infinite={true}
                                arrows={true}
                                responsive={responsive}

                            >
                                {
                                    reviewList.map((review, index) => {


                                        return (
                                            <div className="testimonial">
                                                <div className="testimonial-profile">
                                                    <div className="img-s">

                                                        <ul>
                                                            {

                                                                Array(review?.rating ? parseInt(review?.rating) : 0).fill().map((_, i) => {

                                                                    return (
                                                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="testimonial-content">
                                                <p className="testimonial-description pointer" onClick={() => extendTestimonial === review._id ? setExtendTestimonial('') : setExtendTestimonial(review._id)}>{extendTestimonial === review._id ? review.review : review.review.slice(0,testimonialLength)+(review.review.length > testimonialLength ? "..." : '')}</p>
                    


                                                    {/* <p className="testimonial-description">
                                                        {review.review}
                                                    </p> */}
                                                </div>
                                            </div>
                                        )

                                    })
                                }

                            </Carousel>



                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>


            {/* {reviewsList.length == 0 ?
            <div className='text-center mt-5'>
                <h5>Reviews are not available</h5>
            </div>
            :
            
            <>
            
            <div className='row mt-5'>
                <div className='col-md-8 offset-md-2 row'>
                    <div className='col-md-4 d-flex text-center'>
                        <strong>Cleanliness Rating : </strong>
                        <ul className='center-rating '>

                            {

                                Array(centerDetails?.cleanliness_rating ? parseInt(centerDetails?.cleanliness_rating) : 0).fill().map((_, i) => {

                                    return (
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                    )
                                })
                            }


                        </ul>
                    </div>
                    <div className='col-md-4 d-flex'>
                        <strong>Service Rating : </strong>
                        <ul className='center-rating '>

                            {

                                Array(centerDetails?.service_rating ? parseInt(centerDetails?.service_rating) : 0).fill().map((_, i) => {

                                    return (
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                    )
                                })
                            }


                        </ul>
                    </div>
                    <div className='col-md-4 d-flex'>
                        <strong>Hygiene Rating : </strong>
                        <ul className='center-rating '>

                            {

                                Array(centerDetails?.hygiene_rating ? parseInt(centerDetails?.hygiene_rating) : 0).fill().map((_, i) => {

                                    return (
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                    )
                                })
                            }


                        </ul>
                    </div>
                   
                </div>
            </div>

            <div className='row mt-5'>
                {
                    reviewsList.map((x, index) => {

                        return (<div className='col-md-8 offset-md-2 mt-2'>

                            <div className='card'>
                                <div className='row'>
                                    <div className='col-md-2'>
                                        <img src={x.user_id.profile_photo_path ? env.imageurl+x.user_id.profile_photo_path : "assets/img/user-icon.png"} width={50} /><br />
                                        <strong>{x.user_id.name}</strong>

                                    </div>
                                    <div className='col-md-9'>
                                        <p>
                                            <ul className='center-rating '>

                                                {

                                                    Array(parseInt(x.rating)).fill().map((_, i) => {

                                                        return (
                                                            <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </p>
                                        <p className='review-desc'>
                                            {x.review}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })
                }


            </div>
            </> */}

            {showReviewModal ? <ReviewModal showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} centerId={centerId} getReviews={getReviews} /> : ''}
        </>
    )
}

export default Reviews
