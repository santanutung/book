import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Layout from '../../Layout'
import { appointments } from '../../rawData/AppointmentRawData';
// import { appointment_status, payment_status } from '../../rawData/AppointmentStatus';

// import Swal from "sweetalert2";
import Footer from '../partials/Footer';
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import moment from 'moment';
import cancelAppointment from '../../events/events';
import { env } from '../../env';
import Report from './Report';


function PatientProfile() {

    const { type, id } = useParams();

    // const appointmentData = appointments;
    const [activeTab, setActiveTabs] = useState("Appointments")
    const [user, setUser] = useState({})
    const [appointmentData, setAppointmentData] = useState([])
    const [reports, setReports] = useState([])
    const [afterWeight, setAfterWeight] = useState('')


    useEffect(() => {
        console.log(type, id)
        getPatient()
    }, [])
    function getPatient() {
        axiosBaseUrl.get(`private/center/patient/${id}`)
            .then((res) => {
                console.log(res.data.data)
                setUser(res.data.data)
                setAppointmentData(res.data.appointments)
                setReports(res.data.reports)
            }).catch(error => {
                console.log(error.response.status)
                if (error.response) {
                    // Swal.fire(error.response.data.error, '', 'error')


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


    const cancelAppointment = (id, appointment_key) => {
        Swal.fire({
            title: 'Do you want to cancel ' + appointment_key + ' appointment?',
            showCancelButton: true,
            confirmButtonText: `Save`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.put(`private/appointment-cancel/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Appointment is successfully cancelled', 'success')
                        getPatient()


                    }).catch(error => {
                        console.log(error)

                    })


            }
            else {

            }
        });
    }


    const updateStatusHandler = (id, status) => {

        let placeholder = "";

        if (status == 'pending') {
            placeholder = "Enter Weight before dialysis"
        }
        else {
            placeholder = "Enter Weight after dialysis"
        }
        var weight = 0;

        Swal.fire({
            title: 'Update Status',
            html: ` <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <input id="after_weight" class="form-control search input-box" name="after_weight"  placeholder="${placeholder}"/>
                            </div>
                        </div>
                    </div>`,
            confirmButtonText: 'Update',
            focusConfirm: false,
            showCancelButton: true,

            preConfirm: () => {
                const after_weight = Swal.getPopup().querySelector('#after_weight').value
                if (!after_weight) {

                    if (status == 'pending') {
                        Swal.showValidationMessage(`Please Enter Before Dialysis Weight`)

                    }
                    else {

                        Swal.showValidationMessage(`Please Enter After Dialysis Weight`)
                    }
                }
                else {
                    weight = after_weight

                }
                return { afterWeight: after_weight }
            }
        }).then((result) => {
            console.log("result ", result)

            var data = { 'appointment_status': status === 'pending' ? "ongoing" : "completed" }
            if (status == 'pending') {
                data['before_weight'] = weight
            }
            else {
                data['after_weight'] = weight
            }

            if (result.isConfirmed == true) {
                axiosBaseUrl.put(`private/center/appointment/${id}`, data)
                    .then((res) => {
                        console.log(res)
                        getPatient()
                        Swal.fire("Weight is successfully updated", '', 'success')

                    }).catch(error => {
                        console.log(error)
                        if (error.response) {
                            Swal.fire(error.response.data.error, '', 'error')


                        }
                        else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                    })


                console.log(result.value.afterWeight, " and ", result.value.updatedStatus)
            }

        })
    }

    return (
        <>
        {
            !user.name ? ''
            :
        <Layout>

            <div className="main-panel">
                <div className="content-wrapper">

                    <div className="row">
                        <div className="col-md-12 ">
                            <div className="row">
                                <div className="col-xl-12">


                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"
                                            ><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Patients List</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row mt-5">
                        <div className="col-md-3 grid-margin grid-margin-md-0 stretch-card">
                            <div className="card h-100">
                                <div className="card-header pb-0 p-3">
                                    <div className="row">
                                        <div className="col-md-12 d-flex align-items-center" style={{ justifyContent: 'center' }}>

                                            <img alt="profile" src={user.profile_photo_path ? env.imageurl + user.profile_photo_path : "centerassets/images/faces/user-icon.png"} style={{ width: 150, borderRadius: "50%", height: 150 }} />

                                        </div>

                                    </div>
                                </div>
                                <div className="card-body p-3">

                                    {/* <hr className="horizontal gray-light my-4" /> */}
                                    <ul className="list-group">
                                        <li className="list-group-item border-0 ps-0 pt-0 text-sm capitalize">
                                            <strong className="text-dark ">Patient Name:</strong> &nbsp; {user.name}
                                        </li>
                                        <li className="list-group-item border-0 ps-0 text-sm">
                                            <strong className="text-dark">Email Address:</strong> &nbsp; {user.user_id?.email}
                                        </li>

                                        <li className="list-group-item border-0 ps-0 text-sm">
                                            <strong className="text-dark">Contact No.:</strong> &nbsp; {user.user_id?.phone}
                                        </li>

                                        <li className="list-group-item border-0 ps-0 text-sm">
                                            <strong className="text-dark">Address:</strong> &nbsp;  {user.user_id?.address != null ? user.user_id?.address : ""}
                                            {user.user_id?.city != null ? " "+user.user_id?.city : ""}
                                            {user.user_id?.state != null ? " "+user.user_id?.state : ""}
                                            {user.user_id?.pincode != null ? " "+user.user_id?.pincode : ""}
                                        </li>
                                        <li className="list-group-item border-0 ps-0 text-sm">
                                            <strong className="text-dark">DOB:</strong> &nbsp;  {user.dob ? moment(user.dob).format('DD/MM/YYYY') : '   '}
                                        </li>
                                        <li className="list-group-item border-0 ps-0 text-sm capitalize">
                                            <strong className="text-dark">Gender:</strong> &nbsp;  {user.gender}
                                        </li>

                                        <li className="list-group-item border-0 ps-0 text-sm">
                                            <strong className="text-dark">Blood Group:</strong> &nbsp;  {user.blood_group ? user.blood_group.toUpperCase() : ''}
                                        </li>



                                    </ul>
                                </div>
                            </div>
                        </div>



                        <div className="col-md-9 grid-margin grid-margin-md-0 stretch-card">


                            <div className="card">

                                <div className="card-body">

                                    <ul className="nav nav-pills nav-pills-success" id="pills-tab" role="tablist">
                                        <li className="nav-item">
                                            <button
                                                className={activeTab === "Appointments" ? `nav-link active` : `nav-link`}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                role="tab"
                                                aria-controls="pills-home"
                                                aria-selected="true"
                                                onClick={() => setActiveTabs("Appointments")}
                                            >
                                                Appointments
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={activeTab === "Reports" ? `nav-link active` : `nav-link`}
                                                id="pills-profile-tab"
                                                data-bs-toggle="pill"
                                                role="tab"
                                                aria-controls="pills-profile"
                                                aria-selected="false"
                                                onClick={() => setActiveTabs("Reports")}
                                            >
                                                Reports
                                            </button>
                                        </li>

                                    </ul>


                                    <div className="tab-content" id="pills-tabContent">

                                        {
                                            activeTab === "Appointments" ?

                                                <div
                                                    className="tab-pane fade active show"
                                                    id="pills-home"
                                                    role="tabpanel"
                                                    aria-labelledby="pills-home-tab"
                                                >

                                                    <div className="table-responsive">
                                                        <table
                                                            className="display expandable-table"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <thead>
                                                                <tr>

                                                                    <th>Id</th>
                                                                    <th>Time</th>
                                                                    {/* <th>Appointment Time</th> */}
                                                                    <th>Charges</th>
                                                                    <th>Payment</th>
                                                                    <th>Status</th>
                                                                    <th>Before Dialysis(W)</th>
                                                                    <th>After Dialysis(W)</th>
                                                                    <th>Update</th>
                                                                    <th>Cancel Appointment</th>

                                                                </tr>
                                                            </thead>

                                                            <tbody>

                                                                {
                                                                    appointmentData.map((x, index) => {

                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{x.appointment_key}</td>
                                                                                <td className='word-break'>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')} <br/>({x.appointment_start_time})</td>
                                                                                <td>{x.charges}</td>
                                                                                <td  className='word-break'>{x.payment_status} <br/>({x.payment_type})</td>
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
                                                                                <td>{x.before_weight}</td>
                                                                                <td>{x.after_weight}</td>
                                                                                <td>
                                                                                    <button className="btn custom-btn btn-sm" disabled={(x.appointment_status === "cancelled" || x.appointment_status === "completed") ? true : false}
                                                                                        onClick={() => updateStatusHandler(x._id, x.appointment_status)}
                                                                                    >
                                                                                        Update
                                                                                    </button>
                                                                                </td>

                                                                                <td>
                                                                                    <button className="btn btn-danger btn-sm" disabled={x.appointment_status != "pending" ? true : false}
                                                                                        onClick={() => cancelAppointment(x._id, x.appointment_id)}
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                </td>


                                                                            </tr>

                                                                        )
                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>
                                                    </div>

                                                </div>

                                                :

                                                <Report reports={reports} />

                                        }


                                    </div>
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
        }
        </>
    )
}

export default PatientProfile
