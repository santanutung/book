import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppointmentModal from '../appointments/AppointmentModal';
import axiosBaseUrl from '../axiosBaseUrl';
import { appointments } from '../rawData/AppointmentRawData';
import Pagination from '../ReuseableComponent/Pagination';


function Appointments(props) {
    const { appointments, id, setAppointments } = props;
    const [filterList, setFilterList] = useState([])
    const limit = 2;

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAppointment, showViewAppointment] = useState('')
    const [viewData, setViewData] = useState({})
    useEffect(() => {
        getAppointments()
        
    }, []);
    

    function getAppointments() {
        
        // setLoadingState(true)
        axiosBaseUrl.get(`admin/patient-appointments/${id}`)
            .then((res) => {
                setAppointments(res.data.appointments)
                setTotalPages(Math.ceil(res.data.appointments.length / limit))
                // setLoadingState(false)
                setFilterList(res.data.appointments.slice((currentPage - 1) * limit, currentPage * limit))

            }).catch(error => {
                console.log(error)
                if (error.response) {
                    // alert(error.response.data)

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

    function filterDate(page) {
        setFilterList(appointments.slice((page - 1) * limit, page * limit))
    }

    return (
        <div
            className="tab-pane fade active show"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
        >

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Appt.Id</th>
                            <th>Centre</th>
                            <th>Patient</th>
                            <th>Appt. Time</th>
                            <th>Charges</th>
                            <th>Appt. Status</th>
                            <th>View</th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            filterList.map((x, index) => {

                                return (
                                    <>
                                    <tr key={index}>
                                        <td>{x.appointment_key}</td>
                                        <td><Link to={"/centreProfile/" + x.center_id._id}>{x.center_id.name}</Link></td>
                                        <td>{x.patient_familyMemberId.name}</td>
                                        <td>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')} <br/>({x.appointment_start_time})</td>
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

                                    <td >
                                        
                                    
                                        Before (W) : <br/>{x.before_weight ? `(${x.before_weight})` : ''} 
                                        </td>
                                 {/* <td>{x.before_weight}</td> */}
                                 <td>After (W) : <br/>  {x.after_weight ? `(${x.after_weight})` : ''}</td>
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
                                        {/* <td>Reports : </td> */}
                                        <td colSpan="3">
                                        <button className='btn btn-xs btn-primary' disabled={x.reports.length > 0 ? false : true} onClick={() => {setViewData(x);}}>Reports</button>
                                 
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
                    <div>
                        {
                    totalPages > 1 ?
                        <Pagination callbackFunction={filterDate} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        : ''
                }
                    </div>
                    {
                viewData._id ? <AppointmentModal viewData={viewData} setViewData={setViewData} /> : ''
            }

        </div>
    )
}

export default Appointments
