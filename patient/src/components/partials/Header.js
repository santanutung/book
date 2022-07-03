import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import useGlobalContexts from '../../context/GlobalContext'
import { socket } from '../../context/sokcet'
import { LOGOUT, selectUserId, selectUserToken } from '../../Redux/userSlice'
import ForgotPasswordModal from '../../ReusableComponents/ForgotPasswordModal'
import LoginModal from '../../ReusableComponents/LoginModal'
import jwt_decode from "jwt-decode";
import axiosBaseUrl from '../../axiosBaseUrl'
import { toast, ToastContainer } from 'react-toastify'
import IdleTimer, { useIdleTimer } from 'react-idle-timer'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone'
function Header() {

  const {
    loginState,
    setLoginState,
    forgotPasswordState,
    setremoveNotification,
    removeNotification,
  } = useGlobalContexts();
  let history = useHistory();
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation();
  // const userId = useSelector(selectUserId)
  const [currentMessage, setCurrentMessage] = useState({})
  const [currentUrl, setCurrentUrl] = useState();

  const [mobileMenu, setMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notify, setNotify] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { userName, setUserName, setHomeIndex } = useGlobalContexts()
 

  const [colorchange, setColorchange] = useState(false)
  // const [userId, setUserId] = useState('')

  // const [lastActivity, setLastActivity] = useState('')

  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);



  function updateSize() {

    setSize([window.innerWidth, window.innerHeight]);
  }

  toast.configure()
  useEffect(() => {
    updateSize()
    setCurrentUrl(location.pathname)
    if (localStorage.getItem("activeUser")) {
      getNotifications()
      var decoded = jwt_decode(localStorage.getItem("activeUser"));

      var userId = decoded.userId
    

      socket.on(userId + 'user-notifications', (data) => {
        // alert("notification")
        toast(`${data.message}`)
        // quickNotify(data.message)
        setCurrentMessage(data)
        getNotifications()
     
      });
    }





  }, [])

 
  const logoutHandler = () => {
    // e.preventDefault()

    dispatch(LOGOUT())

    localStorage.removeItem('activeUser');
    Swal.fire("", "Logged Out Successfully", "success")
    history.push("/");



  }

  function getNotifications() {
    axiosBaseUrl.get(`patients/api/notifications?page=1&limit=5`)
      .then((res) => {
        setNotifications(res.data.data.docs)


      }).catch(error => {
        console.log(error)

      })
  }



  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    }
    else {
      setColorchange(false);
    }
  };
  window.addEventListener('scroll', changeNavbarColor);




  const handleOnIdle = event => {
    // console.log('user is idle', event)
    // setLastActivity(moment(getLastActiveTime()).format('YYYYMMDDHHmmss'))
    // console.log('last active state', lastActivity)
    // console.log('last active', moment(getLastActiveTime()).format('YYYYMMDDHHmmss'))

    if(localStorage.getItem('activeUser')) {
    const interval = setInterval(() => {
      // console.log(parseInt(moment().format('YYYYMMDDHHmmss')) - parseInt(moment(getLastActiveTime()).format('YYYYMMDDHHmmss')), 'This will run every second!')
      
      if (parseInt(moment().format('YYYYMMDDHHmmss')) - parseInt(moment(getLastActiveTime()).format('YYYYMMDDHHmmss')) > 6000) {
        if(localStorage.getItem('activeUser')) {
        logoutHandler()
        }
      }
    }, 10000);
  }




  }

  const handleOnActive = event => {
    // console.log('user is active', event)
    // console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = event => {
    // console.log('user did something', event)
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 50,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })



  return (
    <>
      {/* ======= Header ======= */}
      <header id="header" className="fixed-top align-items-center">
        <div className="container d-flex align-items-center justify-content-between">
          <div className='relative'>
            <div className="logo">
              <Link to="/"><img src="img/logo.jpg" className="logo-img" width="100%" /></Link>
              {/* Uncomment below if you prefer to use an image logo */}

            </div>
            <div className="select-l">
              {/* <span className='mdb-select md-form'> New Delhi</span> */}
              <select className="mdb-select md-form">
                <option value disabled selected>
                  uttar pradesh
                </option>
                <option value={1}>Option 1</option>
                <option value={2}>Option 2</option>
                <option value={3}>Option 3</option>
              </select>
            </div>
          </div>
          <nav id="navbar" className="navbar">
            {
              size[0] > 991 ?
                <ul>
                  <li>
                    <Link className="nav-link scrollto" to="/about-us">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link scrollto" to="/centres">
                      Centres
                    </Link>
                  </li>
                  <li>
                    <a className="nav-link scrollto" onClick={() => window.scroll(0, document.getElementById("contact").offsetTop - 50)}>
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <Link className="nav-link scrollto" to="/blogs">
                      Blogs 
                    </Link>
                  </li>

                  {localStorage.getItem('activeUser') != undefined
                    ?
                    <>


                      <li>
                        <div onClick={logoutHandler} className="getstarted scrollto" to="/login">Logout</div>
                      </li>
                      <li>
                        <ul className="notification-drop">
                          <li className="item">
                            <i className="fas fa-bell notification-bell" aria-hidden="true" onClick={() => { 
                              setNotify(!notify); 
                               setremoveNotification(true); }} />{" "}
                            {
                              currentMessage.message ? <span className="btn__badge pulse-button ">4</span> : ''
                            }

                            <ul className={notify &&  removeNotification  ? "card-body card notification-list h-100p" : "card-body card notification-list h-0"} >
                              <h4 className="noti__css">Notification</h4>
                              {
                                notifications.slice(0, 5).map((notification, index) => {
                                  return (
                                    <>
                                      <li className="enwwu">
                                        <Link key={index + "head-notify"} to={`/Profile/${notification.module}`}>
                                          <span>{notification.message.slice(0, 40)}{notification.message.length > 40 ? "..." : ""}</span><br />
                                          <span className='notifictaion-time'>{notification.date}</span>
                                        </Link>
                                      </li>


                                    </>
                                  )
                                })

                              }


                              <li className='text-center'>
                                {" "}
                                <Link to="/Profile?tab=notification" className='load-more-btn mt-2 mb-3'>Load More</Link>{" "}
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>


                      {/* <li>
                        <Link className="getstarted scrollto profile-icon" to="/Profile">{userName?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</Link>
                      </li> */}

                      <li>
                      <Link to="/Profile">
                        <p className='profile-icon-header'>{userName?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</p>
                        </Link>
                        {/* <Link className="getstarted scrollto profile-icon" to="/Profile">{userName?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</Link> */}
                      </li>



                    </>
                    :
                    <><li>
                      <a className="getstarted scrollto" onClick={() => setLoginState(true)}>Login</a>

                    </li>


                    </>
                  }

                </ul>
                : ''
            }


            {localStorage.getItem('activeUser') != undefined
              ?

              <li
                className="nav-link count-indicator pointer  mobile-nav-toggle"
                id="notificationDropdown"
                data-toggle="dropdown"

              >
                <a className='bell-icon'>
                  <i className="fas fa-bell" onClick={() => { setNotify(!notify) }}></i>
                  {
                    currentMessage.message ? <span className="count"></span> : ''
                  }

                </a>

                {
                  size[0] <= 991 ?
                    <ul className={(notify  )? "card-body card notification-list h-100p" : "card-body card notification-list h-0"} >
                      <h4 className="noti__css">Notification</h4>
                      {
                        notifications.slice(0, 5).map((notification, index) => {
                          return (
                            <>
                              <li className="enwwu">
                                <Link key={index + "head-notify"} to={`/Profile/${notification.module}`}>
                                  <p>{notification.message.slice(0, 40)}{notification.message.length > 40 ? "..." : ""}</p>
                                  <p className='notifictaion-time'>{notification.date}</p>
                                </Link>
                              </li>


                            </>
                          )
                        })

                      }


                      <li className='text-center'>
                        {" "}
                        <Link to="/Profile?tab=notification" className='load-more-btn mt-2 mb-3'>Load More</Link>{" "}
                      </li>
                    </ul>

                    : ''
                }


              </li> : ''
            }
            <i className="bi bi-list mobile-nav-toggle" onClick={() => setMobileMenu(!mobileMenu)} />

            {/* <li
                    className="nav-link count-indicator pointer  mobile-nav-toggle"
                    id="notificationDropdown"
                    data-toggle="dropdown"
                    onClick={() => { setNotify(!notify) }}
                  >
                    <Link to="/Profile?tab=notification">
                      <i className="fas fa-bell"></i>
                      {
                        currentMessage.message ? <span className="count"></span> : ''
                      }

                    </Link>

                  </li> */}
          </nav>


          <ul className={mobileMenu ? 'mobile-menu w-50' : 'mobile-menu '}>
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/centres">
                Centres
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/blogs">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => window.scroll(0, document.getElementById("contact").offsetTop - 50)}>
                Contact Us
              </a>
            </li>

            {localStorage.getItem('activeUser') != undefined
              ?
              <>

                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">My Profile</Link>
                </li>
                <li className="nav-item">
                  <a onClick={logoutHandler} className="nav-link" to="/login">Logout</a>
                </li>
              </>
              :
              <><li className="nav-item">
                <a className="nav-link" onClick={() => { setLoginState(true); setMobileMenu(false) }}>Login</a>

              </li>
                {
                  currentUrl != '/register' ? <li className="nav-item">
                    <Link className="nav-link" to="/register">Signup</Link>
                  </li> : ''
                }

              </>
            }
          </ul>

          {/* .navbar */}

        </div>

        {
          location.pathname.includes('centre/') || location.pathname.includes('/editProfile') || location.pathname.includes('editFamily') || location.pathname.includes('AddFamily') ?
            <div className='back-header '   onClick={() => setremoveNotification(false)}>
              <div className='container'>
                <div className='row'>
                 
                  <div className='col-1'>
                    <Link 
                    
                    to= {
                      location.pathname.includes('centre/') ? "/centres" : location.pathname.includes('/editProfile') ? "/profile" : location.pathname.includes('/editFamily') ? "/profile" : location.pathname.includes('/AddFamily') ? "/profile" : ''
                    }
                    ><i class="fa fa-chevron-left"></i></Link>
                  </div>
                  <div className='col-11'>
                    <p className='text-left'>
                    {
                      location.pathname.includes('centre/') ? "Centre Details" : location.pathname.includes('/editProfile') ? "Edit Profile" :  location.pathname.includes('/editFamily') ? "Edit Family" : location.pathname.includes('/AddFamily') ? "Add Family" : ''
                    }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            : ''
        }




      </header>


      {/* End Header */}



      {loginState ? <LoginModal showModal={loginState} setShowModal={setLoginState} /> : ''
      }

      {forgotPasswordState ? <ForgotPasswordModal /> : ''
      }



    </>
  )
}

export default Header


