import axios from 'axios'
import moment from 'moment-timezone'
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import useGlobalContexts from '../../context/GlobalContext'
import { env } from '../../env'
import blood_group from '../../rawData/DataSet'
import EditProfileValidation from '../../Validation/EditProfileValidation'

function EditProfile(props) {
    const myRef = useRef(null)
    
    const { profile, setProfile,setProfileData } = props
  
    const [profileError, setProfileError] = useState({});
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [state, setState] = useState(profile.state)
    const [profileImage, setProfileImage] = useState('')
    const {setUserName} = useGlobalContexts()
 
    useEffect(() => {

        getProfile()
        getStates()
     
       
        delete profile.profile_photo_path
     
    }, [])


    function getProfile() {

        axiosBaseUrl.get(`patients/api/profile`)
            .then((res) => {
                // setP rofile(res.data.data)
                setProfileData(res.data.data)
                setProfileImage(res.data.data.profile_photo_path)
                getCities(res.data.data.state)
                                setProfile({
                    name: res.data.data.name,
                    email: res.data.data.email,
                    phone: res.data.data.phone,
                    dob: res.data.data.dob,
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



    function editProfileHandler(e) {
        const newData = { ...profile }
     
        if (e.target.name == 'phone') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.name] = e.target.value

                setProfile(newData)
            }
        }
        else if (e.target.name == 'pincode') {
           
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 6)) {

                newData[e.target.name] = e.target.value

                setProfile(newData)
            }
        }
        else if (e.target.name == 'dob') {
            if (e.target.value != NaN) {
                newData[e.target.name] = (moment(e.target.value)._i)

                setProfile(newData)
            }
        }
        else {
            newData[e.target.name] = e.target.value

            setProfile(newData)


        }
        if (e.target.name == 'state') {

            getCities(e.target.value)
        }
     
    }

    function handleEditFile(e) {

        const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            setProfileError({ 'image': 'Image size should be maximum 2 MB' });
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {
                const newData = { ...profile }
                newData['profile_photo_path'] = reader.result
                setProfile(newData)
              
            };
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

    function findPosition(obj) {
        var currenttop = 0;
        if (obj.offsetParent) {
            do {
                currenttop += obj.offsetTop-50;
            } while ((obj = obj.offsetParent));
            return [currenttop];
        }
    }


    const updateProfileHandler = (e) => {

        var error_data = EditProfileValidation(profile);
        setProfileError(error_data);
       

        if (Object.keys(error_data).length == 0) {


            axiosBaseUrl.put(`patients/api/update/profile`, profile)
                .then((res) => {
                 
                    if (res.status == 200) {
                        Swal.fire('', 'Details is successfully updated', 'success')
                        getProfile()
                    }
                    setProfileError({})


                }).catch(error => {
                 
                    // alert("none done")
                    if (error.response) {
                        if (error.response.status == 422) {

                            const errorData = {}
                            error.response.data.errors.errors.map((value, index) => {
                               
                                errorData[value.param] = value.msg

                            })
                            setProfileError(errorData)
                            window.scroll(0,document.getElementById("profile-"+Object.keys(errorData)[0]).offsetTop-50);
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
        else {
            window.scroll(0,document.getElementById("profile-"+Object.keys(error_data)[0]).offsetTop-50);

        }


    }





    return (
        <div className="row mt-3">
            <div className="col-md-6 offset-md-3">
                <div className="portfolio-info">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="form-group log-f text-center">
                                <div className="file-text text-center">
                                    <label htmlFor="photo-upload" className="custom-file-upload fas">
                                        <div className="img-wrap img-upload" > 
                                       
                                            {

                                                profile.profile_photo_path ?
                                                    <img for="photo-upload" src={profile.profile_photo_path} width="100%" height="100%" />
                                                    :
                                                    <img for="photo-upload" src={profileImage ? env.imageurl + profileImage  :'img/file.png' } width="100%" height="100%" />
                                            }
                                        </div>
                                        <input id="photo-upload" accept="image/*" type="file" onChange={(e) => handleEditFile(e)} />
                                    </label>
                                   
                                </div>
                                <span className='text-danger'>{profileError.image}</span>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control capitalize"
                                    id="name"
                                    placeholder="Full Name*"
                                    required
                                    value={profile.name}
                                    onChange={(e) => editProfileHandler(e)}
                                />
                                <span className='text-danger'>{profileError.name}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    id="profile-email"
                                    placeholder="Email address*"
                                    required
                                    value={profile.email}
                                    onChange={(e) => editProfileHandler(e)}
                                />
                                <span className='text-danger'>{profileError.email}</span>

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    id="profile-phone"
                                    placeholder="Phone number*"
                                    required
                                    value={profile.phone}
                                    onChange={(e) => editProfileHandler(e)}
                                />
                                <span className='text-danger'>{profileError.phone}</span>

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="date"
                                    placeholder="MM | DD | YYY"
                                    className="form-control"
                                    name="dob"
                                    id="profile-dob"
                                    required
                                    value={moment(profile.dob).format('YYYY-MM-DD')}
                                    onChange={(e) => editProfileHandler(e)}
                                    max={moment().format('YYYY-MM-DD')}
                                />


{
    profileError.dob ? <span className='text-danger' ref={myRef}>{profileError.dob}</span> : ''
}
                                

                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="form-group log-f">
                                <select
                                    type="text"
                                    className="form-control"
                                    name="blood_group"
                                    id="profile-blood_group"
                                    placeholder="Blood Group*"
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={profile.blood_group}

                                >
                                    <option>Select Blood Group</option>
                                    {blood_group.map((x, index) => {
                                        return (
                                            <option value={x} >{x}</option>
                                        )
                                    })}
                                </select>
                                {
    profileError.blood_group ? <span className='text-danger' ref={myRef}>{profileError.blood_group}</span> : ''
}
                                {/* <span className='text-danger'>{profileError.blood_group}</span> */}
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="insurance_no"
                                    id="profile-insurance_no"
                                    placeholder="Insurance No.*"
                                    required
                                    value={profile.insurance_no}
                                    onChange={(e) => editProfileHandler(e)}
                                />
                                <span className='text-danger'>{profileError.insurance_no}</span>

                            </div>
                        </div>
                        {/* <div className="col-md-6">
                            <div className={profile.gender == 'male' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="male" name="gender" onClick={(e) => editProfileHandler(e)}>Male</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={profile.gender == 'female' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="female" name="gender" onClick={(e) => editProfileHandler(e)}>Female</button>
                            </div>
                        </div> */}
                        <div className="col-md-6 mb-3">
                            <div className={profile.gender == 'male' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="male" name="gender" onClick={(e) => editProfileHandler(e)}>Male</button>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className={profile.gender == 'female' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="female" name="gender" onClick={(e) => editProfileHandler(e)}>Female</button>
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-3 mt-1">
                            <div className={profile.gender == 'prefer not to say' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="prefer not to say" name="gender" onClick={(e) => editProfileHandler(e)}>Prefer not to say</button>
                            </div>
                        </div>

                        <span className='text-danger' id="profile-gender">{profileError.gender}</span>

                    </div>
                    <div className="row">
                        <div className="add-l">
                            <h3>Address</h3>
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group log-f">
                                        {/* <lable>House no/flat no./building</lable> */}
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="house_no"
                                            placeholder="House no/flat no./building"
                                            value={profile.house_no}
                                            onChange={(e) => editProfileHandler(e)}
                                            id='profile-house_no'
                                        />
                                        <span className='text-danger'>{profileError.house_no}</span>

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group log-f">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="street"
                                            placeholder="Street"
                                            value={profile.street}
                                            onChange={(e) => editProfileHandler(e)}
                                            id='profile-street'
                                        />
                                        <span className='text-danger'>{profileError.street}</span>

                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group log-f">
                                        {/* <lable>House no/flat no./building</lable> */}
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="area"
                                            placeholder="Area"
                                            value={profile.area}
                                            onChange={(e) => editProfileHandler(e)}
                                            id='profile-area'
                                        />
                                        <span className='text-danger'>{profileError.area}</span>

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group log-f">
                                        <select
                                            type="text"
                                            className="form-control"
                                            name="state"
                                            placeholder="State"
                                            value={profile.state}
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
                                        <span className='text-danger'>{profileError.state}</span>

                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <select
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    placeholder="City"
                                    value={profile.city}
                                    onChange={(e) => editProfileHandler(e)}
                                    id='profile-city'
                                >
                                    <option value="">Select City</option>
                                    {
                                        cities.map((city, index) => {
                                            return (
                                                <option value={city.toLowerCase()} selected={city.toLowerCase() == profile.city ? 'true' : 'false'}>{city}</option>
                                            )
                                        })
                                    }
                                </select>
                                <span className='text-danger'>{profileError.city}</span>

                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={profile.pincode}
                                    onChange={(e) => editProfileHandler(e)}
                                    id='profile-incode'
                                />
                                <span className='text-danger'>{profileError.pincode}</span>

                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-md-12">
                            <div className="form-group log-f text-center">
                                <button className="btn btn-sm btn-primary" type="button" onClick={updateProfileHandler}>
                                    Save
                                </button>
                            </div>
                        </div>


                    </div>


                </div>
            </div>

        </div>
    )
}

export default EditProfile
