import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import Pagination from '../../custom/Pagination'
import ProcessLoader from '../../custom/ProcessLoader'
import Layout from '../../Layout'
import Footer from '../partials/Footer'

function Review() {

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const limit = 10;

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getReview()
    }, [])
    function getReview() {
        setLoading(true)
        axiosBaseUrl.get(`private/center/reviews`)
            .then((res) => {
                console.log(res.data)
                setReviews(res.data.data)
                setLoading(false)
                // alert(res.data.data.length)
                setTotalPages(Math.ceil(res.data.data.length / limit))

            }).catch(error => {
                console.log(error)
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
                                                aria-current="page">Reviews</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>






                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Review Rating</p>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="table-responsive">

                                                <table className="table table-hover" >
                                                    <thead>
                                                        <tr>
                                                            <th>S No.</th>
                                                            <th>Review</th>
                                                            <th>Cleanliness</th>
                                                            <th>Hygiene</th>
                                                            <th>Service</th>
                                                            {/* <th>Action</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            loading ?
                                                                <tr>
                                                                    <td colSpan={5} className='text-center'>
                                                                        <ProcessLoader />
                                                                    </td>
                                                                </tr>
                                                                :
                                                                reviews.slice((currentPage - 1) * limit, currentPage * limit).map((x, index) => {

                                                                    return (


                                                                        <tr key={x._id+"review"}>
                                                                            <td>{++index}</td>
                                                                            <td className='word-break'>{x.review}</td>
                                                                            <td>{x.cleanliness_rating}</td>
                                                                            <td>{x.hygiene_rating}</td>
                                                                            <td>{x.service_rating}</td>


                                                                        </tr>
                                                                    )
                                                                })
                                                        }

                                                    </tbody>
                                                </table>

                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    
                                    {
                                        totalPages > 1 ?
                                            <Pagination callbackFunction={getReview} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                            : ''
                                    }
                                                </div>

                            </div>
                        </div>
                    </div>

                </div>





                {/* content-wrapper ends */}
                {/* partial:partials/_footer.html */}
                <Footer />
                {/* partial */}
            </div>
            {/* main-panel ends */}


        </Layout>

    )
}

export default Review
