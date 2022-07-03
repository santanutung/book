import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosBaseUrl from '../../axiosBaseUrl';
import { LOGIN, selectUserId, selectUserToken } from '../../Redux/userSlice';
import Test from './Test';

function Testimonials() {
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
    <section className="client pt-3 pb-5">
    <div className="container">
      <div className="row text-center">
        <div className="col-2">
          <i className="fa fa-quote-left quoyes" aria-hidden="true" />
        </div>
        <div className="col-4">
          <h1 className="text-white relstry">
            {" "}
            <br /> Real Strory from <br /> Real Customers{" "}
          </h1>
        </div>
      </div>
      <div className="row align-items-md-center text-white">
        <div className="col-lg-1" />
        <div className="col-lg-10 col-md-10 col-sm-10">
          <div
            id="carouselExampleCaptions"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            {/* Wrapper for slides */}
            <div className="carousel-inner">
              {
                testimonials ?
                Array(parseInt(testimonials.length)).fill().map((_, i) => {
                  return (
                    <>
                    <Test />
                    </>
                  //   <div className="carousel-item active">
                  //   <div className="row p-4">
                  //     <div className="t-card">
                  //       <div className="row">
                  //         <div className="col-md-1" />
                  //         <div className="col-lg-5 mt-5">
                  //           <div className="icon-box lor-ccss">
                  //             <p>
                  //               Lorem ipsum dolor sit amet, consectetuer adipiscing
                  //               elit, sed diam nonummy nibh euismod tincidunt ut
                  //               laoreet dolore magna aliquam erat volutpat. Ut wisi
                  //               enim ad minim veniam, quis nostrud exerci tation
                  //               ullamcorper suscipit lobortis nisl ut aliquip ex ea
                  //               commodo consequat. Duis autem vel eum iriure dolor in{" "}
                  //             </p>
                  //             <h5>-an Expert</h5>
                  //           </div>
                  //         </div>
                  //         <div className="col-lg-6">
                  //           <div className="icon-box lor-ccss ters-csss one-this">
                  //             <p>
                  //               Lorem ipsum dolor sit amet, consectetuer adipiscing
                  //               elit, sed diam nonummy nibh euismod tincidunt ut
                  //               laoreet dolore magna aliquam erat volutpat. Ut wisi
                  //               sed diam nonummy nibh euismod tincidunt ut laoreet
                  //               dolore magna aliquam erat volutpat. Ut wisi{" "}
                  //             </p>
                  //             <h5>-an Expert</h5>
                  //           </div>
                  //           <br />
                  //           <div className="icon-box lor-ccss ters-csss">
                  //             <p>
                  //               Lorem ipsum dolor sit amet, consectetuer adipiscing
                  //               elit, sed diam nonummy nibh euismod tincidunt ut
                  //               laoreet dolore magna aliquam erat volutpat. Ut wisised
                  //               diam nonummy nibh euismod tincidunt ut laoreet dolore
                  //               magna aliquam erat volutpat. Ut wisi sed diam nonummy
                  //               nibh euismod tincidunt ut laoreet dolore magna aliquam
                  //               erat volutpat. Ut wisi{" "}
                  //             </p>
                  //             <h5>-an Expert</h5>
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                  )
                })
                :''
              }
             
            
            </div>
          </div>
          <div className="controls push-right custom-test-right">
            {/*  <a className="left fa fa-chevron-left btn btn-outline-light" href="#carouselExampleCaptions"
                       data-bs-slide="prev"></a> */}
            <a
              className="right fa fa-chevron-right text-white"
              href="#carouselExampleCaptions"
              data-bs-slide="next"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  
  )
}

export default Testimonials;
