import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosBaseUrl from '../../axiosBaseUrl';
import { socket } from '../../context/socket';
import { LOGOUT } from '../../Redux/userSlice';
import 'react-toastify/dist/ReactToastify.css';
import useGlobalContexts from '../../context/GlobalContext';


toast.configure()

function Navbar() {
    const { sidebar, setSidebar } = useGlobalContexts()
    const dispatch = useDispatch()
    const [notifications, setNotifications] = useState([])
    const [unreadMessage, setUnreadMessage] = useState(0)
    const history = useHistory()
    const location = useLocation();
    const [chatMessages, setChatMessages] = useState([])

    const adminCenterChatLength = socket?._callbacks?.['$admin-center-chat']?.length || 0;
    const adminNotificationLength = socket?._callbacks?.['$admin-notifications']?.length || 0;


    const CustomToastWithLink = (message) => (

        <div>
            <div dangerouslySetInnerHTML={{ __html: message }}></div>
            {/* <Link to={type === 'enquiry' ? '/enquiry' : "/test"}>{message}</Link> */}
        </div>
    );


    const signoutHandler = () => {
        localStorage.clear();
        dispatch(LOGOUT())
    }

    useEffect(() => {
        // quickNotify("hello")
        getUnreadMessages()
        getNotifications()

        if (typeof (adminNotificationLength) !== 'undefined' && adminNotificationLength < 1) {

            socket.on('admin-notifications', (data) => {
    
                console.log(data, "notification----------------------")
                var url = data.module === 'enquiry' ? '/enquiry' : data.module === 'testimonial' ? '/manageTestimonials' : data.module === 'centerenquiry' ? "/center-enquiry" : ""
                toast(CustomToastWithLink(`<a href=${url}>${data.message}</a>`))
    
                getNotifications()
            });
        }

        if (typeof (adminCenterChatLength) !== 'undefined' && adminCenterChatLength < 1) {
            socket.on(`admin-center-chat`, (data) => {

                if (data.sender === 'center') {

                    getUnreadMessages()
                    if (location.pathname.includes('chats') === false) {
                        toast(CustomToastWithLink(`<a href=${"/chats/" + data.center_id}>${data.center_message}</a>`))
                    }
                }
            });
        }


    }, [])

    function getNotifications() {
        axiosBaseUrl.get(`admin/notifications`)
            .then((res) => {
                // console.log(res.data.unreadNotification)
                setNotifications(res.data.data)
                setUnreadMessage((res.data.unreadNotification).length)


            }).catch(error => {
                console.log(error)

            })
    }


    function getUnreadMessages() {
        axiosBaseUrl.get(`admin/chat-unread-message`)
            .then((res) => {

                setChatMessages(res.data.data.slice(0, 2))
                // setNotifications(res.data.data)
                // setUnreadMessage((res.data.unreadNotification).length)


            }).catch(error => {
                console.log(error)

            })
    }






    function markNotificationRead(notification) {

        //  alert("test")
        axiosBaseUrl.put(`admin/notification-read?id=${notification._id}`)
            .then((res) => {
                // getNotifications()

                history.replace(notification.module === 'enquiry' ? "/enquiry" : notification.module === 'testimonial' ? "/manageTestimonials" : '')

            }).catch(error => {
                console.log(error)

            })
    }


    function markMessageRead(chat) {
        console.log(chat)
        //  alert("test")
        axiosBaseUrl.put(`admin/chat-read/${chat.center_id._id}`)
            .then((res) => {
                // getNotifications()

                history.replace("/chats/" + chat.center_id._id)

            }).catch(error => {
                console.log(error)

            })
    }


    return (
        <>
            <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
                    <div className="me-3">
                        {/* <button
                            className="navbar-toggler navbar-toggler align-self-center"
                            type="button"
                            data-bs-toggle="minimize"
                        >
                            <span className="icon-menu" />
                        </button> */}
                    </div>
                    <div>
                        <a className="navbar-brand brand-logo" href="index.html">
                            {/* Bookcare */}
                            <img src="assets/images/logo.png" alt="logo" />
                        </a>
                        <a className="navbar-brand brand-logo-mini" href="index.html">
                            {/* Bookcare */}
                            <img src="assets/images/logo.png" alt="logo" />
                        </a>
                    </div>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-top">
                    <ul className="navbar-nav">
                        <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
                            <h1 className="welcome-text">
                                {/* Welcome */}
                                {/* , <span className="text-black fw-bold">John Doe</span> */}
                            </h1>

                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">




                        <li className="nav-item dropdown">
                            <a
                                className="nav-link count-indicator"
                                id="notificationDropdown"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fas fa-comments icon-lg" />
                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                                aria-labelledby="notificationDropdown"
                            >
                                <a className="dropdown-item py-3 border-bottom">
                                    <p className="mb-0 font-weight-medium float-left">
                                        You have {chatMessages.length} new Messages{" "}
                                    </p>
                                    {/* <span className="badge badge-pill badge-primary float-right">
                                    View all
                                </span> */}
                                </a>
                                {
                                    chatMessages.map((chat, index) => {
                                        return (
                                            <a className="dropdown-item preview-item py-3" onClick={() => markMessageRead(chat)}>
                                                <div className="preview-thumbnail">
                                                    <i className="mdi mdi-alert m-auto text-primary" />
                                                </div>
                                                <div className="preview-item-content">
                                                    <h6 className="preview-subject fw-normal text-dark mb-1">
                                                        {chat.message.slice(0, 20)}{chat.message.length > 20 ? "..." : ''}
                                                    </h6>
                                                    {/* <p className="fw-light small-text mb-0"> Just now </p> */}
                                                    <p className="fw-light small-text mb-0"> {chat.center_id.name} </p>
                                                </div>
                                            </a>
                                        )
                                    })
                                }



                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link count-indicator"
                                id="countDropdown"
                                href="#"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="icon-bell" />
                                <span className="count" />
                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                                aria-labelledby="countDropdown"
                            >
                                <Link className="dropdown-item py-3" to="/notifications">
                                    <p className="mb-0 font-weight-medium float-left">
                                        You have {unreadMessage} unread notifications{" "}
                                    </p>
                                    <span className="badge badge-pill badge-primary float-right">
                                        View all
                                    </span>
                                </Link>

                                <div className="dropdown-divider" />
                                {
                                    notifications.slice(0, 5).map((notification, index) => {
                                        return (
                                            <a className="dropdown-item preview-item" onClick={() => markNotificationRead(notification)} key={notification._id + "key"} to={notification.module === 'enquiry' ? "/enquiry" : notification.module === 'testimonial' ? "/manageTestimonials" : notification.module === 'centerenquiry' ? "/center-enquiry" : ""}>
                                                {/* <div className="preview-thumbnail">
                                                <img
                                                    src="assets/images/faces/face10.jpg"
                                                    alt="image"
                                                    className="img-sm profile-pic"
                                                />
                                            </div> */}
                                                <div className="preview-item-content flex-grow py-2">
                                                    <p className="preview-subject ellipsis font-weight-medium text-dark">
                                                        {notification.isRead ? <i class="fas fa-check"></i> : <i class="fas fa-times text-danger"></i>} {notification.message.slice(0, 20)}{notification.message.length > 20 ? "..." : ''}
                                                    </p>
                                                    <p className="fw-light small-text mb-0">
                                                        {notification.date}
                                                    </p>
                                                </div>
                                            </a>
                                        )
                                    })
                                }



                            </div>
                        </li>
                        <li className="nav-item dropdown d-none d-lg-block user-dropdown">
                            <a
                                className="nav-link"
                                id="UserDropdown"
                                href="#"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    className="img-xs rounded-circle"
                                    src="assets/images/faces/user-icon.png"
                                    alt="Profile image"
                                />{" "}
                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right navbar-dropdown"
                                aria-labelledby="UserDropdown"
                            >
                                {/* <div className="dropdown-header text-center">
                                <img
                                    className="img-md rounded-circle"
                                    src="assets/images/faces/user-icon.png"
                                    alt="Profile image"
                                />
                                <p className="mb-1 mt-3 font-weight-semibold">Allen Moreno</p>
                                <p className="fw-light text-muted mb-0">allenmoreno@gmail.com</p>
                            </div>
                            <a className="dropdown-item">
                                <i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2" />{" "}
                                My Profile <span className="badge badge-pill badge-danger">1</span>
                            </a>
                            <a className="dropdown-item">
                                <i className="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2" />{" "}
                                Messages
                            </a>
                            <a className="dropdown-item">
                                <i className="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2" />{" "}
                                Activity
                            </a>
                            <a className="dropdown-item">
                                <i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2" />{" "}
                                FAQ
                            </a> */}
                                <button
                                    onClick={signoutHandler}
                                    className="dropdown-item">
                                    <i className="dropdown-item-icon mdi mdi-power text-primary me-2" />
                                    Sign Out
                                </button>
                            </div>
                        </li>
                    </ul>
                    <button
                        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                        type="button"
                        data-bs-toggle="offcanvas"
                        onClick={() => setSidebar(!sidebar)}
                    >
                        <span className="mdi mdi-menu" />
                    </button>
                </div>
            </nav>
            {/* {
            currentMessage.message ? 
            <div className="alert alert-danger">
               
                 <a className='cursor' onClick={() => setCurrentMessage({})}><i className="far fa-times-circle text-black"></i></a>
                 <a href={currentMessage.module == 'enquiry' ? '/enquiry' : ''}>
            {currentMessage.module}! {currentMessage.message}
            </a>
        </div>
        :
        ''
        } */}

            {/* <div className="alert alert-danger">
        <a className='cursor' onClick={() => setCurrentMessage({})}><i className="far fa-times-circle text-black"></i></a>
                Warning! We're currently carrying out maintenance, some features may not work
                correctly.
               
            </div> */}
            {/* <div className='toast' style={{ position: 'fixed', zIndex: 999, display: 'block', opacity: '100' }}>
                <ToastContainer />
            </div> */}

        </>

    )
}

export default Navbar
