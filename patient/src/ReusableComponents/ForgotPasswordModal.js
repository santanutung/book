import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';
import useGlobalContexts from '../context/GlobalContext'
import { Modal } from 'react-bootstrap'
function ForgotPasswordModal() {

    const { forgotPasswordState,  setForgotPasswordState, setLoaderState, setLoginState } = useGlobalContexts()
    const [errors, setErrors] = useState({});
    const [data, setLoginData] = useState({
        phone: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const [otpForm, setOtpForm] = useState(false)
    function handleInput(e) {
        const newData = { ...data }



        // newData[e.target.id] = e.target.value
        if (e.target.name === 'phone') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.name] = e.target.value

                setLoginData(newData)

            }
        }
        else {
            newData[e.target.name] = e.target.value

            setLoginData(newData)

        }

        console.log(data)
    }



    const signInHandler = (e) => {

        e.preventDefault()


        setErrors({})
        setLoaderState(true)
        axiosBaseUrl.post('auth/forgot-password/send-otp', { phone: data.phone })
            .then((res) => {
                // alert("estt")
                setLoaderState(false)
                setOtpForm(true)
                console.log(res)



            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 422) {

                        // console.log(error.response.data.errors)
                        const errorData = {}
                        if (error.response.data.errors) {

                            error.response.data.errors.map((value, index) => {
                                console.log(value)

                                errorData[value.param] = value.msg

                            })
                        }
                        else {
                            errorData['password'] = error.response.data.error
                        }
                        setErrors(errorData)
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
                setLoaderState(false)

            })

    }


    function verifyOtpHandler(e) {
        e.preventDefault()

        console.log(data, "------------------------")
        setErrors({})
        setLoaderState(true)
        axiosBaseUrl.post('auth/forgot-password/verify-otp', data)
            .then((res) => {
                // alert("estt")
                setLoaderState(false)
                setForgotPasswordState(false)
                console.log(res.data)
                Swal.fire("", "Password is successfully updated", "success")
              



            }).catch(error => {
                console.log(error.response)
                if (error.response) {
                    if (error.response.status === 422) {

                        // console.log(error.response.data.errors)
                        const errorData = { ...errors }
                        if (error.response.data.errors) {

                            error.response.data.errors.map((value, index) => {
                                console.log(value)

                                errorData[value.param] = value.msg

                            })
                        }
                        else {
                            // errorData['password'] = error.response.data.error
                        }
                        setErrors(errorData)
                        // setErrors({})
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
                setLoaderState(false)

            })

    }

    return (
        <>

<Modal show={forgotPasswordState} onHide={() => setForgotPasswordState(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        !otpForm ?
                        <>

<div className="row">
                            <h5 className="modal-title" id="exampleModalLabel">
                            Please Enter Registered Phone No.
                            </h5>

                        </div>
                         <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    className="form-control"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Phone No.*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.phone} />
                                                <span className='text-danger'>{errors.phone}</span>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <Link to="/register" className='register-btn'>Do you have account? Sign up</Link>
                                        </div>
                                    </div>
                                    </> :
                                    <>
                                    <div className="row">
                                        <h5 className="modal-title" id="exampleModalLabel">
                                            Verify OTP & Update Password
                                        </h5>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    className="form-control"
                                                    name="otp"
                                                    id="otp"
                                                    placeholder="OTP*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.otp} />
                                                <span className='text-danger'>{errors.otp}</span>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    className="form-control"
                                                    name="password"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.password} />
                                                <span className='text-danger'>{errors.password}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="confirmPassword"
                                                    placeholder="Confirm Passowrd*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.confirmPassword} />
                                                <span className='text-danger'>{errors.confirmPassword}</span>
                                            </div>
                                        </div>

                                    </div>


                                    {/* <div className="col-md-12">
                                        
                                        <div className="form-group log-f text-center">
                                            <a onClick={(e) => signInHandler(e)}>Resend OTP</a>
                                        </div>
                                    </div> */}
                                    
                                    </>

                    }

                </Modal.Body>
                <Modal.Footer>
                {
                        !otpForm ? 
                        <>
                        <button
                        onClick={(e) => {setLoginState(true); setForgotPasswordState(false)}}
                        type="button" className="btn btn-secondary">
                        Back
                    </button>
                    <button
                        onClick={(e) => {signInHandler(e)}}
                        type="button" className="btn btn-primary">
                        Send OTP
                    </button>
                        </>
                      
                    :
                    <>
                     <button
                       onClick={(e) => signInHandler(e)}
                        type="button" className="btn btn-secondary">
                        Resend OTP
                    </button>
                    <button
                    onClick={(e) => verifyOtpHandler(e)}
                    type="button" className="btn btn-primary">
                    Verify Otp
                </button>
                    </>
}


                </Modal.Footer>
                </Modal>
            {/* {
                !otpForm ?
                    <div
                        className="modal fade show"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog login-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setForgotPasswordState(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <h5 className="modal-title" id="exampleModalLabel">
                                            Help us to serve you better!
                                        </h5>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    className="form-control"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Phone No.*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.phone} />
                                                <span className='text-danger'>{errors.phone}</span>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="col-md-12">
                                        <div className="form-group log-f text-center">
                                            <Link to="/register">Do you have account? Sign up</Link>
                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer text-center">

                                    <button
                                        onClick={(e) => signInHandler(e)}
                                        type="button" className="btn btn-primary">
                                        Send OTP
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div
                        className="modal fade show"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog login-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setForgotPasswordState(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <h5 className="modal-title" id="exampleModalLabel">
                                            Verify OTP & Update Password
                                        </h5>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    className="form-control"
                                                    name="otp"
                                                    id="otp"
                                                    placeholder="OTP*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.otp} />
                                                <span className='text-danger'>{errors.otp}</span>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    className="form-control"
                                                    name="password"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.password} />
                                                <span className='text-danger'>{errors.password}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="confirmPassword"
                                                    placeholder="Confirm Passowrd*"
                                                    required=""
                                                    onChange={(e) => handleInput(e)}
                                                    value={data.confirmPassword} />
                                                <span className='text-danger'>{errors.confirmPassword}</span>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="col-md-12">
                                        <div className="form-group log-f text-center">
                                            <a onClick={(e) => signInHandler(e)}>Resend OTP</a>
                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer text-center">

                                    <button
                                        onClick={(e) => verifyOtpHandler(e)}
                                        type="button" className="btn btn-primary">
                                        Verify Otp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

            } */}

        </>

    )
}

export default ForgotPasswordModal
