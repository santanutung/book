import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';

function ReviewModal(props) {
    const { showReviewModal, setShowReviewModal, centerId, getReviews } = props
    const [reviewData, setReviewData] = useState({ review: '', cleanliness_rating: '', service_rating: '', hygiene_rating: '', center_id: centerId })
    const [reviewErrors, setReviewErrors] = useState({});

    function handleReview(e) {
        const newData = { ...reviewData }
        newData[e.target.name] = e.target.value
        setReviewData(newData)
        console.log(reviewData)
        // console.log(e.target.value)
    }

    function handleRating(type, value) {
        const newData = { ...reviewData }
        newData[type] = value
        setReviewData(newData)
        console.log(reviewData)
        // console.log(e.target.value)
    }


    function reviewFormHandler() {
        axiosBaseUrl.post(`patients/api/review`, reviewData)
            .then((res) => {
                // alert("estt")
                console.log(res)
                if (res.status == 200) {
                    Swal.fire('', 'Thank you to give you precious feedback!', 'success')
                    setShowReviewModal(false)
                    getReviews()
                }


            }).catch(error => {
                console.log(error.response.data.errors)
                // alert("none done")
                if (error.response) {
                    if (error.response.status == 422) {

                        const errorData = { ...reviewErrors }
                        error.response.data.errors.map((value, index) => {
                            console.log(error.response.data.errors)

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

            })

    }
    return (
        <>

            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Help us to serve you better!
                        </h5>

                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group log-f">
                                <textarea
                                    className="form-control"
                                    name="review"
                                    placeholder="Review*"
                                    required=""
                                    onChange={(e) => handleReview(e)}
                                >
                                    {reviewData.review}
                                </textarea>
                                {/* <textarea
                                                className="form-control"
                                                name="review"
                                                placeholder="Review*"
                                                required=""
                                                onChange={(e) => handleReview(e)}>{reviewData.review} </textarea> */}
                                <span className='text-danger'>{reviewErrors.review}</span>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <lable>Cleanliness Rating</lable>
                            <div className="form-group center-rating">

                                <ul>
                                    {
                                        Array(5).fill().map((_, i) => {

                                            return (
                                                reviewData.cleanliness_rating >= i + 1 ?
                                                    <li><i className="fa fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("cleanliness_rating", i + 1)}></i></li>
                                                    :
                                                    <li><i className="far fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("cleanliness_rating", i + 1)}></i></li>
                                            )
                                        })
                                    }
                                </ul>
                                <br/>
                            </div>
                                <span className='text-danger'>{reviewErrors.cleanliness_rating}</span>
                        </div>

                        <div className="col-md-12">
                            <lable>Service Rating</lable>
                            <div className="form-group center-rating">

                                <ul>
                                    {
                                        Array(5).fill().map((_, i) => {

                                            return (
                                                reviewData.service_rating >= i + 1 ?
                                                    <li><i className="fa fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("service_rating", i + 1)}></i></li>
                                                    : <li><i className="far fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("service_rating", i + 1)}></i></li>
                                            )
                                        })
                                    }
                                </ul>
                                <br/>
                            </div>
                                <span className='text-danger'>{reviewErrors.service_rating}</span>
                        </div>
                        <div className="col-md-12">
                            <lable>Hygiene Rating</lable>
                            <div className="form-group center-rating">

                                <ul>
                                    {
                                        Array(5).fill().map((_, i) => {

                                            return (
                                                reviewData.hygiene_rating >= i + 1 ?
                                                    <li><i className="fa fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("hygiene_rating", i + 1)}></i></li>
                                                    :
                                                    <li><i className="far fa-star" name="cleanliness_rating" value={i} onClick={(e) => handleRating("hygiene_rating", i + 1)}></i></li>
                                            )
                                        })
                                    }
                                </ul>
                                <br/>
                            </div>
                                <span className='text-danger'>{reviewErrors.hygiene_rating}</span>
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

export default ReviewModal
