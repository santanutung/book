import React, { useRef, useState, useEffect } from 'react'

import axios from 'axios'
import { useDispatch } from 'react-redux'
import axiosBaseUrl from '../axiosBaseUrl'
import { LOGIN, LOGOUT } from '../Redux/userSlice'
import validate from '../Validation/LoginValidation'
import { Redirect, useHistory } from 'react-router'
import io from 'socket.io-client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {DateRangePickerComponent} from "@syncfusion/ej2-react-calendars"

let socket;

function Login() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});


    


    function handle(e) {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
        // console.log(e.target.value)
    }


    const toastHandleer = (e) => {

        e.preventDefault()

        toast.error('Enter a valid email id', {position: toast.POSITION.TOP_RIGHT})
        toast.success(`Logged in successfully`, {position: toast.POSITION.TOP_RIGHT})

    }


    const signInHandler = (e) => {

        e.preventDefault()
        var error_data = validate(data);
        setErrors(error_data);
        // console.log(Object.keys(error_data).length)
        if (Object.keys(error_data).length == 0) {
        


            axiosBaseUrl.post('auth/login', { email: data.email, password: data.password })
                .then((res) => {
                    // alert("estt")
                    console.log(res)
                    if (res.status == 200) {
                        console.log("IN 200: ", res.data.accessToken)
                        dispatch(LOGIN({ token: res.data.accessToken }))
                        localStorage.setItem('activeEmp', res.data.accessToken );

                        // history.replace('/dashboard')
                        // return <Redirect to='/dashboard' />
                    }
                   

                }).catch(error => {
                    console.log(error.response)
                    // alert(error.response.status)
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = { ...errors }
                            if (error.response.data.errors) {

                                error.response.data.errors.map((value, index) => {
                                    console.log(error.response.data.errors)

                                    errorData[value.param] = value.msg

                                })
                            }
                            else {
                                errorData['password'] = error.response.data.error
                            }
                            setErrors(errorData)
                        }
                        else if (error.response.status == 423) {
                            setErrors({'password' : error.response.data.error})
                           
                        }
                        // setErrors({'password' : error.response.data.error});
                        // console.log("error 1", error.response.data.error);
                        // console.log("error 2", error.response.status);
                        // console.log("error 3", error.response.headers);
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






    }


    return (

        <>
            <div>
            <ToastContainer />



                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth px-0 login-page">
                        <div className="row w-100 mx-0">
                            <div className="col-lg-4 mx-auto">
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div className="text-center">
                                     
                                        <img src="assets/images/logo.png" alt="logo" width="200" />
                                    </div>
                                    {/* <h4>Hello! let's get started</h4> */}
                                    <h6 className="fw-light">Sign in to continue.</h6>
                                    <form className="pt-3">
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                id="email"
                                                onChange={(e) => handle(e)}
                                                value={data.email}
                                                className="form-control form-control-lg"
                                                placeholder="Username"
                                            />
                                             <span className="form-errors">{errors.email}</span>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                id="password"
                                                onChange={(e) => handle(e)}
                                                value={data.password}
                                                className="form-control form-control-lg"
                                                placeholder="Password"
                                            />
                                             <span className="form-errors">{errors.password}</span>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                               onClick={(e) => signInHandler(e)}
                                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                            >
                                                SIGN IN
                                            </button>
                                        </div>
                                     
                                        {/* <div className="mt-3">
                                            <button
                                               onClick={(e) => toastHandleer(e)}
                                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                            >
                                                Show toast
                                            </button>
                                        </div>
                                     

                                     <div className="mt-4">
                                         <DateRangePickerComponent 
                                            placeholder="Please enter the appointment range"
                                            max= {new Date()}
                                            format = "dd-MMM-yy"
                                         />
                                     </div>
                                       */}
 
                                      
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* content-wrapper ends */}
                </div>
                {/* page-body-wrapper ends */}
            </div>
            {/* container-scroller */}
        </>


    )
}

export default Login
