import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosBaseUrl from '../axiosBaseUrl'
import { LOGIN, selectUserName, selectUserToken } from '../Redux/userSlice'
import Layout from './Layout'

function Login() {

    const userToken = useSelector(selectUserToken)
   

    const dispatch = useDispatch()

    useEffect(() => {





    }, [])


    const signInHandler = (e) => {
        e.preventDefault()

        dispatch(LOGIN({ userToken: "USERTOKEN ADDED" }))

        localStorage.setItem('activeUser', "USERTOKEN" );

   
    }


    return (
        <Layout>


            <section className="login-l">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">

                            <form className="php-email-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <h3 className="text-center">Login</h3>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input type="text" name="name" className="form-control" id="name" placeholder="Full Name*" required="" />
                                        </div>
                                    </div> */}
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input type="email" className="form-control" name="email" id="email" placeholder="Email address*" required="" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input type="password" className="form-control" name="password" id="password" placeholder="Password*" required="" />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input type="text" placeholder="MM | DD | YYY" className="form-control" name="date" id="date" required="" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input type="text" className="form-control" name="subject" id="subject" placeholder="Insurance No.(optional)*" required="" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="gender-k">
                                            <button className="btn btn-g">Male</button>
                                        </div>
                                    </div> */}

                                    {/* <div className="col-md-6">
                                        <div className="gender-g">
                                            <button className="btn btn-g">Female</button>
                                        </div>
                                    </div> */}

                                </div><br /><br />

                                <div className="row">
                                    {/* <div className="col-md-6">
                                        <div className="button-k">
                                            <a href="#" className="btn-cancel">Cancel</a>
                                        </div>
                                    </div> */}

                                    <div className="col-md-6 offset-md-3 mt-5">
                                        <div className="button-s text-center">
                                            <a  onClick={signInHandler} style={{cursor: "pointer"}} className="btn-save">Save & Proceed</a>
                                        </div>
                                    </div>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </section>



        </Layout>
    )
}

export default Login
