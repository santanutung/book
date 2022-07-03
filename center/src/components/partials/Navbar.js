import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalState';
import { socket } from '../../context/socket';
import { LOGOUT, selectCenterId, selectCenterName } from '../../Redux/userSlice';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()
function Navbar() {
    const dispatch = useDispatch()
    const centerId = useSelector(selectCenterId)
    const {mobileMenu, setMobileMenu} = useGlobalContexts()

    const [notifications, setNotifications] = useState([])
    const [currentNotification, setCurrentNotification] = useState(0)
    const [currentMessage, setCurrentMessage] = useState({})
    const location = useLocation();
    const CustomToastWithLink = (message) => (

        <div>
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
        </div>
    );
   
    useEffect(() => {
        getNotifications()
        socket.on(`${centerId}-notifications`, (data) => {
            getNotifications()
            setCurrentNotification(true)

            var url = data.module === 'appointment' ? '/upcomingAppointments' : ''
            toast(CustomToastWithLink(`<a href=${url}>${data.message}</a>`))
          
        });
       

        socket.on(`${centerId}-center-chat`, (data) => {
          
            if(data.sender === 'admin') {
                
                if(location.pathname !== '/enquiry') {
                    toast(CustomToastWithLink(`<a href="/enquiry">${data.message}</a>`))
                }
            }

          

        });


        


    }, [])

    function getNotifications() {
        axiosBaseUrl.get(`private/center/notifications`)
            .then((res) => {
                setNotifications(res.data.data)
                // setCurrentNotification((res.data.unreadNotification).length)


            }).catch(error => {
                console.log(error)

            })
    }

    const signoutHandler = () => {
        localStorage.clear();
        dispatch(LOGOUT())
    }
    return (
        <>
            <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <Link className="navbar-brand brand-logo mr-5" to="/">
                        {/* <img src="assets/images/logo.svg" className="mr-2" alt="logo" /> */}
                        {/* <h3>BookCare</h3> */}
                        <img src='centerassets/images/logo.png' />
                    </Link>
                    <Link className="navbar-brand brand-logo-mini" to="/">
                        {/* <img src="assets/images/logo-mini.svg" alt="logo" /> */}
                        {/* <h6>BookCare</h6> */}
                        <img src='centerassets/images/logo.png' />
                    </Link>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                    {/* <button
                        onClick={() => {setMobileMenu(false)}}
                        className="navbar-toggler navbar-toggler align-self-center"
                        type="button"
                        data-toggle="minimize"
                    >
                        <span className="icon-menu" />
                    </button> */}

                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link count-indicator dropdown-toggle"
                                id="notificationDropdown"
                                to="/notifications"
                                data-toggle="dropdown"
                            >
                                <i className="icon-bell mx-0" />
                                {

                                    currentNotification ? <span className="count" /> : ''
                                }

                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
                                aria-labelledby="notificationDropdown"
                            >
                                <p className="mb-0 font-weight-normal float-left dropdown-header">
                                    Notifications
                                </p>
                                {
                                    notifications.slice(0, 5).map((notification, index) => {
                                        return (
                                            <Link className="dropdown-item preview-item" key={index + "head-notify"} to={notification.module === 'enquiry' ? '/enquiry' : notification.module === 'appointment' ? '/upcomingAppointments' : ''}>
                                                <div className="preview-thumbnail">
                                                    <div className={notification.isRead ? "preview-icon bg-success" : "preview-icon bg-danger"}>
                                                        <i className="ti-info-alt mx-0" />
                                                    </div>
                                                </div>
                                                <div className="preview-item-content">
                                                    <h6 className="preview-subject font-weight-normal">
                                                        {notification.message.slice(0,20)}{notification.message.length > 20 ? '...' : ''}
                                                    </h6>
                                                    <p className="font-weight-light small-text mb-0 text-muted">
                                                        {notification.date}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                                <p className='text-center'><Link to="/notifications">View All</Link></p>


                            </div>
                        </li>
                        <li className="nav-item nav-profile dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                data-toggle="dropdown"
                                id="profileDropdown"
                            >
                                <img src="centerassets/images/faces/user-icon.png" alt="profile" />
                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right navbar-dropdown"
                                aria-labelledby="profileDropdown"
                            >
                                <Link className="dropdown-item" to="/Profiles">
                                    <i className="ti-settings text-primary" />
                                    Profile
                                </Link>
                                <button className="dropdown-item" onClick={signoutHandler}>
                                    <i className="ti-power-off text-primary" />
                                    Logout
                                </button>
                            </div>
                        </li>
                        {/* <li className="nav-item nav-settings d-none d-lg-flex">
                            <a className="nav-link" href="#">
                                <i className="icon-ellipsis" />
                            </a>
                        </li> */}
                    </ul>
                    <button
                      onClick={() => {setMobileMenu(!mobileMenu)}}
                        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                        type="button"
                        data-toggle="offcanvas"
                    >
                        <span className="icon-menu" />
                    </button>
                </div>
            </nav>
            

        </>

    )
}

export default Navbar
