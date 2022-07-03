import './App.css';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Center from './components/Center'
import AppointmentSlot from './components/Center/AppointmentSlot'
import BookAppointment from './components/Center/BookAppointment'
import Centers from './components/Center/Centers'
import Home from './components/Home/index'
import Login from './components/Login'
import PastAppointment from './components/Patient/PastAppointment'
import PersonalDetail from './components/Patient/PersonalDetail'
// import Profile from './components/Patient/Profile'
import Register from './components/Register'
import { LOGIN, selectUserToken } from './Redux/userSlice'

import OnlinePaymentScreen from './ReusableComponents/OnlinePaymentScreen'
import TestRazorPay from './ReusableComponents/TestRazorPay'
import NotFound from './components/Exception/NotFound'
import { socket, SocketContext } from './context/sokcet'
import AboutUsPage from './components/Home/AboutUsPage'
import PrivacyPolicy from './components/Home/PrivacyPolicy'
import TermCondition from './components/Home/TermCondition'
import UploadDocument from './components/Center/UploadDocument'
import Test1 from './components/Center/Test1';
import Blog from './components/Blog';
import BlogDescription from './components/Blog/BlogDescription';
import Profile from './components/Profile/Index';
import Add from './components/Profile/Family/Add';
import EditProfile from './components/Profile/EditProfile';
import Edit from './components/Profile/Family/Edit';
import Notification from './components/Patient/Notification';

function App() {


    const userToken = useSelector(selectUserToken)
    const dispatch = useDispatch()


    useEffect(() => {
        const activeUser = localStorage.getItem('activeUser');
     

        if (activeUser) {
            dispatch(LOGIN({ userToken: activeUser }))
        }

    }, [])


    return (
        <SocketContext.Provider value={socket}>
        <div className='App'>
            <Router basename="/patient/">


                {/* {
                    userToken == null ?
                        <Switch>

                            <Route path="/login">
                                <Login />
                            </Route>


                            <Route path="/">
                                <Login />
                            </Route>



                        </Switch>

                        : */}
                <Switch>

                <Route exact path="/about-us">
                        <AboutUsPage />
                    </Route>

                    <Route exact path="/term-&-user">
                        <TermCondition />
                    </Route>
                    <Route exact path="/test1">
                        <Test1 />
                    </Route>



                    <Route exact path="/privacy-policy">
                        <PrivacyPolicy />
                    </Route>

                    <Route exact path="/upload-document">
                        <UploadDocument />
                    </Route>

                    <Route exact path="/personal_detail">
                        <PersonalDetail />
                    </Route>
                    <Route exact path="/appointments">
                        <PastAppointment />
                    </Route>

                    <Route exact path="/appointment/book">
                        <BookAppointment />
                    </Route>

                    <Route exact path="/appointment/:id">
                        <AppointmentSlot />
                    </Route>

                    <Route exact path="/register">
                        <Register />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/blogs">
                        <Blog />
                    </Route>

                    <Route exact path="/blog/:blogId">
                        <BlogDescription />
                    </Route>



                    <Route exact path="/payment">
                        <OnlinePaymentScreen />
                    </Route>

                    <Route exact path="/AddFamily">
                        {<Add />}
                    </Route>

                    <Route exact path="/EditFamily">
                        {<Edit />}
                    </Route>


                    <Route exact path="/editProfile">
                        {<EditProfile />}
                    </Route>

                    <Route exact path="/Profile/:pathParam?">
                        {userToken == null ? <Home /> : <Profile />}
                    </Route>
                    {/* <Route exact path="/Profile">
                        {userToken == null ? <Home /> : <Profile />}
                    </Route> */}
                    {/* <Route path="/">
                        <Home />
                    </Route> */}

                    {/* <Route path="/login">
                        <Login />
                    </Route> */}
                    {/* <Route path="/">
                        <PastAppointment />
                    </Route> */}


                    <Route exact path="/centre/:id">
                        <Center />
                    </Route>
                    <Route exact path="/centres">
                        <Centers />
                    </Route>

                    {/* <Route path="/centers">
                        {userToken == null ? <Login /> : <Centers />}
                    </Route> */}


                    <Route exact path="/razorpay">
                        <TestRazorPay />
                    </Route>


                    <Route exact path="/notification">
                        <Notification />
                    </Route>


                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route component={NotFound} />

                </Switch>


                {/* } */}
            </Router>
        </div>
        </SocketContext.Provider>
    )
}

export default App
