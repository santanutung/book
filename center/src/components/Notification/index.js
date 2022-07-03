import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../../axiosBaseUrl'
import Pagination from '../../custom/Pagination'
import ProcessLoader from '../../custom/ProcessLoader'
import Layout from '../../Layout'

function Notification() {

    const [notifications, setNotifications] = useState([])
    // const [currentNotification, setCurrentNotification] = useState(0)
    const [loading, setLoading] = useState(false)
    const limit = 10;

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        getNotifications()
    }, [])

    function getNotifications() {
        setLoading(true)
        axiosBaseUrl.get(`private/center/notifications`)
            .then((res) => {
                // console.log(res.data.unreadNotification)
                setNotifications(res.data.data)
                setLoading(false)
                setTotalPages(Math.ceil(res.data.data.length / limit))
                // setCurrentNotification((res.data.unreadNotification).length)


            }).catch(error => {
                console.log(error)

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
                                                aria-current="page">Notifications</li>
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
                                    <p className="card-title">Notifications</p>
                                    <div className="row">
                                        {/* <div className='text-right'>
                                        <button className='btn btn-sm btn-secondary mr-2'>Mark Read</button>
                                        <button className='btn btn-sm btn-danger'>Delete</button>
                                        </div> */}
                                        <div className="col-12">
                                            <div className="table-responsive">
                                                <table
                                                    id="example"
                                                    className="display expandable-table"
                                                    style={{ width: "100%" }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            {/* <th>#</th> */}

                                                            <th>S.no.</th>
                                                            <th>Date</th>
                                                            {/* <th>Is Read</th> */}
                                                            <th>Message</th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {
                                                            loading ?
                                                                <tr>
                                                                    <td colSpan={4} className='text-center'>
                                                                        <ProcessLoader />
                                                                    </td>
                                                                </tr>
                                                                :
                                                                notifications.slice((currentPage - 1) * limit, currentPage * limit).map((x, index) => {

                                                                    return (
                                                                        <tr key={index + 1}>
                                                                            {/* <td><input type="checkbox" value={x._id} /></td> */}
                                                                            <td>{index + 1}</td>
                                                                            <td>{x.date}</td>
                                                                            {/* <td>{x.isRead ? "Read" : ""}</td> */}
                                                                            <td><Link to={x.module === 'enquiry' ? '/enquiry' : x.module === 'appointment' ? '/upcomingAppointments' : ''}>{x.message}</Link></td>



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
                            <Pagination callbackFunction={getNotifications} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                            : ''
                    }
                                </div>

                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </Layout>
    )
}

export default Notification
