import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';
import Layout from '../Layout';
import Pagination from '../ReuseableComponent/Pagination';
import ProcessLoader from '../ReuseableComponent/ProcessLoader';
import AppointmentModal from './AppointmentModal';
import Filters from './Filters';

function TodayAppointments() {
    const [search, setSearch] = useState({ from_date: "", to_date: "", appointment_status: "", center_id: "" })
    const [appointmentData, setAppointmentData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const [loading, setLoading] = useState(true)
    const [viewAppointment, showViewAppointment] = useState('')
    const [viewData, setViewData] = useState({})
    const limit = 10;
    const [filterAppointment, setFilterAppointment] = useState([])

    useEffect(() => {
        getAppointment(1)

    }, [])


    function filterData(type = null) {
        getAppointment(1, type)
    }

    function getAppointment(page, type = null) {

        setLoading(true)
        var url = `admin/center/appointments?date=${moment().format('YYYY-MM-DD')}&center_id=${search.center_id}`
        if(search.appointment_status !== 'all') {
            url += `&appointment_status=${search.appointment_status}`
        }

        if (type == 'reset') {
            var url = `admin/center/appointments?limit=10&page=${page}&date=${moment().format('YYYY-MM-DD')}`
        }
        axiosBaseUrl.get(url)
            .then((res) => {
                // console.log(res.data)
                // setAppointmentData(res.data.data)
                // setTotalPages(res.data.page)

                setAppointmentData(res.data.data)
                setTotalPages(Math.ceil(res.data.data.length / limit))
                setLoading(false)
                setFilterAppointment(res.data.data.slice((page - 1) * limit, page*limit))



                setLoading(false)

            }).catch(error => {
                setLoading(false)

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




    function changePage(page) {
     
        setFilterAppointment(appointmentData.slice((page - 1) * limit, page*limit))


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
                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Today Appointment</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>

                    <Filters search={search} setSearch={setSearch} filterData={filterData} type="today"/>


                    <div className="row">


                        <div className="col-lg-12 grid-margin stretch-card mt-5">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Today Appointment</h4>

                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Appt. Id</th>
                                                    <th>Centre</th>
                                                    <th>Patient Name</th>
                                                    <th>Patient Phone</th>
                                                    {/* <th>Appointment Date</th> */}
                                                    <th>Appt. Time</th>
                                                    <th>Charges</th>
                                                    {/* <th>Payment Status</th> */}
                                                    <th>Appt. Status</th>
                                                    <th>View</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {


                                                    loading ?

                                                        <tr>
                                                            <th className="text-center" colSpan="9">
                                                                <ProcessLoader />  Loading ...
                                                            </th>
                                                        </tr>

                                                        :


                                                        filterAppointment.length == 0 ?
                                                            <tr>
                                                                <th className="text-center" colSpan="9">
                                                                    No Upcoming Appointments
                                                                </th>
                                                            </tr>

                                                            :

                                                            filterAppointment.map((x, index) => {
                                                               
                                                                return (
                                                                    <>
                                                                        <tr key={index}>
                                                                            <td>{x.appointment_key}</td>
                                                                            <td><Link to={"/centreProfile/" + x.center_id[0]._id}>{x.center_id[0].name}</Link></td>
                                                                            <td>{x.patient_familyMemberId.name}</td>
                                                                            <td>{x.patient_familyMemberId?.user_id?.phone}</td>
                                                                            <td>{x.appointment_start_time}</td>
                                                                            {/* <td>{x.appointment_start_time}</td> */}
                                                                            <td>₹ {x.charges}</td>
                                                              
                                                                            <td>
                                                                                {
                                                                                    x.appointment_status == "pending" ?

                                                                                        <label className="badge badge-info">Pending</label>
                                                                                        : x.appointment_status == "ongoing" ?
                                                                                            <label className="badge badge-warning">On Going</label>
                                                                                            : x.appointment_status == "cancelled" ?
                                                                                                <label className="badge badge-danger">Cancelled</label>
                                                                                                :
                                                                                                <label className="badge badge-success">Completed</label>


                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                {/* <button className='btn btn-secondary btn-sm' onClick={() => showViewAppointment(x._id)}>View</button> */}
                                                                                {
                                                                                    viewAppointment === x._id ? <a className='view-btn' onClick={() => showViewAppointment('')}><i class="fas fa-arrow-circle-up"></i></a> : <a className="view-btn" onClick={() => showViewAppointment(x._id)}><i class="fas fa-arrow-circle-down"></i></a>
                                                                                }
                                                                                {/* <button className='btn btn-secondary btn-sm' onClick={() => showViewAppointment(x._id)}>View</button> */}

                                                                                </td>

                                                                        </tr>

                                                                        <tr className='view-appointment-table' key={index} style={{ display: viewAppointment === x._id ? "" : 'none' }}>

                                                                        <td>Before(W) : <br/>{x.before_weight ? `(${x.before_weight})` : ''} </td>
                                                                     {/* <td>{x.before_weight}</td> */}
                                                                     <td>After(W) : <br/>{x.after_weight ? `(${x.after_weight})` : ''}</td>
                                                                            <td>Payment : </td>
                                                                            <td className='p-0'>
                                                                                
                                                                                {
                                                                                    x.payment_status == "pending" ?

                                                                                        <label className="badge badge-danger">Pending</label>
                                                                                        :
                                                                                        <label className="badge badge-success">Completed</label>
                                                                                }
                                                                                ({x.payment_type})
                                                                            </td>
                                                                            <td>Reports : </td>
                                                                            <td colSpan="3">
                                                                            <button className='btn btn-xs btn-primary' disabled={x.reports.length > 0 ? false : true} onClick={() => {setViewData(x);}}>View Reports</button>
                                                                     
                                                                                {/* {x.reports.length > 0 ? <button className='btn btn-xs btn-primary' onClick={() => {setViewData(x);}}>View Reports</button>:''}  */}
                                                                                
                                                                                </td>

                                                                        </tr>
                                                                    </>

                                                                )
                                                            })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer">

                                    {
                                        totalPages > 1 ?
                                            <Pagination callbackFunction={changePage} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                            : ''
                                    }

                                    {/* <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-end">
                                            <li className={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
                                                <a className="page-link" href="#" onClick={e => { getAppointment(currentPage - 1) }}>
                                                    Previous
                                                </a>
                                            </li>


                                            {

                                                pages.map(pageNumber => {

                                                    return pageNumber < totalPages ?
                                                        <li className="page-item">
                                                            <a className="page-link" onClick={e => { getAppointment(pageNumber) }}>
                                                                {pageNumber}
                                                            </a>
                                                        </li>
                                                        :
                                                        ""
                                                })

                                            }

                                            <li className={currentPage == totalPages ? 'page-item disabled' : 'page-item'} >
                                                <a className="page-link" onClick={e => { getAppointment(currentPage + 1) }}>
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </nav> */}

                                </div>
                            </div>
                        </div>


                    </div>


                </div>
            </div>
            {
                viewData._id ? <AppointmentModal viewData={viewData} setViewData={setViewData} /> : ''
            }
        </Layout>
    )
}

export default TodayAppointments;
