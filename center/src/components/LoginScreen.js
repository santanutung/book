import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl';
import { env } from '../env';
import { LOGIN } from '../Redux/userSlice';
import LoginValidation from './validation/LoginValidation';
// import "../../public/assets/css/bookcare.css"
import jwt_decode from "jwt-decode";


import {DateRangePickerComponent} from "@syncfusion/ej2-react-calendars"
import useGlobalContexts from '../context/GlobalState';
import Loader from '../custom/Loader';

function LoginScreen() {

    const dispatch = useDispatch()


    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const {loaderState, setLoaderState } = useGlobalContexts()

    const [errors, setErrors] = useState({});



    function handle(e) {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
        // console.log(e.target.value)
    }




    function handle(e) {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
        // console.log(e.target.value)
    }




    const signInHandler = (e) => {

        e.preventDefault()

        // alert("HEY")
        var error_data = LoginValidation(data);

        setErrors(error_data);


        console.log(Object.keys(error_data))

        if (Object.keys(error_data).length == 0) {

            setLoaderState(true)
            axios.post(env.baseUrl + 'auth/center/login', { email: data.email, password: data.password })
                .then((res) => {
                    // alert("estt")
                    console.log('success ', res)
                    if (res.status == 200) {
                        console.log("IN 200: ", res.data.accessToken)
                        dispatch(LOGIN({ userToken: res.data.accessToken }))
                        localStorage.setItem('activeCenter', res.data.accessToken);
                        setLoaderState(false)
                        // var decoded = jwt_decode(res.data.accessToken);

                        // console.log(decoded, "decorder");

                        // history.replace('/dashboard')
                        // return <Redirect to='/dashboard' />
                    }



                }).catch(error => {

                    console.log('err ', error.response)
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = {}
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
                            setLoaderState(false)
                        }
                        else if (error.response.status == 423) {
                            // console.log('err ', error.response.)
                            setErrors({ 'password': error.response.data.error })
                            setLoaderState(false)
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
         {loaderState ? <Loader /> : ''}
    
        <div className='login-page'>
            <div className="row justify-content-center">

                <div className="col-md-4 offset-md-4">
                    <div className='text-center'>
                        <img src='centerassets/images/logo.png' />
                    </div>
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">

                                <div className="col-lg-12">
                                    
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                        </div>
                                        <form className="user" onSubmit={signInHandler}>
                                            <div className="form-group">
                                                <input
                                                    // type="email"
                                                    className="form-control form-control-user"
                                                    id="email"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Enter Email Address..."
                                                    onChange={(e) => handle(e)}
                                                    value={data.email}


                                                />
                                                <span className="form-errors">{errors.email}</span>

                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="password"
                                                    className="form-control form-control-user"
                                                    id="password"
                                                    placeholder="Password"
                                                    onChange={(e) => handle(e)}
                                                    value={data.password}


                                                />
                                                <span className="form-errors">{errors.password}</span>

                                            </div>


                                            {/* <Link to="/dashboard"> */}
                                            <button
                                                className="btn btn-primary btn-user btn-block"
                                               type="submit"

                                            >
                                                Login
                                            </button>

                                            {/* </Link> */}

                                            {/* <div className="mt-4">
                                         <DateRangePickerComponent 
                                            placeholder="Please enter the appointment range"
                                            max= {new Date()}
                                            format = "dd-MMM-yy"
                                         />
                                     </div>*/}

                                            <hr /> 


                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>

    )
}

export default LoginScreen
