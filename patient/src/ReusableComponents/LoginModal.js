import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'
import { LOGIN, selectUserToken } from '../Redux/userSlice'
import LoginValidation from '../Validation/LoginValidation'
import jwt_decode from "jwt-decode";
import { useLocation } from 'react-router-dom'
import useGlobalContexts from '../context/GlobalContext'
import { Modal } from 'react-bootstrap'

function LoginModal(props) {
    const { showModal, setShowModal } = props
    
    let history = useHistory();
    const { setForgotPasswordState } = useGlobalContexts()
    const userToken = useSelector(selectUserToken)
    console.log("USERNAME>>>> ", userToken)
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState('unchecked');
    const location = useLocation();


    function handleLogin(e) {
        const newData = { ...loginData }
        // newData[e.target.id] = e.target.value
        if (e.target.id === 'email') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.id] = e.target.value

                setLoginData(newData)

            }
        }
        else {
            newData[e.target.id] = e.target.value

            setLoginData(newData)

        }

        console.log(loginData)
    }


    const dispatch = useDispatch()

    useEffect(() => {
        // alert(localStorage.getItem("rememberme"))
        if (localStorage.getItem("rememberme")) {
            
            setLoginData(JSON.parse(localStorage.getItem("rememberme")))
            setRememberMe('checked')
            // if (localStorage.getItem("token") != null) {
            //     let token = jwt_decode(localStorage.getItem("token"));
            //     console.log("Refresh the token", token);
            //     // if (token.exp < Date.now() / 1000) {
            //     //     console.log("Refresh the token");
            //     // }
            // }
        }

    }, []);



    const signInHandler = (e) => {
        e.preventDefault()
        var error_data = LoginValidation(loginData)
        setErrors(error_data);
        if (Object.keys(error_data).length === 0) {
            axiosBaseUrl.post('auth/user-login', { phone: loginData.email, password: loginData.password })
                .then((res) => {
                    // alert("estt")
                    console.log(res)
                    if (res.status === 200) {
                        // console.log("IN 200: ", res.data.accessToken)
                        dispatch(LOGIN({ token: res.data.accessToken }))
                        localStorage.setItem('activeUser', res.data.accessToken);
                       

                             var decoded = jwt_decode(res.data.accessToken);
                            console.log(decoded.name, "-------------------")
                            localStorage.setItem('du_name',decoded.name);

                        setShowModal(false)
                        if(rememberMe === 'checked') {

                            localStorage.setItem("rememberme", JSON.stringify({ email: loginData.email, password: loginData.password }))
                        }
                        else if(localStorage.getItem("rememberme")) {
                            localStorage.removeItem('rememberme');
                        }
                        Swal.fire("", "Logged In Successfully", "success")
                        if (location.pathname === '/register') {
                            history.push("/");
                        }
                        else {

                            window.location.reload(false);
                        }

                    }


                }).catch(error => {
                    console.log(error)
                    if (error.response) {
                        if (error.response.status === 422) {
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
                        }
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

    const onChangeRememberMe = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setRememberMe("checked")
            // alert("checked")
        } else {
            setRememberMe("unchecked")
            // alert("unchecked")
        }
    };
    return (

        <>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <form id="Login" onSubmit={signInHandler} >
                    <Modal.Body>

                        <div className="row">
                            <h5 className="modal-title" id="exampleModalLabel">
                            Please Login / Signup to book a slot!
                            </h5>

                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group log-f">
                                    <input

                                        className="form-control"
                                        name="email"
                                        id="email"
                                        placeholder="Phone No.*"
                                        required=""
                                        onChange={(e) => handleLogin(e)}
                                        value={loginData.email} />
                                    <span className='text-danger'>{errors.email}</span>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group log-f">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        id="password"
                                        placeholder="Password*"
                                        required=""
                                        onChange={(e) => handleLogin(e)}
                                        value={loginData.password} />
                                    <span className='text-danger'>{errors.password}{errors.error}</span>
                                </div>
                            </div>
                           
                                    <div className="col-6">
                                        <a className='text-danger remember-me' for="remember-me" > <input type="checkbox" id="remember-me" checked={rememberMe === 'checked' ? true : false} onChange={(e) => onChangeRememberMe(e)}/> Remember Me</a>
                                    </div>
                                    <div className="col-6 text-right">
                                            <a className='text-danger forgot-password' onClick={() => { setForgotPasswordState(true); setShowModal(false) }}>Forgot Password ? </a>
                                    </div>
                                </div>


                        <div className="col-md-12">
                            <div className="form-group log-f mt-2">
                                <Link to="/register" className='register-btn'>Do you have account? Sign up</Link>
                            </div>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </Modal.Footer>
                </form>


            </Modal>


        </>


    )
}

export default LoginModal
