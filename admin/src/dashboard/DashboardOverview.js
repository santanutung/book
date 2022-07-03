import React, { useState, useEffect } from 'react'
import CenterCard from '../center/CenterCard';
import axiosBaseUrl from '../axiosBaseUrl'
import { appointments } from '../rawData/AppointmentRawData';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Loader from '../ReuseableComponent/Loader';
import useGlobalContexts from '../context/GlobalContext';
import EnquiryList from './EnquiryList';

function DashboardOverview(props) {
    const { tabs, setTabs } = props
    // const centerData = centerData;
    const { setLoadingState } = useGlobalContexts();
    const [centerRequestData, setCenterRequestData] = useState([])
    const [statsData, setStatsData] = useState([])
    // const [enquiries, setEnquiry] = useState([])

    const [appointmentData, setAppointmentData] = useState([])

    useEffect(() => {
        setLoadingState(true)
        getPendingCenters()
        getStats()

        getAppointment(1)
        // getEnquiries(1)

    }, [])

    function getStats() {
        setLoadingState(true)
        axiosBaseUrl.get(`admin/stats`)
            .then((res) => {
                console.log("stats", res.data)
                setStatsData(res.data.data)
                setLoadingState(false)


            }).catch(error => {
                console.log(error.response)
                if (error.response) {
                    alert("test")

                    alert(error.response.data.error)

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


    function getPendingCenters() {
        axiosBaseUrl.get(`admin/center?verify_status=pending`)
            .then((res) => {
                console.log(res.data)
                setCenterRequestData(res.data.data)



            }).catch(error => {
                console.log(error)
                if (error.response) {

                    alert(error.response.data.error)

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

    function getAppointment(page) {
        axiosBaseUrl.get(`admin/center/appointments?appointment_status=ne-cancelled&date=${moment().format('YYYY-MM-DD')}`)
            .then((res) => {
                setAppointmentData(res.data.data)


            }).catch(error => {
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






    return (
        <div className="tab-content tab-content-basic">
            <div
                className="tab-pane fade show active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview"
            >
                <div className="row mb-3 dashabord-card-list">

                    <div className="col-xl-2 col-md-4 mb-3">
                        <Link to="/manageCentre" className="center-card-a">
                            <div className="card bl-primary ">
                                <div className="card-body">
                                    <p className="statistics-title">Total Centres</p>
                                    <h3 className="rate-percentage">{statsData['totalCenters']}</h3>
                                </div>

                            </div>
                        </Link>
                    </div>

                    <div className="col-xl-2 col-md-4 mb-3">
                        <Link to="/upcomingAppointments" className="center-card-a">
                            <div className="card bl-purple">
                                <div className="card-body">
                                    <p className="statistics-title">Total Appointments</p>
                                    <h3 className="rate-percentage">{statsData['offlineAppointments'] + statsData['onlineAppointments']}</h3>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className="col-xl-2 col-md-4 mb-3">
                        <Link to="/centreRequest" className="center-card-a">
                            <div className="card bl-danger ">
                                <div className="card-body">
                                    <p className="statistics-title">Centre Pending Request</p>
                                    <h3 className="rate-percentage text-danger">{centerRequestData.length}</h3>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className="col-xl-2 col-md-4 mb-3">
                        <Link to="/upcomingAppointments" className="center-card-a">
                            <div className="card bl-teal">
                                <div className="card-body">
                                    <p className="statistics-title">Today Appointments</p>
                                    <h3 className="rate-percentage">{statsData['todayAppointments']}</h3>
                                </div>

                            </div>
                        </Link>
                    </div>
                    <div className="col-xl-2 col-md-4 mb-3">
                        <a onClick={() => setTabs('stats')} className="center-card-a">
                            <div className="card bl-yellow">
                                <div className="card-body">
                                    <p className="statistics-title">
                                        Total Earning
                                    </p>
                                    <h3 className="rate-percentage">{statsData['offlineEarning'] + statsData['onlineEarning']}</h3>
                                </div>

                            </div>
                        </a>
                    </div>
                    <div className="col-xl-2 col-md-4 mb-3">
                    <a onClick={() => setTabs('stats')} className="center-card-a">
                        <div className="card bl-gray">
                            <div className="card-body">
                                <p className="statistics-title">Total Commission</p>
                                <h3 className="rate-percentage">{statsData['totalCommission']}</h3>
                            </div>

                        </div>
                        </a>
                    </div>



                </div>


                <div className="row">
                    <div className="col-xl-8 d-flex flex-column">

                        {/* <div className="row flex-grow">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card card-rounded table-darkBGImg">
                                    <div className="card-body">
                                        <div className="col-sm-8">
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-12 grid-margin ">
                                <div className="card card-rounded">
                                    <div className="card-body">
                                        <div className="d-sm-flex justify-content-between align-items-start">
                                            <div>
                                                <h4 className="card-title card-title-dash">
                                                    Today Appointments
                                                </h4>

                                            </div>

                                        </div>
                                        <div className="table-responsive mt-2">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Appt. Id</th>
                                                        <th>Centre</th>
                                                        <th>Patient Name</th>
                                                        <th>Patient Phone</th>
                                                        <th>Appt. Time</th>
                                                        <th>Charges</th>
                                                        <th>Payment</th>
                                                        <th>Appt. Status</th>


                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        appointmentData.length == 0 ?
                                                            <tr>
                                                                <th className="text-center" colSpan="9">
                                                                    Today Appointments are not available
                                                                </th>
                                                            </tr>
                                                            :

                                                            appointmentData.map((x, index) => {

                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{x.appointment_key}</td>
                                                                        <td><Link to={"/centerProfileScreen/" + x.center_id[0]._id}>{x.center_id[0].name}</Link></td>
                                                                        <td>{x.patient_familyMemberId.name}</td>
                                                                        <td>{x.patient_familyMemberId.phone}</td>
                                                                        <td>{x.appointment_start_time}</td>
                                                                        <td>₹ {x.charges}</td>
                                                                        <td>
                                                                            {
                                                                                x.payment_status == "pending" ?

                                                                                    <label className="badge badge-danger">Pending</label>
                                                                                    :
                                                                                    <label className="badge badge-success">Completed</label>
                                                                            }
                                                                            ({x.payment_type})

                                                                        </td>
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

                            <div className="col-lg-12 grid-margin mt-3">
                            <EnquiryList />
                                
                            </div>
                        </div>

                    </div>
                    <div className="col-xl-4 d-flex flex-column">

                        <div className="row flex-grow">
                            <div className="col-12 grid-margin ">
                                <div className="card card-rounded">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <h4 className="card-title card-title-dash">
                                                            Centre Pending Request
                                                        </h4>
                                                    </div>
                                                    <div>

                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    {centerRequestData.slice(0,4).map((data, key) => {

                                                        return (
                                                            <Link to={"/centerProfile/" + data._id} className="center-card-a">
                                                                <CenterCard idkey={key} request="pending" data={data} classNameList="mt-2" />
                                                            </Link>
                                                        );
                                                    })}


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
