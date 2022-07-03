import axios from 'axios';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import { env } from '../../env';
import blood_group from '../../rawData/DataSet';
import EditProfileValidation from '../../Validation/EditProfileValidation';
import Layout from '../Layout';
import ReportModal from './Appointment/ReportModal';

function EditProfile() {
    const [convertedFiles, setConvertedfiles] = useState([{ image: '' }])
    const [addData, setAddData] = useState({ name: '', blood_group: '', relation: '', dob: '', gender: '', day: '', month: "", year: '', pincode: '' });
    const [familyError, setFamilyError] = useState({});
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [profileImage, setProfileImage] = useState('')
    const { setUserName } = useGlobalContexts()
    const [reportModal, setReportModal] = useState(false)
    const [reportIndex, setReportIndex] = useState('')
    const history = useHistory()
    useEffect(() => {
        getStates()
        getProfile()
    }, []);


    function getProfile() {

        axiosBaseUrl.get(`patients/api/profile`)
            .then((res) => {
                // setP rofile(res.data.data)
                // setProfileData(res.data.data)
                console.log(res.data.data)
                setProfileImage(res.data.data.profile_photo_path)
                getCities(res.data.data.state)
                setAddData({
                    name: res.data.data.name,
                    email: res.data.data.email,
                    phone: res.data.data.phone,
                    dob: res.data.data.dob,
                    day: moment(res.data.data.dob).format('DD'),
                    month: moment(res.data.data.dob).format('MM'),
                    year: moment(res.data.data.dob).format('YYYY'),
                    insurance_no: res.data.data.insurance_no,
                    gender: res.data.data.gender,
                    house_no: res.data.data.house_no,
                    street: res.data.data.street,
                    area: res.data.data.area,
                    city: res.data.data.city,
                    state: res.data.data.state,
                    pincode: res.data.data.pincode,
                    blood_group: res.data.data.blood_group,
                    // profile_photo_path: res.data.data.profile_photo_path
                })

                setUserName(res.data.data.name)



            }).catch(error => {
                console.log(error)

            })
    }



    function browseFile(e, index) {
        var newData = [...convertedFiles]

        const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            // setProfileError({ 'image': 'Image size should be maximum 2 MB' });
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {
                // setConvertedfiles((prevFiles) => [...prevFiles, { image: reader.result }])
                newData[index] = { image: reader.result }
                // newData['profile_photo_path'] = reader.result
                setConvertedfiles(newData)
                // console.log(reader.result);//base64encoded string
            };
        }
    }

    function handleEditFile(e) {

        const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            setFamilyError({ 'image': 'Image size should be maximum 2 MB' });
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {
                const newData = { ...addData }
                newData['profile_photo_path'] = reader.result
                setAddData(newData)
                console.log(reader.result);//base64encoded string
            };
        }


    }

    function removeReport(remove_index) {
        var data = convertedFiles
        // data.splice(index, 1);

        var data = convertedFiles.filter((item, index) => {
            return remove_index !== index
        })
        setConvertedfiles(data)


    }


    const handleAddFields = () => {
        setConvertedfiles([...convertedFiles, { image: '' }])
    }

    function editProfileHandler(e) {
        // const newData = { ...addData }
        // newData[e.target.name] = e.target.value
        // setAddData(newData)


        const newData = { ...addData }
        // newData[e.target.name] = e.target.value
        if (e.target.name == 'phone') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.name] = e.target.value

                setAddData(newData)
            }
        }
        else if (e.target.name == 'pincode') {
            // console.log(/^[0-9\b]+$/.test(e.target.value))
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 6)) {

                newData[e.target.name] = e.target.value

                setAddData(newData)
            }
        }
        else if (e.target.name === 'day') {

            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 2 && parseInt(e.target.value) < 31)) {

                newData[e.target.name] = e.target.value

                setAddData(newData)
            }
        }
        else if (e.target.name === 'month') {

            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 2 && parseInt(e.target.value) <= 12)) {

                newData[e.target.name] = e.target.value

                setAddData(newData)
            }
        }
        else if (e.target.name === 'year') {

            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 4 && parseInt(e.target.value) <= moment().format('YYYY'))) {

                newData[e.target.name] = e.target.value

                setAddData(newData)
            }
        }
        else if (e.target.name == 'dob') {
            if (e.target.value != NaN) {
                newData[e.target.name] = (moment(e.target.value)._i)

                setAddData(newData)
            }
        }
        else {
            newData[e.target.name] = e.target.value

            setAddData(newData)


        }
        if (e.target.name == 'state') {

            getCities(e.target.value)
        }
    }

    const add = (e) => {
        e.preventDefault()
        const newData = { ...addData }
        newData['dob'] = newData.year + "-" + newData.month + "-" + newData.day
        newData['files'] = convertedFiles
        setAddData(newData)

        var error_data = EditProfileValidation(addData);
        setFamilyError(error_data);
        console.log(error_data);
        if (Object.keys(error_data).length == 0) {
            console.log(addData)
            axiosBaseUrl.put(`patients/api/update/profile`, addData)
                .then((res) => {
                    // alert("estt")
                    console.log(res)
                    if (res.status == 200) {
                        // patientFamily()
                        Swal.fire('', 'Details is successfully add', 'success')
                        // setFamilyModal("")

                        history.push({ 
                            pathname: '/Profile'
                           })

                    }


                }).catch(error => {
                    console.log(error.response)
                    // alert("none done")
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = { ...familyError }
                            error.response.data.errors.map((value, index) => {
                                console.log(value);

                                errorData[value.param] = value.msg

                            })
                            setFamilyError(errorData)
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



    function getStates() {
        axios
            .post("https://countriesnow.space/api/v0.1/countries/states", { "country": "India" })
            .then((res) => {

                setStates(res.data.data.states)
            })
            .catch(() => {
            });
    }

    function getCities(state_name) {

        axios
            .post("https://countriesnow.space/api/v0.1/countries/state/cities", { "country": "India", "state": state_name })
            .then((res) => {

                setCities(res.data.data)
            })
            .catch(() => {
            });
    }

    return (
        <Layout>

            <section className="login-l mt-9">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">

                            <form className='php-email-form' onSubmit={(e) => add(e)}>
                                <div className="form-group">

                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="upoad__css">
                                                <div className='upload-img'>
                                                    <div></div>
                                                    <div className='upload-image-section'>
                                                        <img
                                                        className="user-upload-profile-image"
                                                            // src="/img/icon-upload.png"
                                                            src={addData.profile_photo_path ? addData.profile_photo_path : profileImage ? env.imageurl+profileImage : '/img/icon-upload.png'}
                                                        />

                                                        <img className='hover-image hide'
                                                            src="/img/icon-upload.png"
                                                        />
                                                        <input type="file" onChange={(e) => handleEditFile(e)} />
                                                    </div>

                                                    <p className="uploimg">Upload your image</p>
                                                </div>


                                            </div>
                                            <span className='text-danger'>{familyError.image}</span>
                                        </div>

                                        <div className="col-md-6">

                                            <div className='row'>

                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Full Name"
                                                            name="name"
                                                            onChange={(e) => editProfileHandler(e)}
                                                            value={addData.name}
                                                        />
                                                        <span className='text-danger'>{familyError.name}</span>
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <select
                                                            type="text"
                                                            className="form-control"
                                                            name="blood_group"
                                                            id="blood_group"
                                                            placeholder="Blood Group*"
                                                            required
                                                            onChange={(e) => editProfileHandler(e)}
                                                            value={addData.blood_group}
                                                        >
                                                            <option>Select Blood Group</option>
                                                            {blood_group.map((x, index) => {
                                                                return (
                                                                    <option value={x}>{x}</option>
                                                                )
                                                            })}
                                                        </select>
                                                        <span className='text-danger'>{familyError.blood_group}</span>
                                                    </div>
                                                </div>

                                            </div>



                                        </div>


                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Email Address*"
                                                    name="email"
                                                    onChange={(e) => editProfileHandler(e)}
                                                    value={addData.email}
                                                />
                                                <span className='text-danger'>{familyError.email}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Phone Number*"
                                                    name="phone"
                                                    onChange={(e) => editProfileHandler(e)}
                                                    value={addData.phone}
                                                />
                                                <span className='text-danger'>{familyError.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        aria-label="First name"
                                                        className="form-control"
                                                        placeholder="Birth Date"
                                                        name="day"
                                                        onChange={(e) => editProfileHandler(e)}
                                                        value={addData.day}
                                                    />
                                                    <input
                                                        type="text"
                                                        aria-label="Last name"
                                                        className="form-control"
                                                        placeholder="Month"
                                                        name="month"
                                                        onChange={(e) => editProfileHandler(e)}
                                                        value={addData.month}
                                                    />
                                                    <input
                                                        type="text"
                                                        aria-label="Last name"
                                                        className="form-control"
                                                        placeholder="Years"
                                                        name="year"
                                                        onChange={(e) => editProfileHandler(e)}
                                                        value={addData.year}
                                                    />
                                                </div>
                                                <span className='text-danger'>{familyError.dob}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Insurance No.(Optional)"
                                                    name="insurance_no"
                                                    onChange={(e) => editProfileHandler(e)}
                                                    value={addData.insurance_no}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <button type='button' className={addData.gender == 'male' ? "btn btn-primary male-btn w-100" : 'btn btn-primary fmale-btn w-100'} value="male" name="gender" onClick={(e) => editProfileHandler(e)}>Male</button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group'>
                                                <button type='button' className={addData.gender == 'female' ? "btn btn-primary male-btn w-100" : 'btn btn-primary fmale-btn w-100'} value="female" name="gender" onClick={(e) => editProfileHandler(e)}>Female</button>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">

                                        <div className="col-md-6 offset-md-3">
                                            <button type='button' className={addData.gender == 'prefer not to say' ? "btn btn-primary male-btn w-100" : 'btn btn-primary fmale-btn w-100'} value="prefer not to say" name="gender" onClick={(e) => editProfileHandler(e)}>
                                                Prefer not to say
                                            </button>
                                        </div>
                                        <span className='text-danger'>{familyError.gender}</span>
                                    </div>
                                    <br />
                                    <h3 className='text-theme-color'>Address</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="house_no"
                                                    placeholder="House no/flat no./building"
                                                    value={addData.house_no}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-house_no'
                                                />
                                                <span className='text-danger'>{familyError.house_no}</span>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="street"
                                                    placeholder="Street"
                                                    value={addData.street}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-street'
                                                />
                                                <span className='text-danger'>{familyError.street}</span>

                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="area"
                                                    placeholder="Area"
                                                    value={addData.area}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-area'
                                                />
                                                <span className='text-danger'>{familyError.area}</span>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className='form-group'>
                                                <select
                                                    type="text"
                                                    className="form-control"
                                                    name="state"
                                                    placeholder="State"
                                                    value={addData.state}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-state'

                                                >
                                                    <option value="">Select State</option>
                                                    {
                                                        states.map((state, index) => {
                                                            return (
                                                                <option value={state.name.toLowerCase()} >{state.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <span className='text-danger'>{familyError.state}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className='form-group'>
                                                <select
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    placeholder="City"
                                                    value={addData.city}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-city'
                                                >
                                                    <option value="">Select City</option>
                                                    {
                                                        cities.map((city, index) => {
                                                            return (
                                                                <option value={city.toLowerCase()} >{city}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <span className='text-danger'>{familyError.city}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pincode"
                                                    placeholder="Pincode"
                                                    value={addData.pincode}
                                                    onChange={(e) => editProfileHandler(e)}
                                                    id='profile-incode'
                                                />
                                                <span className='text-danger'>{familyError.pincode}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                        <div className='col-m-12'>
                                            <h5 className='mb-3 theme-color'>Reports (Upload your files)</h5>
                                        </div>
                                        {
                                            convertedFiles.map((image, index) => {
                                                return (
                                                    <div className="col-md-4 mb-3">

                                                        <div className="relative">
                                                            {
                                                                image.image ?
                                                                    <button target="_blank" className="file-upload" type="button">{image.title}<i className="fas fa-times" onClick={() => removeReport(index)}></i></button>
                                                                    :
                                                                    <>
                                                                        <button className="file-upload" type="button" value="male" name="gender" onClick={() => { setReportModal(true); setReportIndex(index) }}>Upload <i className="fas fa-upload"></i></button>
                                                                        {/* <input type="file" accept='application/pdf, image/*' className='file-input' onChange={(e) => browseFile(e, index)} /> */}
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }


                                        <div className="col-md-4 mb-3">
                                            <div className="relative">

                                                <button className="btn btn-primary" type="button" onClick={handleAddFields} >Add More </button>

                                            </div>
                                        </div>



                                    </div>


                                    <br />
                                    <div className="row">
                                        {/* <div className="col-md-4"></div> */}
                                        <div className="col-md-12 text-right">
                                            {/* <Link className="back_btn mr-1" to="/Profile" onClick={handleAddFields} >Back </Link> */}
                                            <button type="submit" className="btn btssr">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>


            <ReportModal reportModal={reportModal} setReportModal={setReportModal} reportIndex={reportIndex} convertedFiles={convertedFiles} setConvertedfiles={setConvertedfiles} />



        </Layout>
    );
}
export default EditProfile;
