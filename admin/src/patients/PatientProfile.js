import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout'
import Appointments from './Appointments';
import FamilyMembers from './FamilyMembers';
import Reports from './Reports';
import { useParams } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'
import { env } from '../env';
import moment from 'moment';
import Reviews from './Reviews';
import useGlobalContexts from '../context/GlobalContext';

function PatientProfile() {

    const {setLoadingState} = useGlobalContexts();
    const [activeTab, setActiveTabs] = useState("Appointments")
    // const [loading, setLoading] = useState(false)

    const { id } = useParams();

    const [patient, setPatient] = useState({});
    const [members, setMembers] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        getPatient()
    }, [])


    function getPatient() {
        setLoadingState(true)
        axiosBaseUrl.get(`admin/patient-profile/${id}`)
            .then((res) => {
                // console.log(res.data.members)
                // setIntroduction(res.patient.patient.description)
                setPatient(res.data.data)
                setMembers(res.data.members)
                setAppointments(res.data.appointments)
                setReports(res.data.reports)
                setReviews(res.data.reviews)
                setLoadingState(false)

            }).catch(error => {
                // console.log(error)
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
                                            <li className="breadcrumb-item"><Link to="/managePatients">Manage Patients</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Patient Profile</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-12 col-xl-3 mt-2">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">
                                        <div className="row">
                                            <div className="col-md-12 d-flex align-items-center" style={{ justifyContent: 'center' }}>

                                                <img src={patient.profile_photo_path ? env.imageurl + patient.profile_photo_path : "assets/images/faces/user-icon.png"} style={{ width: 150, borderRadius: "50%", height: 150 }} />

                                            </div>

                                        </div>
                                    </div>
                                    <div className="card-body p-3">

                                        {/* <hr className="horizontal gray-light my-4" /> */}
                                        <ul className="list-group">
                                            <li className="list-group-item border-0 ps-0 pt-0 text-sm capitalize">
                                                <strong className="text-dark">Patient Name:</strong> &nbsp; {patient.name}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Email Address:</strong> &nbsp; {patient.email}
                                            </li>

                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Contact No.:</strong> &nbsp; {patient.phone}
                                            </li>

                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Address:</strong> &nbsp; 
                                                {((patient.house_no ? patient.house_no : '')+ " "+(patient.street ? patient.street : '')+" "+(patient.area ? patient.area : '')+" "+(patient.city ? patient.city : '')+" "+(patient.state ? patient.state : '')+" "+(patient.pincode ? patient.pincode : '')).trim()}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">DOB:</strong> &nbsp; {patient.dob ? moment(patient.dob).format('DD/MM/YYYY') : ''}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm capitalize">
                                                <strong className="text-dark">Gender:</strong> &nbsp; {patient.gender}
                                            </li>

                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Blood Group:</strong> &nbsp; {patient.blood_group}
                                            </li>

                                            {/* <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Wallet Amount:</strong> &nbsp; {patient.blood_group}
                                            </li> */}



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
                                            <li className="nav-item">
                                                <button
                                                    className={activeTab === "family_members" ? `nav-link active` : `nav-link`}
                                                    id="pills-profile-tab"
                                                    data-bs-toggle="pill"
                                                    role="tab"
                                                    aria-controls="pills-profile"
                                                    aria-selected="false"
                                                    onClick={() => setActiveTabs("family_members")}
                                                >
                                                    Family Members
                                                </button>
                                            </li>

                                            <li className="nav-item">
                                                <button
                                                    className={activeTab === "reviews" ? `nav-link active` : `nav-link`}
                                                    id="pills-profile-tab"
                                                    data-bs-toggle="pill"
                                                    role="tab"
                                                    aria-controls="pills-profile"
                                                    aria-selected="false"
                                                    onClick={() => setActiveTabs("reviews")}
                                                >
                                                   Reviews
                                                </button>
                                            </li>

                                        </ul>


                                        <div className="tab-content" id="pills-tabContent">

                                            {
                                                activeTab === "Appointments" ?

                                                    <Appointments appointments={appointments} id={id} setAppointments={setAppointments}/>

                                                    :
                                                    activeTab === 'Reports' ? 
                                                    <Reports reports={reports}/> 
                                                    :

                                                    activeTab === 'reviews' ? 
                                                    <Reviews reviews={reviews}/> 
                                                    :
                                                    <FamilyMembers members={members}/>


                                                    

                                            }


                                        </div>
                                    </div>


                                </div>
                            </div>





                        </div>




                    </div>







                </div>
            </div>


        </Layout>
    )
}

export default PatientProfile
