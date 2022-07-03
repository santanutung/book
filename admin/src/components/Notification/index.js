import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../../Layout'
import Pagination from '../../ReuseableComponent/Pagination'
import ProcessLoader from '../../ReuseableComponent/ProcessLoader'
import ViewModal from './ViewModal'

function Notification() {
    const [notifications, setNotifications] = useState([])
    const [unreadMessage, setUnreadMessage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [filterNotification, setFilterNotification] = useState([])
    const limit = 10;
    const [view, setView] = useState({})
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        getNotifications()
    }, [])

    function getNotifications() {
        setLoading(true)
        axiosBaseUrl.get(`admin/notifications`)
            .then((res) => {
                // console.log(res.data.unreadNotification)
                setNotifications(res.data.data)
                // setUnreadMessage((res.data.unreadNotification).length)

                setNotifications(res.data.data)
                setTotalPages(Math.ceil(res.data.data.length / limit))
                setLoading(false)
                setFilterNotification(res.data.data.slice((currentPage - 1) * limit, currentPage * limit))




            }).catch(error => {
                console.log(error)

            })
    }


    function changePage(page) {

        setFilterNotification(notifications.slice((page - 1) * limit, page * limit))


    }

    function markNotificationRead() {

        setLoading(true)
        axiosBaseUrl.put(`admin/notification-read`)
            .then((res) => {
                getNotifications()

            }).catch(error => {
                console.log(error)

            })
    }


    return (
        <Layout >
            <div className="main-panel">
                <div className="content-wrapper">


                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Notifications</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row">


                        <div className="col-lg-12 grid-margin stretch-card mt-5">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Notifications</h4>

                                    <button className='btn btn-sm btn-primary' onClick={() => markNotificationRead()}>Mark All Read</button>

                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th>Date</th>
                                                    <th>Message</th>
                                                    <th>View</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {

                                                    loading ?

                                                        <tr>
                                                            <th className="text-center" colSpan="4">
                                                                <ProcessLoader />  Loading ...
                                                            </th>
                                                        </tr>

                                                        :
                                                        filterNotification.map((enq, index) => {
                                                            return (
                                                                <tr key={index + "enquiry"}>
                                                                    <td>{index + 1} {enq.isRead ? <i class="fas fa-check"></i> : <i class="fas fa-times text-danger"></i>} </td>
                                                                    <td>{enq.date}</td>
                                                                    <td>
                                                                        {enq.message.substr(0, 20)}{enq.message.length > 20 ? "..." : ''}
                                                                        {/* {enq.message} */}
                                                                    </td>
                                                                    <td>
                                                                        <button className='btn btn-sm btn-primary' onClick={() => setView(enq)}>View</button>
                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className='card-footer'>

                                    {
                                        totalPages > 1 ?
                                            <Pagination callbackFunction={changePage} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                            : ''
                                    }
                                </div>

                            </div>
                        </div>


                    </div>


                </div>
            </div>
            {
                view._id ? <ViewModal view={view} setView={setView} /> : ''
            }
        </Layout>
    )
}

export default Notification
