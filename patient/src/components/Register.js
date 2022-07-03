import React, { useEffect, useLayoutEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'
import RegisterValidation, { RegisterOTPValidation } from '../Validation/RegisterValdation'
import Layout from './Layout'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import useGlobalContexts from '../context/GlobalContext'
import moment from 'moment-timezone'
import { Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { LOGIN } from '../Redux/userSlice'
function Register() {

    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        password: "",
        insurance_no: "",
        phone: "",
        profile: "",
        gender: "",
        image: "",
        tc: false,
        otp : ''
    });
    let history = useHistory();
    // const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});
    const [resendOTP, setResendOTP] = useState('');
    const { setLoaderState, setLoginState } = useGlobalContexts()
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch()


    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
       
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
    }

  
    useEffect(() => {
        updateSize()
        setLoginState(false)
    }, [])

    function handle(e) {
        // alert(e.target.value)
        const newData = { ...data }

        if (e.target.name == 'phone') {

            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.name] = e.target.value

                setData(newData)
            }
        }
        else if (e.target.name === 'tc') {
            const checked = e.target.checked;
            if (checked) {
                newData[e.target.name] = true

            }
            else {
                newData[e.target.name] = false

            }
            setData(newData)
        }
        else {
            newData[e.target.name] = e.target.value

            setData(newData)

        }

    }

    const signUpOTPHandler = (e, type) => {
        e.preventDefault()
        setResendOTP('')
        setLoaderState(true)
        setErrors({})
        var error_data = RegisterValidation(data);
        
        setErrors(error_data);
     
        if (Object.keys(error_data).length == 0) {



            axiosBaseUrl.post('patients/api/register-otp', data)
                .then((res) => {
                  
                    setErrors({})
                    if (res.status == 200) {
                        setLoaderState(false)
                        if(type === 'resend') {
                            setResendOTP("OTP is successfully send")
                        }
                        else {
                            
                            setShowModal(true)
                        }
                        // setLoaderState(false)
                        // dispatch(LOGIN({ token: res.data.accessToken }))
                        // localStorage.setItem('activeUser', res.data.accessToken);
                        // Swal.fire("", "Thank you for register with us", "success")
                        // history.push("/");


                    }


                }).catch(error => {
                  
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = {}
                            if (error.response.data.errors) {

                                error.response.data.errors.map((value, index) => {
                                   

                                    errorData[value.param] = value.msg

                                })
                            }
                            else {
                                errorData['gender'] = error.response.data.error
                            }
                            setErrors(errorData)
                        }

                    }
                    else if (error.request) {
                        // The request was made but no response was received
                    
                    } else {
                        // Something happened in setting up the request that triggered an Error
                    
                    }
                    setLoaderState(false)

                })

        }
        else {
            setLoaderState(false)
        }


    }

    const signUpHandler = (e) => {
        e.preventDefault()
        setResendOTP('')
        setLoaderState(true)
        setErrors({})
        var error_data = RegisterOTPValidation(data);
      
        setErrors(error_data);
      
        if (Object.keys(error_data).length == 0) {



            axiosBaseUrl.post('patients/api/register', data)
                .then((res) => {
                   
                    setErrors({})
                    if (res.status == 200) {
                        setLoaderState(false)
                        // setLoaderState(false)
                        dispatch(LOGIN({ token: res.data.accessToken }))
                        localStorage.setItem('activeUser', res.data.accessToken);
                        Swal.fire("", "Thank you for register with us", "success")
                        history.push("/");


                    }


                }).catch(error => {
                   
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = { ...errors }
                            if (error.response.data.errors) {

                                error.response.data.errors.map((value, index) => {
                                   

                                    errorData[value.param] = value.msg

                                })
                            }
                            else {
                                errorData['gender'] = error.response.data.error
                            }
                            setErrors(errorData)
                        }
                     
                    }
                    else if (error.request) {
                        // The request was made but no response was received
                     
                    } else {
                        // Something happened in setting up the request that triggered an Error
                     
                    }
                    setLoaderState(false)

                })

        }
        else {
            setLoaderState(false)
        }


    }

    return (
        <Layout>
            {/* <Loader /> */}
            {/* {loader ? <Loader /> : ''} */}

            <section className="login-l mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">

                            <form className="php-email-form register-card" onSubmit={signUpOTPHandler}>
                                <div className="row">
                                    {/* <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <div className="file-text">

                                                <input 
                                                type="file" 
                                                className="custom-file-upload" 
                                                id="myFile" required=""
                                                onChange={(e) => handleFile(e)}
                                                name="image"
                                                 />
                                                <p>Upload your image (Optional)</p>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id="name"
                                                placeholder="Full Name*"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.name} />
                                            <span className='text-danger'>{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                placeholder="Email address*"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.email}
                                            />
                                            <span className='text-danger'>{errors.email}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="phone"
                                                placeholder="Phone number*"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.phone}
                                            />
                                            <span className='text-danger'>{errors.phone}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="date"
                                                placeholder="MM | DD | YYY"
                                                className="form-control"
                                                name="dob"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.dob}
                                                max={moment().format('YYYY-MM-DD')}
                                            />
                                            <span className='text-danger'>{errors.dob}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="insurance_no"
                                                placeholder="Insurance No."
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.insurance_no} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="form-control"
                                                name="password"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.password} />
                                            <span className='text-danger'>{errors.password}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="confirm_password"
                                                placeholder="Confirm Passowrd*"
                                                required=""
                                                onChange={(e) => handle(e)}
                                                value={data.confirm_password} />
                                            <span className='text-danger'>{errors.confirm_password}</span>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <div className={data.gender == 'male' ? "gender-k" : 'gender-g'}>
                                            <button className="btn btn-g" type="button" value="male" name="gender" onClick={(e) => handle(e)}>Male</button>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <div className={data.gender == 'female' ? "gender-k" : 'gender-g'}>
                                            <button className="btn btn-g" type="button" value="female" name="gender" onClick={(e) => handle(e)}>Female</button>
                                        </div>
                                    </div>
                                    <div className="col-md-6 offset-md-3 mt-1">
                                        <div className={data.gender == 'prefer not to say' ? "gender-k" : 'gender-g'}>
                                            <button className="btn btn-g" type="button" value="prefer not to say" name="gender" onClick={(e) => handle(e)}>Prefer not to say</button>
                                        </div>
                                        <span className='text-danger'>{errors.gender}</span>
                                    </div>


                                    <div className="col-md-12 mt-1">
                                        <div className="form-group">
                                            <input type="checkbox" name="tc" onClick={(e) => handle(e)} className='mr-1' />
                                            <span className='ml-1'>
                                                Creating an account means you’re okay with our <strong><Link to="/term-&-user" target="blank">Terms of Service</Link></strong>, <strong><Link to="/privacy-policy" target="blank">Privacy Policy</Link></strong>, and our default Notification Settings.
                                            </span>
                                        </div>
                                        <span className='text-danger'>{errors.tc}</span>
                                    </div>

                                </div><br /><br />

                                <div className="row register-buttons" >
                                    <div className={ size[0] <= 470 ? "col-12 text-center" : "col-md-6 col-6 text-right"}>
                                        <div className="form-group">
                                            <Link to="/" className="btn-cancel">Back</Link>
                                        </div>
                                    </div>

                                    <div className={size[0] <= 470 ? "col-12 mt-1 text-center" : "col-md-6 col-6"}>
                                        <div className="form-group">
                                            <button type="submit"  style={{ cursor: "pointer" }} className="btn-save">Save & Proceed</button>
                                        </div>
                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </section>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <form id="Login" onSubmit={signUpHandler} >
                    <Modal.Body>
                        <lable>Enter OTP</lable>
                        <input className='form-control'
                         name="otp"
                        onChange={(e) => handle(e)}
                        value={data.otp} 
                          />
                          <span className='text-danger'>{errors.otp}</span>
                          <span className='text-success'>{resendOTP}</span>

                         <div className='text-right mt-2'><a className='text-danger' onClick={(e) => signUpOTPHandler(e, 'resend')}>Resend OTP</a></div> 
                    </Modal.Body>
                    <Modal.Footer>
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </Modal.Footer>
                </form>
            </Modal>


        </Layout>
    )
}

export default Register
