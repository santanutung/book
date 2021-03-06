import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Layout from '../Layout'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl';
import Filters from './Filters';
import ProcessLoader from '../ReuseableComponent/ProcessLoader';
import Pagination from '../ReuseableComponent/Pagination';
import moment from 'moment';
import AppointmentModal from './AppointmentModal';
function UpcomingAppointments() {
    const [search, setSearch] = useState({ from_date: "", to_date: "", appointment_status: "ne-cancelled", center_id: "" })
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [appointments, setAppointments] = useState([])
    const [viewAppointment, showViewAppointment] = useState('')
    const [viewData, setViewData] = useState({})

    const [loading, setLoading] = useState(true)
    var limit =10

    const [filterAppointment, setFilterAppointment] = useState([])

    useEffect(() => {
        getAppointment(1)

    }, [])




    function filterData(type = null) {
        getAppointment(1, type)
    }


    function getAppointment(page, type) {
        setLoading(true)
        var url = `admin/center/appointments?type=upcoming&limit=10&page=${page}&from_date=${search.from_date}&to_date=${search.to_date}&center_id=${search.center_id}`
        if(search.appointment_status !== 'all') {
            url += `&appointment_status=${search.appointment_status}`
        }
        else if(search.appointment_status === 'all')  {
            url += `&appointment_status=ne-cancelled`
        }

        if (type == 'reset') {
            var url = `admin/center/appointments?type=upcoming&limit=10&page=${page}&appointment_status=ne-cancelled`
        }

        axiosBaseUrl.get(url)
            .then((res) => {
              
                setAppointments(res.data.data)
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
     
        setFilterAppointment(appointments.slice((page - 1) * limit, page*limit))


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
                                            <li className="breadcrumb-item active" aria-current="page">Upcoming Appointments</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>


                    <Filters search={search} setSearch={setSearch} filterData={filterData} type="upcoming"/>

                    <div className="row">


                        <div className="col-lg-12 grid-margin stretch-card mt-5">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Upcoming Appointments</h4>

                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                <th>Appt. Id</th>
                                                    <th>Centre</th>
                                                    <th>Patient Name</th>
                                                    <th>Patient Phone</th>
                                                    <th>Appt. Time</th>
                                                    {/* <th>Appointment Time</th> */}
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
                                                                <ProcessLoader /> Loading ...
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
                                                                            <td>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')} <br/>({x.appointment_start_time})</td>
                                                                            {/* <td>{x.appointment_start_time}</td> */}
                                                                            <td>??? {x.charges}</td>
                                                              
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
                                                                            {
                                                                                    viewAppointment === x._id ? <a className='view-btn' onClick={() => showViewAppointment('')}><i class="fas fa-arrow-circle-up"></i></a> : <a className="view-btn" onClick={() => showViewAppointment(x._id)}><i class="fas fa-arrow-circle-down"></i></a>
                                                                                }
                                                                                {/* <button className='btn btn-secondary btn-sm' onClick={() => showViewAppointment(x._id)}>View</button> */}
                                                                                </td>

                                                                        </tr>

                                                                     <tr className='view-appointment-table' key={index} style={{ display: viewAppointment === x._id ? "" : 'none' }}>

                                                                     <td>Before(W) : {x.before_weight ? `(${x.before_weight})` : ''} </td>
                                                                     {/* <td>{x.before_weight}</td> */}
                                                                     <td>After(W) : {x.after_weight ? `(${x.after_weight})` : ''}</td>
                                                                     {/* <td >{x.after_weight}</td> */}
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
                                                                         {/* {x.reports.length > 0 ? <button className='btn btn-xs btn-primary' onClick={() => {setViewData(x);}}>View Reports</button>: <button className='btn btn-xs btn-primary' disabled>View Reports</button>}  */}
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
                viewData._id ? <AppointmentModal viewData={viewData} setViewData={setViewData} /> : ''
            }
        </Layout>
    )
}

export default UpcomingAppointments
