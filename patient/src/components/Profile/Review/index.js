import React, { useEffect, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
import ViewModal from './ViewModal';

function Review() {
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [editData, setEditData] = useState([]);
    const [ViewData, setViewData] = useState('');
    const [loading, setLoading] = useState(false)
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        //   function updateSize() {

        //   alert(totalDate)
        //     setSize([window.innerWidth, window.innerHeight]);
        //     getSize()
        //     // console.log(window.innerWidth+""+ window.innerHeight)
        //   }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
        console.log(window.innerWidth + "" + window.innerHeight)
    }



    useEffect(() => {
        updateSize()
        getReviews()
    }, [])

    function getReviews() {
        setLoading(true)
        axiosBaseUrl.get(`patients/api/review`)
            .then((res) => {
                console.log(res.data.data)
                setReviews(res.data.data)
                setLoading(false)
            }).catch(error => {
                console.log(error)

            })
    }

    function deleteReport(id) {

        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`patients/api/review/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Review is successfully deleted', 'success')
                        getReviews()


                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    return (
        <>
            <div
                className="tab-pane fade show active"
                id="pills-reviews"
                role="tabpanel"
                aria-labelledby="pills-reviews-tab"
            >
                {
                    loading ?
                        <div className='text-center'>
                            <ProcessLoader />
                        </div>
                        :
                        reviews.length == 0 ?

                            <div className='text-center mt-5'>
                                <h5 className='text-center text-theme-color'>Reviews are not available</h5>
                            </div>


                            :

                            reviews.map((review, index) => {
                                return (
                                    <>
                                        <div className="card shadow sp_csg profile-review-list">
                                            <div>
                                                <div className="">
                                                    <div className="row">
                                                        {/* <div className={`col-md-3 patient center-profile-image ${!review.center_id?.primaryImage ? "center-profile-bg" : ''}`} style={{ backgroundImage: "url(" + env.imageurl + review.center_id?.primaryImage + ")" }}> */}
                                                        <div className="col-md-4">
                                                            <img
                                                    src={env.imageurl + review.center_id?.primaryImage}
                                                    className="img-fluid review-center-image"
                                                    alt="..."
                                                />
                                                        </div>
                                                        <div className="col-md-6">

                                                            <div className="card-body">
                                                                <h5 className="card-title colss-co capitalize"><strong>{review.center_id?.name}</strong></h5>
                                                                <span className="colss-co">{review.center_id?.area + ", " + review.center_id?.city}</span>
                                                                <p className='text-left'>
                                                                    {
                                                                        review.rating ?

                                                                            Array(5).fill().map((_, i) => {

                                                                                return (
                                                                                    <i className={i < parseInt(review.rating) ? "fa fa-star colss-co" : "fa fa-star-o colss-co"} aria-hidden="true"></i>
                                                                                )
                                                                            })
                                                                            : ''
                                                                    }
                                                                </p>
                                                                <h5 className="revvs mt-3">Review</h5>
                                                                <p className="card-text colss-co text-left  pointer" onClick={() => ViewData === review._id ? setViewData('') : setViewData(review._id)}>

                                                                    {
                                                                        ViewData === review._id ?
                                                                            <>
                                                                                {review.review}
                                                                            </>

                                                                            :
                                                                            <>
                                                                                {review.review.slice(0, 120)}
                                                                                {
                                                                                    review.review.length > 120 ? '...' : ''
                                                                                }

                                                                            </>
                                                                    }



                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2 p-3">
                                                            <div className='row'>
                                                                <div className={size[0] <= 767 ? 'col-4 col-md-12 text-center' : 'col-4 col-md-12'}>
                                                                    <span className="colss-co">Services</span> <br />
                                                                    {
                                                                        review.service_rating ?

                                                                            Array(5).fill().map((_, i) => {

                                                                                return (
                                                                                    <i className={i < parseInt(review.service_rating.split('.')[0]) ? "fa fa-star colss-co" : "fa fa-star-o colss-co"} aria-hidden="true"></i>
                                                                                )
                                                                            })
                                                                            : ''
                                                                    }

                                                                </div>
                                                                <div className={size[0] <= 767 ? 'col-4 col-md-12 text-center' : 'col-4 col-md-12 mt-2'}>
                                                                    <span className="colss-co">Cleanliness</span> <br />
                                                                    {
                                                                        review.cleanliness_rating ?

                                                                            Array(5).fill().map((_, i) => {

                                                                                return (
                                                                                    <i className={i < parseInt(review.cleanliness_rating.split('.')[0]) ? "fa fa-star colss-co" : "fa fa-star-o colss-co"} aria-hidden="true"></i>
                                                                                )
                                                                            })
                                                                            : ''
                                                                    }
                                                                </div>
                                                                <div className={size[0] <= 767 ? 'col-4 col-md-12 text-center' : 'col-4 col-md-12 mt-2'}>
                                                                    <span className="colss-co">Hygiene</span> <br />
                                                                    {
                                                                        review.hygiene_rating ?

                                                                            Array(5).fill().map((_, i) => {

                                                                                return (
                                                                                    <i className={i < parseInt(review.hygiene_rating.split('.')[0]) ? "fa fa-star colss-co" : "fa fa-star-o colss-co"} aria-hidden="true"></i>
                                                                                )
                                                                            })
                                                                            : ''
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br />
                                    </>
                                )
                            })
                }

            </div>
            <ViewModal review={editData} showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} />
        </>
    );
}

export default Review;
