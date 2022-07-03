import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import Appointments from './Appointments'
import EditProfile from './EditProfile'
import Family from './Family'
import Report from './Report'
import axiosBaseUrl from '../../axiosBaseUrl'
import { env } from '../../env'
import Reviews from './Review'
import Transaction from './Transaction'
import Enquiry from './Enquiry'
import Notification from './Notification'
import CancelApointments from './Appointments/CancelApointments'

function Profile(props) {

    const [activeTab, setActiveTab] = useState('profile')

    const [enableWhatsappNotification, setEnableWhatsappNotification] = useState(false)
    const [yourLocation, setYourLocation] = useState(false)
    const [profile, setProfile] = useState({})

    console.log("whatsApp  ", enableWhatsappNotification, " ", "yourLocation ", yourLocation)

    const [profileData, setProfileData] = useState({})

    useEffect(() => {
        // getProfile()
        const queryString = window.location.search;

        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('tab')) {
            setActiveTab(urlParams.get('tab'))

        }
    }, [])


   


    return (
        <Layout>
            <section id="portfolio-details" className="portfolio-details">
                <div className="container">

                    <div className="row gy-4">

                        <div className="col-lg-4 offset-md-4">
                            <div className="portfolio-info">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="heading-l">
                                            <h3 className='capitalize'>Hi, {profileData.name}</h3>
                                            {/* <p>Edit Profile</p> */}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <img src={profileData.profile_photo_path ? env.imageurl + profileData.profile_photo_path : "assets/img/user-icon.png"} className="profile-img" />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>




                    <div className="row mt-5 ">
                        <div classname="card1">
                            <div classname="card-header-1">



                                <div classname="table-responsive">
                                    <div classname="tabbable text-center">
                                        <ul className="nav justify-content-center">
                                            <li className="nav-item">
                                                <a class={activeTab === 'profile' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("profile")} >Profile</a>
                                            </li>
                                            <li className="nav-item">
                                                <a class={activeTab === 'appointment' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("appointment")}>Appointment</a>
                                            </li>
                                            <li className="nav-item">
                                                <a class={activeTab === 'c_appointment' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("c_appointment")}>Cancel Appointment</a>
                                            </li>

                                            <li className="nav-item">
                                                <a class={activeTab === 'family' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("family")}>Family Member</a>
                                            </li>

                                            <li className="nav-item">
                                                <a class={activeTab === 'report' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("report")}>Reports</a>
                                            </li>

                                            <li className="nav-item">
                                                <a class={activeTab === 'reviews' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("reviews")}>Reviews</a>
                                            </li>


                                            <li className="nav-item">
                                                <a class={activeTab === 'transactions' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("transactions")}>Transactions/ Wallet</a>
                                            </li>

                                            <li className="nav-item">
                                                <a class={activeTab === 'enquiry' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("enquiry")}>Enquiry</a>
                                            </li>
                                            <li className="nav-item">
                                                <a class={activeTab === 'notification' ? "nav-link active" : 'nav-link'} onClick={() => setActiveTab("notification")}>Notification</a>
                                            </li>



                                        </ul>

                                        {/* <ul classname="nav nav-tabs" id="myTab" role="tablist">
                                            <li classname="nav-item">
                                                <a classname="nav-link active" onClick={() => setActiveTab("profile")} id="first-tab" data-toggle="tab" role="tab" aria-controls="first" aria-selected="true">Profile</a>
                                            </li>
                                            <li classname="nav-item">
                                                <a classname="nav-link" onClick={() => setActiveTab("appointment")} id="second-tab" data-toggle="tab" role="tab" aria-controls="second" aria-selected="false">Appointments</a>
                                            </li>
                                           
                                        </ul> */}
                                    </div>
                                </div>
                            </div>
                            <div classname="card-body1">

                                <div classname="tab-content mt-3">
                                    <div className="tab-pane fade show active" id="first" role="tabpanel" aria-labelledby="first-tab">
                                        {activeTab === 'profile' ?
                                            // ''
                                            <EditProfile profile={profile} setProfile={setProfile} setProfileData={setProfileData} />
                                            :
                                            activeTab === 'appointment' ? <Appointments /> : activeTab === 'report' ? <Report /> : activeTab === 'reviews' ? <Reviews /> : activeTab === 'transactions' ? <Transaction /> : activeTab === 'enquiry' ? <Enquiry /> : activeTab === 'notification' ? <Notification /> : activeTab === 'c_appointment' ? <CancelApointments /> : <Family />}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* <div className="card personal-l">
                            <div className='card-header-1'>

                            </div>
                            <div className="card-body">
                                <div className="col-md-8 offset-md-2">

                                    <button onClick={() => setActiveTab("profile")} className={activeTab == 'profile' ? 'accordion active' : 'accordion'}>Personal Details {activeTab}</button>
                                    <div className={activeTab === 'profile' ? 'panel active-panel' : 'panel'} style={{ maxHeight: activeTab === 'profile' ? 800 : 0 }} >
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>



                                    <div className="row location-bx">
                                        <div className="col-md-5">
                                            <div className="wll-p">
                                                <h3>Your Location <span>Delhi NCR</span></h3>


                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <label className="switch text-right" >
                                                <input onClick={() => setYourLocation(!yourLocation)} type="checkbox" checked={yourLocation} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div><hr />

                                    <button onClick={() => setActiveTab("payment")} className={activeTab === 'payment' ? 'accordion active' : 'accordion'}>Saved Payment Modes</button>
                                    <div className={activeTab === 'payment' ? 'panel active-panel' : 'panel'} style={{ maxHeight: activeTab === 'payment' ? 800 : 0 }} >


                                    </div>

                                    <button onClick={() => setActiveTab("appointment")} className={activeTab === 'appointment' ? 'accordion active' : 'accordion'}>Past appointments</button>
                                    <div className={activeTab === 'appointment' ? 'panel active-panel' : 'panel'} style={{ maxHeight: activeTab === 'appointment' ? 800 : 0 }} >
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Appointment Id</th>
                                                        <th>Center</th>
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
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>

                                    <button onClick={() => setActiveTab("help")} className={activeTab === 'help' ? 'accordion active' : 'accordion'}>Help & Support</button>
                                    <div className={activeTab === 'help' ? 'panel active-panel' : 'panel'} style={{ maxHeight: activeTab === 'help' ? 800 : 0 }} >
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>


                                </div>
                            </div>
                        </div> */}
                        {/* <div className="border-l"></div> */}
                    </div>

                    {/* <div className="row box-w">
                        <div className="col-md-4 offset-md-2">
                            <div className="wp">
                                <h3>Whatsapp Notification</h3>
                                <p>Get booking information on whatsapp</p>
                            </div>
                        </div>
                        <div className="col-md-4 offset-md-2">
                            <label className="switch">
                                <input onClick={() => setEnableWhatsappNotification(!enableWhatsappNotification)} type="checkbox" checked={enableWhatsappNotification} />
                                <span className="slider round"></span>
                            </label>
                        </div>



                    </div> */}
                </div>

            </section>
        </Layout>
    )
}

export default Profile
