import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import { socket } from '../../context/sokcet';

function TestimonialModal(props) {
    const { showTestimonialModal, setShowTestimonialModal, checkCenterFeeback } = props
    const { setLoaderState } = useGlobalContexts()
    const [reviewData, setReviewData] = useState({ review: '' })
    const [reviewErrors, setReviewErrors] = useState({});
    // const [loader, setLoader] = useState(false);

    function handleReview(e) {
        const newData = { ...reviewData }
        newData[e.target.name] = e.target.value
        setReviewData(newData)
   
    }

    function reviewFormHandler() {
        setLoaderState(true)
        axiosBaseUrl.post(`patients/api/testimonial`, reviewData)
            .then((res) => {
             
                if (res.status == 200) {
                    Swal.fire('', 'Thank you to give you precious feedback!', 'success')
                    setShowTestimonialModal(false)
                    setLoaderState(false)
                    checkCenterFeeback()
                    socket.emit("notification", 'admin', res.data.notification);
                }


            }).catch(error => {
              
                // alert("none done")
                if (error.response) {
                    if (error.response.status == 422) {

                        const errorData = { ...reviewErrors }
                        error.response.data.errors.map((value, index) => {
                          

                            errorData[value.param] = value.msg

                        })
                        setReviewErrors(errorData)
                    }
                }
                else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                setLoaderState(false)

            })

    }


    return (
        <>
            <Modal show={showTestimonialModal} onHide={() => setShowTestimonialModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group log-f">
                                <textarea
                                    className="form-control"
                                    name="review"
                                    placeholder="Feedback*"
                                    required=""
                                    onChange={(e) => handleReview(e)}
                                >
                                    {reviewData.review}
                                </textarea>

                                <span className='text-danger'>{reviewErrors.review}</span>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={reviewFormHandler} type="button" className="btn btn-primary">
                        Submit
                    </button>
                </Modal.Footer>

            </Modal>


        </>
    )
}

export default TestimonialModal
