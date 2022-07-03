import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useGlobalContexts from '../../context/GlobalContext';

function Sidebar() {
    const location = useLocation();
    const [currentUrl, setCurrentUrl] = useState()
    const {sidebar} = useGlobalContexts()
    useEffect(() => {
        setCurrentUrl(location.pathname)
        // alert(location.pathname)
    }, [])
    console.log(location.pathname)
    return (
        <nav className={!sidebar ? "sidebar sidebar-offcanvas"  : "sidebar " }id="sidebar">
            <ul className="nav">
                <li className={currentUrl === '/dashboard' ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/dashboard">
                    <i class="fas fa-tachometer-alt"></i>
                        <span className="menu-title">Dashboard</span>
                    </Link>
                </li>
               
                <li className="nav-item nav-category">Centre</li>
                <li className={currentUrl === '/manageCentre' || location.pathname.includes('centreProfile') === true ||location.pathname.includes('slots') === true || location.pathname.includes('editCentre') === true ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/manageCentre"
                    >
                        <i className="fas fa-hospital" />
                        <span className="menu-title">Manage Centre</span>
                    </Link>
                </li>
                <li className={currentUrl === '/centreRequest'? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/centreRequest"
                    >
                        <i className="fas fa-hospital" />
                        <span className="menu-title">Centre Requests</span>
                    </Link>
                </li>

                <li className={currentUrl === '/managePatients' || location.pathname.includes('patientProfile') === true  ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/managePatients">
                        <i className=" fas fa-users" />
                        <span className="menu-title">Manage Patients</span>
                    </Link>
                </li>


               
                



                {/* <li className="nav-item">
                    <a
                        className="nav-link"
                        data-bs-toggle="collapse"
                        href="#ui-basic"
                        aria-expanded="false"
                        aria-controls="ui-basic"
                    >
                        <i className="menu-icon mdi mdi-floor-plan" />
                        <span className="menu-title">Center</span>
                        <i className="menu-arrow" />
                    </a>

                    <div className="collapse" id="ui-basic">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" to="/manageCenter">
                                    Manage Center
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" to="/centerRequest">
                                    Center Request
                                </Link>
                            </li>

                        </ul>
                    </div>
                </li> */}

                <li className="nav-item nav-category">Appointments</li>
                <li className={currentUrl === '/appointmentHistory' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/appointmentHistory"
                    >
                       <i class="fas fa-calendar-check"></i>
                        <span className="menu-title">Appointment History</span>
                    </Link>
                </li>
                <li className={currentUrl === '/todayAppointments' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/todayAppointments"
                    >
                       <i class="fas fa-calendar-check"></i>
                        <span className="menu-title">Today Appointments</span>
                    </Link>
                </li>
                <li className={currentUrl === '/cancelledAppointments' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/cancelledAppointments"
                    >
                        <i class="fas fa-calendar-check"></i>
                        <span className="menu-title">Cancelled Appointments</span>
                    </Link>
                </li>

                

                <li className={currentUrl === '/upcomingAppointments' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/upcomingAppointments"
                    >
                        <i class="far fa-calendar-check"></i>
                        <span className="menu-title">Upcoming Appointments</span>
                    </Link>
                </li>

                {/* <li className="nav-item nav-category">Employee</li> */}
                {/* <li className={currentUrl === '/manageEmployee' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/manageEmployee"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Manage Employee</span>
                    </Link>
                </li> */}

                <li className={currentUrl === '/enquiry' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/enquiry"
                    >
                        <i class="fas fa-question-circle"></i>
                        <span className="menu-title">Enquiry</span>
                    </Link>
                </li>

                <li className={currentUrl === '/centre-enquiry' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/centre-enquiry"
                    >
                        <i class="fas fa-question-circle"></i>
                        <span className="menu-title">Centre Enquiry</span>
                    </Link>
                </li>


                

                <li className={currentUrl === '/manageTestimonials' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/manageTestimonials"
                    >
                        <i class="fas fa-comment-alt"></i>
                        <span className="menu-title">Testimonials</span>
                    </Link>
                </li>

                {/* <li className={currentUrl === '/notifications' ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/notifications"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Notifications</span>
                    </Link>
                </li> */}


                
                
                <li className={currentUrl === '/blogs' || currentUrl === '/addBlog' || location.pathname.includes('editBlog') ? "nav-item active" : "nav-item"}>
                    <Link
                        className="nav-link"
                        to="/blogs"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Manage Blogs</span>
                    </Link>
                </li>


                <li className="nav-item nav-category">Settings</li>
                <li className={currentUrl== '/about-us' ? 'nav-item active' : 'nav-item' }>
                    <Link
                        className="nav-link"
                        to="/about-us"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">About Us</span>
                    </Link>
                </li>
                <li className={currentUrl== '/term-condition' ? 'nav-item active' : 'nav-item' }>
                    <Link
                        className="nav-link"
                        to="/term-condition"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Term & Conditions</span>
                    </Link>
                </li>

                <li className={currentUrl== '/privacy-policy' ? 'nav-item active' : 'nav-item' }>
                    <Link
                        className="nav-link"
                        to="/privacy-policy"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Privacy & Policy</span>
                    </Link>
                </li>

                <li className={currentUrl== '/contact-setting' ? 'nav-item active' : 'nav-item' }>
                    <Link
                        className="nav-link"
                        to="/contact-setting"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Contact</span>
                    </Link>
                </li>

                <li className={currentUrl== '/chats' ? 'nav-item active mb-3' : 'nav-item mb-3' }>
                    <Link
                        className="nav-link"
                        to="/chats"
                    >
                        <i className="menu-icon mdi mdi-file-document" />
                        <span className="menu-title">Centre Chat</span>
                    </Link>
                </li>

              
            </ul>
            
        </nav>

    )
}

export default Sidebar
