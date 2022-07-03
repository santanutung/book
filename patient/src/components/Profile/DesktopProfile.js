import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import Layout from '../Layout';
import Appointment from './Appointment/Index';
import Enquiry from './Enquiry';
import Family from './Family/Index';
import Report from './Report';
import Review from './Review';


function DesktopProfile() {
    
    const [activeTab, setActiveTab] = useState('appointment')
    const [enableWhatsappNotification, setEnableWhatsappNotification] = useState(false)
    const [yourLocation, setYourLocation] = useState(false)
    const [profile, setProfile] = useState({})

    console.log("whatsApp  ", enableWhatsappNotification, " ", "yourLocation ", yourLocation)

    const [profileData, setProfileData] = useState({})
    const {userName, setUserName} = useGlobalContexts()
    const {pathParam} = useParams()
    const [size, setSize] = useState([0, 0]);
    // useLayoutEffect(() => {
    //     function updateSize() {
    //       setSize([window.innerWidth, window.innerHeight]);
    //       console.log([window.innerWidth, window.innerHeight])
    //     }
    //     window.addEventListener('resize', updateSize);
    //     updateSize();
    //     return () => window.removeEventListener('resize', updateSize);
    //   }, []);



    useEffect(() => {
        // getProfile()
        // alert(pathParam)
        if(pathParam) {
            setActiveTab(pathParam)
        }
        // const queryString = window.location.search;

        // const urlParams = new URLSearchParams(queryString);
        // if (urlParams.get('tab')) {
        //     // alert(urlParams.get('tab'))
        //     setActiveTab(urlParams.get('tab'))

        // }
    }, [pathParam])

    function getProfile() {

        axiosBaseUrl.get(`patients/api/profile`)
            .then((res) => {
                // setP rofile(res.data.data)
                setProfileData(res.data.data)
                // setProfileImage(res.data.data.profile_photo_path)
                // getCities(res.data.data.state)
                //                 setProfile({
                //     name: res.data.data.name,
                //     email: res.data.data.email,
                //     phone: res.data.data.phone,
                //     dob: res.data.data.dob,
                //     insurance_no: res.data.data.insurance_no,
                //     gender: res.data.data.gender,
                //     house_no: res.data.data.house_no,
                //     street: res.data.data.street,
                //     area: res.data.data.area,
                //     city: res.data.data.city,
                //     state: res.data.data.state,
                //     pincode: res.data.data.pincode,
                //     blood_group: res.data.data.blood_group,
                //     // profile_photo_path: res.data.data.profile_photo_path
                // })

                setUserName(res.data.data.name)
                
              

            }).catch(error => {
                console.log(error)

            })
    }

    return (
        <Layout>

            <section id="portfolio-details" className="portfolio-details">
                <div className="container">
                    <div className="row">
                        <div className="col-md-1"> </div>
                        <div className="col-md-10">
                            <div className="card tab_css__design">
                                <div className="row">
                                    <div className="col-md-1" />
                                    <div className="col-md-7">
                                        <div className="card-body">
                                            <blockquote className="blockquote mb-0">
                                                <h3 className="hi__css capitalize">
                                                    Hi, {userName} <br />{" "}
                                                    <span>
                                                        <Link to="/editProfile" className="edit__css" href="#!">
                                                            Edit Proﬁle
                                                        </Link>
                                                    </span>{" "}
                                                </h3>
                                            </blockquote>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className='profile-icons'>
                                            <a className="" href="/Profile">  {userName?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</a>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row row-tab'>
                                <div className='col-md-1-5 text-center appointment-tab pointer'  onClick={() => setActiveTab('appointment')}>
                                   <span> Appointments</span>
                                   {/* <img className="src-imgs" src="img/tab-design-1.png" 
                                   
                                   {
                                    activeTab === 'appointment' ? ''  : ''
                                }
                                   /> */}
                                   <img className={activeTab === 'appointment' ? "src-imgs" : ' src-imgs hidden'} src="img/tab-design-1.png" /> 
                                   
                                </div>
                                <div className='col-md-1-5 text-center family-tab pointer'  onClick={() => setActiveTab('family')}>
                                    <span>Family Member</span>
                                    <img className={activeTab === 'family' ? "src-imgs" : ' src-imgs hidden'} src="img/tab-design-1.png" /> 
                                    {/* {
                                        activeTab === 'family' ? <img className="src-imgs" src="img/tab-design-1.png" /> : ''
                                    } */}
                                </div>
                                <div className='col-md-1-5 text-center report-tab pointer'  onClick={() => setActiveTab('report')}>
                                    <span className='ml-40p'>Reports</span>
                                    <img className={activeTab === 'report' ? "src-imgs" : ' src-imgs hidden'} src="img/tab-design-1.png" /> 
                                    </div>
                                <div className='col-md-1-5 text-center review-tab pointer'  onClick={() => setActiveTab('review')}>
                                    <span className='ml-40p'>Review</span>
                                    <img className={activeTab === 'review' ? "src-imgs" : ' src-imgs hidden'} src="img/tab-design-1.png" /> 
                                    </div>
                                <div className='col-md-1-5 text-center enquiry-tab pointer'  onClick={() => setActiveTab('enquiry')}>
                                    <span className='ml-40p'>Enquiry</span>
                                    <img className={activeTab === 'enquiry' ? "src-imgs" : ' src-imgs hidden'} src="img/tab-design-1.png" /> 
                                    </div>
                            </div>
                            <ul
                                className="nav nav-pills mb-3 btn__shpe hide"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item nav-item-profile" role="presentation">
                                    <button
                                        onClick={() => setActiveTab('appointment')}
                                        className="nav-link active img__btncss"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-home"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-home"
                                        aria-selected="true"
                                    >
                                        Appointments
                                    </button>
                                    {
                                        activeTab === 'appointment' ? <img className="src-imgs" src="img/shape.PNG" /> : ''
                                    }

                                </li>

                                <li className="nav-item nav-item-profile" role="presentation">
                                    <button
                                        onClick={() => setActiveTab('family')}
                                        className="nav-link active img__btncss"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-profile"
                                        aria-selected="true"
                                    >
                                        Family Member
                                    </button>
                                    {
                                        activeTab === 'family' ? <img className="src-imgs" src="img/shape.PNG" /> : ''
                                    }

                                </li>

                                <li className="nav-item nav-item-profile" role="presentation">
                                    <button
                                        onClick={() => setActiveTab('report')}
                                        className="nav-link active img__btncss"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-profile"
                                        aria-selected="true"
                                    >
                                        Reports
                                    </button>
                                    {
                                        activeTab === 'report' ? <img className="src-imgs" src="img/shape.PNG" /> : ''
                                    }

                                </li>
                              
                               
                                <li className="nav-item nav-item-profile" role="presentation">
                                    <button
                                        onClick={() => setActiveTab('review')}
                                        className="nav-link active img__btncss"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-profile"
                                        aria-selected="true"
                                    >
                                        Review
                                    </button>
                                    {
                                        activeTab === 'review' ? <img className="src-imgs" src="img/shape.PNG" /> : ''
                                    }

                                </li>
                                
                                <li className="nav-item nav-item-profile" role="presentation">
                                    <button
                                        onClick={() => setActiveTab('enquiry')}
                                        className="nav-link active img__btncss"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-profile"
                                        aria-selected="true"
                                    >
                                        Enquiry
                                    </button>
                                    {
                                        activeTab === 'enquiry' ? <img className="src-imgs" src="img/shape.PNG" /> : ''
                                    }

                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mgtpoig" />
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-2" />
                            <div className="col-lg-8">
                                <div className="tab-content" id="pills-tabContent">
                                    {
                                        activeTab === 'appointment' ? <Appointment /> : activeTab === 'family' ? <Family /> : activeTab === 'report' ? <Report /> : activeTab === 'review' ? <Review /> : activeTab === 'enquiry' ? <Enquiry /> : ''
                                    }

                                   
                                  
                                   
                                   
                                    <div
                                        className="tab-pane fade"
                                        id="pills-enquiry"
                                        role="tabpanel"
                                        aria-labelledby="pills-enquiry-tab"
                                    >
                                        Enquiry
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </Layout>);
}
export default DesktopProfile;
