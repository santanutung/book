import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useGlobalContexts from '../../context/GlobalState';

function Sidebar() {
    const location = useLocation();
    const [currentUrl, setCurrentUrl] = useState()
    const {mobileMenu, setMobileMenu} = useGlobalContexts()
    useEffect(() => {
        setMobileMenu(false)
        setCurrentUrl(location.pathname)
        // alert(location.pathname)
        // alert(location.pathname.includes('patientProfile'))
    }, [])
    return (
        <nav className={mobileMenu ? "sidebar sidebar-offcanvas width-150" : 'sidebar sidebar-offcanvas '} id="sidebar">
            <ul className="nav">
      
                <li className={currentUrl === '/dashboard' || currentUrl === '/appointmentHistory' || currentUrl === '/cancelledAppointment' || currentUrl === '/offlineAppointment' || currentUrl === '/upcomingAppointments' ? "nav-item active" : "nav-item"} >
                    <Link className="nav-link" to="/dashboard">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Dashboard</span>
                    </Link>
                </li>


                {/* <li className="nav-item">
                    <Link className="nav-link" to="/Profiles">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Profile</span>
                    </Link>
                </li> */}
                <li className={currentUrl == '/manageSlots' ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/manageSlots">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Manage Slots</span>
                    </Link>
                </li>


                {/* <li className="nav-item">
                    <Link className="nav-link" to="/upcomingAppointments">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Upcoming Appointments</span>
                    </Link>
                </li>


                <li className="nav-item">
                <Link className="nav-link" to="/cancelAppointment">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Cancel Appointment</span>
                    </Link>
                </li>



                <li className="nav-item">
                <Link className="nav-link" to="/appointmentHistory">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Appointments History</span>
                    </Link>
                </li> */}


                
                  <li className={currentUrl == '/bookAppointment' ? "nav-item active" : "nav-item"}>
                      <Link className="nav-link" to="/bookAppointment">
                          <i className="icon-grid menu-icon" />
                          <span className="menu-title">Book Appointment</span>
                      </Link>
                  </li>
              

                <li className={(currentUrl == '/patients' || location.pathname.includes('patientProfile') == true) ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/patients">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Patient List</span>
                    </Link>
                </li>


                <li className={currentUrl == '/stats' ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/stats">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Stats</span>
                    </Link>
                </li>





                

{/* 
                <li className="nav-item">
                    <Link className="nav-link" to="/gallery">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Gallery</span>
                    </Link>
                </li> */}


                <li className={currentUrl == '/reviews' ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/reviews">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Reviews and Rating</span>
                    </Link>
                </li>


                <li className={currentUrl == '/enquiry' ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/enquiry">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Enquiry</span>
                    </Link>
                </li>



{/* 
                <li className="nav-item">
                    <Link className="nav-link" to="/notifications">
                        <i className="icon-grid menu-icon" />
                        <span className="menu-title">Notifications</span>
                    </Link>
                </li> */}


                {/*                            

                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#ui-basic"
                        aria-expanded="false"
                        aria-controls="ui-basic"
                    >
                        <i className="icon-layout menu-icon" />
                        <span className="menu-title">UI Elements</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="ui-basic">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/ui-features/buttons.html">
                                    Buttons
                                </a>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/ui-features/dropdowns.html">
                                    Dropdowns
                                </a>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/ui-features/typography.html">
                                    Typography
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
               
               
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#form-elements"
                        aria-expanded="false"
                        aria-controls="form-elements"
                    >
                        <i className="icon-columns menu-icon" />
                        <span className="menu-title">Form elements</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="form-elements">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                <a className="nav-link" href="pages/forms/basic_elements.html">
                                    Basic Elements
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
              
            
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#charts"
                        aria-expanded="false"
                        aria-controls="charts"
                    >
                        <i className="icon-bar-graph menu-icon" />
                        <span className="menu-title">Charts</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="charts">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/charts/chartjs.html">
                                    ChartJs
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
         
         
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#tables"
                        aria-expanded="false"
                        aria-controls="tables"
                    >
                        <i className="icon-grid-2 menu-icon" />
                        <span className="menu-title">Tables</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="tables">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/tables/basic-table.html">
                                    Basic table
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
       
       
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#icons"
                        aria-expanded="false"
                        aria-controls="icons"
                    >
                        <i className="icon-contract menu-icon" />
                        <span className="menu-title">Icons</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="icons">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/icons/mdi.html">
                                    Mdi icons
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
          

                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#auth"
                        aria-expanded="false"
                        aria-controls="auth"
                    >
                        <i className="icon-head menu-icon" />
                        <span className="menu-title">User Pages</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="auth">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/samples/login.html">
                                    {" "}
                                    Login{" "}
                                </a>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/samples/register.html">
                                    {" "}
                                    Register{" "}
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
          
          
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#error"
                        aria-expanded="false"
                        aria-controls="error"
                    >
                        <i className="icon-ban menu-icon" />
                        <span className="menu-title">Error pages</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="error">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/samples/error-404.html">
                                    {" "}
                                    404{" "}
                                </a>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" href="pages/samples/error-500.html">
                                    {" "}
                                    500{" "}
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
             
                <li className="nav-item">
                    <a className="nav-link" href="pages/documentation/documentation.html">
                        <i className="icon-paper menu-icon" />
                        <span className="menu-title">Documentation</span>
                    </a>
                </li>
           */}

            </ul>
        </nav>

    )
}

export default Sidebar
