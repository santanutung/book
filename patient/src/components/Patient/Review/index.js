import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import EditModal from './EditModal';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [editData, setEditData] = useState([]);

    useEffect(() => {
        getReviews()
    }, [])

    function getReviews() {

        axiosBaseUrl.get(`patients/api/review`)
            .then((res) => {
                console.log(res.data.data)
                setReviews(res.data.data)

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
        <div className="row">

              
                <div className="col-lg-12 grid-margin stretch-card mt-5">
                    <div className="card">
                  
                        <div className="card-body">
                            <div className='text-center'>

                            </div>
                            <div className='table-responsive'>
                                <table className="table table-hover table-striped" >
                                    <thead>
                                        <tr>
                                            {/* <th>S No.</th> */}
                                            <th>Center Name</th>
                                            <th>Review</th>
                                            <th>Cleanliness</th>
                                            <th>Hygiene</th>
                                            <th>Service</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            reviews.map((x, index) => {
                                                if (x.relation != 'self') {

                                                    return (


                                                        <tr>
                                                            {/* <td>{++index}</td> */}
                                                            <td><Link to={`/centre/${x.center_id._id}`}>{x.center_id?.name}</Link></td>
                                                            <td>{x.review}</td>
                                                            <td>{x.cleanliness_rating}</td>
                                                            <td>{x.hygiene_rating}</td>
                                                            <td>{x.service_rating}</td>
                                                            <td>
                                                                <a onClick={() => {setShowReviewModal(true); setEditData(x) }}><i className='fa fa-edit' /></a>
                                                                <a className='ml-1' onClick={() => deleteReport(x._id)}><i className='fa fa-trash' /></a>
                                                            </td>

                                                        </tr>
                                                    )
                                                }
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditModal showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} editData={editData} getReviews={getReviews}/>

            </>
    )
}

export default Reviews
