import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosBaseUrl from '../../axiosBaseUrl';
import { LOGIN, selectUserId, selectUserToken } from '../../Redux/userSlice';
import Test from './Test';
import Carousel from 'react-multi-carousel';
import TestimonialModal from './TestimonialModal';

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
function Testimonials() {
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const userToken = useSelector(selectUserToken)
  const dispatch = useDispatch()
  const [testimonials, setTestimonials] = useState([])
  const [reviewsExist, setReviewsExist] = useState(false)
  const userId = useSelector(selectUserId)

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
    const activeUser = localStorage.getItem('activeUser');
 

    if (activeUser) {
      dispatch(LOGIN({ userToken: activeUser }))
    }
    getTestimonials()
    if (activeUser) {

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

    <div className="demo client-sec">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className='row'>
              <div className='col-md-6'>
                <h3 className="client-h">What Clients say 
                  {reviewsExist}
                </h3>
              </div>
              <div className='col-md-6 text-right mt-3'>

                {localStorage.getItem('activeUser') != null && !reviewsExist ? <div className='form-group1'><a className='testimonial-button mt-5' onClick={() => setShowTestimonialModal(true)}>Add Feedback</a></div> : ''}
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
                testimonials.map((testimonial, index) => {
                  return (
                    <div className="testimonial testimonial-client"  key={testimonial._id+"testimonial"}>
                    <div className="testimonial-profile">
                      <div className="clients-head">
                        <p>{testimonial.userId.name?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="testimonial-content">
                    <p className="testimonial-description pointer" onClick={() => extendTestimonial === testimonial._id ? setExtendTestimonial('') : setExtendTestimonial(testimonial._id)}>{extendTestimonial === testimonial._id ? testimonial.review : testimonial.review.slice(0,testimonialLength)+(testimonial.review.length > testimonialLength ? "..." : '')}</p>
                    {/* {size[0] <= 951 ? 
                                        <p className="testimonial-description pointer" onClick={() => extendTestimonial === testimonial._id ? setExtendTestimonial('') : setExtendTestimonial(testimonial._id)}>{extendTestimonial === testimonial._id ? testimonial.review : testimonial.review.slice(0,testimonialLength)+(testimonial.review.length > testimonialLength ? "..." : '')}</p>
                     :  
                    <p className="testimonial-description">{testimonial.review}</p>
                    } */}


                      {/* <p className="testimonial-description">{size[0] <= 951 ? testimonial.review.slice(0,300)+() :  testimonial.review}</p> */}
                    </div>
                  </div>
                  )

                })
              }

              {/* {
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
                                        <p className="testimonial-description">
                                          test
                                        </p>
                                    </div>
                                </div>
                            )

                        })
                    } */}

            </Carousel>



            {/* </div> */}
          </div>
        </div>
      </div>
      <TestimonialModal showTestimonialModal={showTestimonialModal} setShowTestimonialModal={setShowTestimonialModal} checkCenterFeeback={checkCenterFeeback} />

    </div>


  )
}

export default Testimonials;
