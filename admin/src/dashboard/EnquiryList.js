import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'

function EnquiryList() {
    const [enquiries, setEnquiry] = useState([])

    useEffect(() => {
        getEnquiries()

    }, [])


    function getEnquiries() {


        axiosBaseUrl.get(`admin/enquiry-list?limit=1000&page=1&date=${moment().format('YYYY-MM-DD')}`)
            .then((res) => {
                // console.log(res)
                setEnquiry(res.data.data.docs)

            }).catch(error => {
                console.log(error.response)
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
        <div className="card">
            
            <div className="card-body">
                

            <div className='row'>
                    <div className='col-md-6'>
                    <h4 className="card-title">Today Enquiry </h4>
                    </div>
                    <div className='col-md-6 text-right'>
                        <Link to="/enquiry">View All</Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>


                            </tr>
                        </thead>
                        <tbody>

                            {


                                enquiries.slice(0, 9).map((enq, index) => {
                                    return (
                                        <tr key={index + "enquiry"}>
                                            <td>{enq.enquiry_no}</td>
                                            <td>{enq.name}</td>
                                            <td className='word-break '>{enq.subject.substr(0, 20)}{enq.subject.length > 20 ? "..." : ''}</td>
                                            <td className='word-break '>{enq.message.substr(0, 20)}{enq.message.length > 20 ? "..." : ''}</td>
                                            <td><span className={enq.status.toLowerCase() == 'open' ? "text-success" : "text-danger"}>{enq.status}</span></td>



                                        </tr>

                                    )
                                })}

                        </tbody>
                    </table>


                </div>

            </div>
        </div>
    )
}

export default EnquiryList
