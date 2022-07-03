import moment from 'moment-timezone';
import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import ViewAppointment from '../../components/appointments/ViewAppointment';
import Pagination from '../Pagination';
import ProcessLoader from '../ProcessLoader';

function AppointmentTable(props) {

    const { tableHeading, appointmentData, updateStatusHandler, cancelAppointment, getAppointment, totalPages, setCurrentPage, currentPage, pages, loading, slots } = props
    // console.log(pages);
    const [viewData, setViewData] = useState({})
    return (


        <div className="row">
            <div className="col-md-12">
                <div className="card">
                   
                    <div className="card-body">
                        <p className="card-title">{tableHeading}</p>
                        {
                        slots ? 
                        <>
                            <div className='mt-3 mb-3 row'>
                                <div className='col-md-3'>
                                    <select className='form-control' onChange={(e) => {getAppointment(1, e.target.value)}}>
                                        <option value="">Select Slot Time</option>
                                        {
                                            slots.map((slot, index) => {
                                                return (
                                                    <option value={slot._id}>{slot.start_time} - {slot.end_time}</option>
                                                )
                                            })
                                        }
                                    </select>

                                </div>
                            </div>
                        </> 
                        : ''
                    }
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table
                                        id="example"
                                        className="display expandable-table"
                                        style={{ width: "100%" }}
                                    >
                                        <thead>
                                            <tr>

                                                <th>Appt. Id</th>
                                                <th>Patient Name</th>
                                                <th>Patient Phone</th>
                                                {/* <th>Appointment Date</th> */}
                                                <th>Time</th>
                                                <th>Charges</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Before(W)</th>
                                                <th>After(W)</th>
                                                <th>Update</th>
                                                <th>Cancel</th>
                                                <th>Reports</th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {

                                                loading ?
                                                    <tr>
                                                        <td colSpan={10} className='text-center'>
                                                            <ProcessLoader />
                                                        </td>
                                                    </tr>
                                                    :
                                                    appointmentData.length === 0 ?
                                                    <tr>
                                                        <th colSpan="13" height="50" className="text-center">
                                                            Today' no appointment
                                                        </th>
                                                    </tr>
                                                    :
                                                    appointmentData.map((x, index) => {
                                                        console.log(x)
                                                        return (
                                                            <tr key={index}>
                                                                <td>{x.appointment_key}</td>
                                                                <td className='capitalize'><Link to={`/patientProfile/${x.patient_familyMemberId?._id}`}>{x.patient_familyMemberId?.name}</Link></td>
                                                                <td>{x.patient_familyMemberId?.user_id?.phone}</td>
                                                                {/* <td>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')}</td> */}
                                                                <td>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')} <br/>({x.appointment_start_time})</td>
                                                                <td>₹ {x.charges}</td>
                                                                <td>{x.payment_status}<br/>({x.payment_type})</td>
                                                                <td>

                                                                    {
                                                                        x.appointment_status === "pending" ?

                                                                            <label className="badge badge-info">Pending</label>
                                                                            : x.appointment_status === "ongoing" ?
                                                                                <label className="badge badge-warning">On Going</label>
                                                                                : x.appointment_status === "cancelled" ?
                                                                                    <label className="badge badge-danger">Cancelled</label>
                                                                                    :
                                                                                    <label className="badge badge-success">Completed</label>

                                                                    }
                                                                </td>
                                                                <td>{x.before_weight}</td>
                                                                <td>{x.after_weight}</td>
                                                                <td>
                                                                    <button className="btn custom-btn btn-sm" disabled={(x.appointment_status === "pending" || x.payment_status === "pending" || parseInt(moment().format('DDMMYYYY'))  > x.apt_date) ? false : true}
                                                                        onClick={() => updateStatusHandler(x._id, x.appointment_status, x.after_weight)}
                                                                    >
                                                                        Update 
                                                                    </button>
                                                                </td>

                                                                <td>
                                                                    <button className="btn btn-danger btn-sm" disabled={x.appointment_status != "pending" || x.apt_date < parseInt(moment().format('DDMMYYYY'))  ? true : false}
                                                                        onClick={() => cancelAppointment(x._id, x.appointment_key)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </td>
                                                                <td> <button className='btn btn-sm btn-primary' disabled={x.reports.length > 0 ? false : true} onClick={() => {setViewData(x);}}>Reports</button> </td>

                                                                


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
                    <div className="card-footer">

                    {
                            totalPages > 1  ?
                        <Pagination callbackFunction={getAppointment}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                    }


                       
                    </div>


                </div>
            </div>

            {
                viewData._id ? <ViewAppointment viewData={viewData} setViewData={setViewData} /> : ''
            }
        </div>

    )
}

export default AppointmentTable
