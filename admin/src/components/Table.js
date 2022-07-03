import React, { useState } from 'react'
import Layout from '../Layout'
import { appointments } from '../rawData/AppointmentRawData';
import { appointment_status, payment_status } from '../rawData/AppointmentStatus';

function Table() {

    const appointmentData = appointments;

    const pay_status = payment_status;
    const app_status = appointment_status

    const [paymentSelected, setPaymentSelected] = useState('')
    const [appointmentSelected, setAppointmentSelected] = useState('')
    const [search, setSearch] = useState('')



    return (
        <Layout>
            <>
                <div className="main-panel">
                    <div className="content-wrapper">





                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Filters</p>
                                    <div className="row">

                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">
                                                <input type="date" className="form-control" />
                                            </div>
                                        </div>


                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">

                                                <select className="form-control" value={paymentSelected} onChange={(e) => setPaymentSelected(e.target.value)}>
                                                    <option>Select Payment status</option>

                                                    {
                                                        pay_status.map((x, index) => {

                                                            return (
                                                                <option key={index} value={x.status}>{x.status}</option>

                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>



                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">

                                                <select className="form-control" value={appointmentSelected} onChange={(e) => setAppointmentSelected(e.target.value)}>
                                                    <option>Select Appointment status</option>

                                                    {
                                                        app_status.map((x, index) => {

                                                            return (
                                                                <option key={index} value={x.status}>{x.status}</option>

                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>


                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">
                                                <input type="text" className="form-control" placeholder="Search By Patient Name and Contact No." />
                                            </div>
                                        </div>



                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>


                        <div className="row">


                            <div className="col-lg-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Appointments</h4>
                                       
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Appointment Id</th>
                                                        <th>Patient Name</th>
                                                        <th>Patient Phone</th>
                                                        <th>Appointment Date</th>
                                                        <th>Appointment Time</th>
                                                        <th>Charges</th>
                                                        <th>Payment Status</th>
                                                        <th>Appointment Status</th>
                                                        <th>Before Dialysis(W)</th>
                                                        <th>After Dialysis(W)</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        appointmentData.map((x, index) => {

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{x.appointment_id}</td>
                                                                    <td>{x.patient_name}</td>
                                                                    <td>{x.patient_phone}</td>
                                                                    <td>{x.appointment_date}</td>
                                                                    <td>{x.appointment_time}</td>
                                                                    <td>{x.charges}</td>
                                                                    <td>
                                                                        {
                                                                            x.payment_status == "Pending" ?

                                                                                <label className="badge badge-danger">Pending</label>
                                                                                :
                                                                                <label className="badge badge-success">Completed</label>
                                                                        }

                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            x.appointment_status == "Pending" ?

                                                                                <label className="badge badge-info">Pending</label>
                                                                                : x.appointment_status == "onGoing" ?
                                                                                    <label className="badge badge-warning">On Going</label>
                                                                                    : x.appointment_status == "Cancelled" ?
                                                                                        <label className="badge badge-danger">Cancelled</label>
                                                                                        :
                                                                                        <label className="badge badge-success">Completed</label>

                                                                        }
                                                                    </td>
                                                                    <td>{x.before_weight}</td>
                                                                    <td>{x.after_weight}</td>

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


                        </div>
                  
                    </div>
                    {/* content-wrapper ends */}

                </div>
                {/* main-panel ends */}
            </>

        </Layout>
    )
}

export default Table
