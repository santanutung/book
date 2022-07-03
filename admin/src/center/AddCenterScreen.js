import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import TimeComponent from './TimeComponent';
import Swal from 'sweetalert2'
import Validation from '../Validation/Validation';
import axiosBaseUrl from '../axiosBaseUrl'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import axios from 'axios';
import useGlobalContexts from '../context/GlobalContext';
import DropzoneComponent from '../ReuseableComponent/DropzoneComponent';
import moment from 'moment';

function AddCenterScreen() {
    const { setLoadingState } = useGlobalContexts();
    const history = useHistory()
    const [slots, setSlots] = useState([
        { day: '', opening_time: '', closing_time: '' },

    ])


    const [introduction, setIntroduction] = useState("");

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [data, setData] = useState({
        name: "",
        email: "",
        contact_no: "",
        total_beds: "",
        center_manager: "",
        image: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
        // status: "",
        charges: "",
        introduction: "",
    });

    const [errors, setErrors] = useState({});

    // const [mfile, setMFile] = useState([])

    useEffect(() => {
        getStates()
    }, [])

    function getStates() {
        axios
            .post("https://countriesnow.space/api/v0.1/countries/states", { "country": "India" })
            .then((res) => {
                console.log(res.data.data.states);
                setStates(res.data.data.states)
            })
            .catch(() => {
            });
    }

    function getCities(state_name) {
        axios
            .post("https://countriesnow.space/api/v0.1/countries/state/cities", { "country": "India", "state": state_name })
            .then((res) => {
                console.log(res.data.data);
                setCities(res.data.data)
            })
            .catch(() => {
            });
    }

    const handleAddFields = () => {
        setSlots([...slots, { day: '', opening_time: '', closing_time: '' }])
    }

    const handleRemoveFields = index => {
        const values = [...slots];
        values.splice(index, 1);
        setSlots(values);
    }

    const handleChangeInput = (index, event) => {

        var slotError = false;
        var value = '';
        if (event.target.name == 'day') {

            for (let i = 0; i < slots.length; i++) {

                if (slots[i].day == event.target.value) {
                    slotError = true;
                    Swal.fire("", "Days should be unqiue", 'error')
                    break;
                }

            }
            value = event.target.value;


        }
        else {
            value = event.target.value;


        }

        console.log(slots)

        if (!slotError) {
            const values = [...slots];

            values[index][event.target.name] = value

            setSlots(values);
        }
        console.log(slots);

    }


    function handle(e) {
        const newData = { ...data }

        if (e.target.id == 'contact_no') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
                newData[e.target.id] = e.target.value

                setData(newData)
            }
        }
        else if (e.target.id == 'pincode') {
            // console.log(/^[0-9\b]+$/.test(e.target.value))
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 6)) {

                newData[e.target.id] = e.target.value

                setData(newData)
            }
        }
        // else if (e.target.id == 'charges') {
        //     if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 6)) {

        //         newData[e.target.id] = e.target.value

        //         setData(newData)
        //     }
        // }
        else if (e.target.id == 'commission') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 2)) {

                newData[e.target.id] = e.target.value

                setData(newData)
            }
        }
        else if (e.target.id == 'total_beds') {
            if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 5)) {

                newData[e.target.id] = e.target.value

                setData(newData)
            }
        }


        else {
            newData[e.target.id] = e.target.value
            setData(newData)
            console.log(e.target.value)
            if (e.target.id == 'state') {

                getCities(e.target.value)
            }

        }



    }

    function handleIntroduction(intro) {
        const newData = { ...data }
        newData['introduction'] = intro
        setData(newData)
    }

    function handleFile(e) {

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...data }
            newData['image'] = reader.result
            setData(newData)
            console.log(reader.result);//base64encoded string
        };





    }




    const formData = (e) => {


        e.preventDefault()

        var error_data = Validation(data);
        setErrors(error_data);
        console.log(data)
        console.log(error_data);


        let slotError = false;

        // if (Object.keys(error_data).length == 0 && slotError == false) {

        for (let i = 0; i < slots.length; i++) {

            if (slots[i].day == '' || slots[i].opening_time == '' || slots[i].closing_time == "") {
                slotError = true
                setLoadingState(false)
                Swal.fire("", "Please select Opening and Closing time", 'error')

                return;
            }
            else {
                if (slots[i].closing_time && slots[i].opening_time && parseInt(moment(slots[i].opening_time, 'h:mm a').format('Hmmss')) < parseInt(moment(slots[i].opening_time, 'h:mm a').format('Hmmss'))) {
                    // errors.closing_time = 'Opening time should be less then closing time';
                    slotError = true
                    Swal.fire("", "Opening time should be less than closing time", 'error')
                    setLoadingState(false)
                    return;
                }
            }

        }

        console.log(Object.keys(error_data).length + "&&" + slotError === false)

        if (Object.keys(error_data).length == 0 && slotError === false) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    setLoadingState(true)


                    data['coordinates'] = [parseFloat(data.latitude), parseFloat(data.longitude)]

                    data['times'] = slots


                    axiosBaseUrl.post('admin/center', data)
                        .then((res) => {
                            console.log(res)
                            setLoadingState(false)
                            Swal.fire('Centre is successfully added!', '', 'success')
                            history.replace('/manageCentre')

                        }).catch(error => {
                            setLoadingState(false)
                            console.log(error.response)
                            if (error.response) {
                                if (error.response.status == 422) {
                                    const newData = {}
                                    error.response.data.errors.map((x) => {
                                        newData[x.param] = x.msg

                                    })
                                    setErrors(newData)
                                    window.scroll(0, document.getElementById(Object.keys(newData)[0]).offsetTop - 50);
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


                    // Swal.fire('Saved!', '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }
        else {
            setLoadingState(false)
            if (slotError === false) {

                window.scroll(0, document.getElementById(Object.keys(error_data)[0]).offsetTop - 50);
            }
        }




    }

    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.longitude)

            const newData = { ...data }
            newData['latitude'] = position.coords.latitude
            newData['longitude'] = position.coords.longitude
            setData(newData)

        })
    }

    return (

        <Layout>

            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/manageCentre">Manage Centre</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Add Centre</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">

                                <form
                                    className="multipart-submit-form"
                                    onSubmit={formData}
                                >

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Name <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="name"
                                                onChange={(e) => handle(e)}
                                                value={data.name}
                                                className="form-control"
                                                placeholder="enter name here"
                                                maxLength="100"
                                            />

                                            <span className="form-errors">{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="email"
                                                onChange={(e) => handle(e)}
                                                value={data.email}
                                                className="form-control"
                                                type="email"
                                                placeholder="enter email here"
                                                maxLength="100"
                                            />
                                            <span className="form-errors">{errors.email}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Contact No.</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="contact_no"
                                                onChange={(e) => handle(e)}
                                                value={data.contact_no}
                                                className="form-control"
                                                placeholder="enter contact no. here"
                                                maxLength="10"
                                            />
                                            <span className="form-errors">{errors.contact_no}</span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Manager</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="center_manager"
                                                onChange={(e) => handle(e)}
                                                value={data.center_manager}
                                                className="form-control"
                                                placeholder="enter center manager here"
                                                maxLength="100"
                                            />
                                            <span className="form-errors">{errors.center_manager}</span>
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Image</label>
                                        </div>
                                        <div className="col-lg-4">
                                            {/* <DropzoneComponent /> */}
                                            <div class="box">
                                                <div class="js--image-preview" style={{ backgroundImage: `url(${data.image ? data.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"})` }}>
                                                    {/* <img src={data.image? data.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"} /> */}
                                                </div>
                                                <div class="upload-options">
                                                    <label>
                                                        <input type="file" class="image-upload" name="image" accept="image/*" onChange={(e) => handleFile(e)} />
                                                    </label>
                                                </div>
                                            </div>
                                            {/* <input
                                                type="file"
                                                id="contact_no"
                                                onChange={(e) => handleFile(e)}
                                                name="image"
                                            /> */}
                                            <span className="form-errors">{errors.image}</span>
                                        </div>
                                        {
                                            data.image ? <img src={data.imgae} /> : ""
                                        }
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Total Beds</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="total_beds"
                                                onChange={(e) => handle(e)}
                                                value={data.total_beds}
                                                className="form-control"
                                                placeholder="enter total beds here"
                                                type="number"
                                            />
                                            <span className="form-errors">{errors.total_beds}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">charges</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="charges"
                                                onChange={(e) => handle(e)}
                                                value={data.charges}
                                                className="form-control"
                                                placeholder="enter charges here"
                                                type="number"

                                            />
                                            <span className="form-errors">{errors.charges}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Commission (%)</label>
                                        </div>
                                        <div className="col-lg-4">
                                            <input
                                                id="commission"
                                                onChange={(e) => handle(e)}
                                                value={data.commission}
                                                className="form-control"
                                                placeholder="enter commission here"
                                                type="number"
                                            />
                                            <span className="form-errors">{errors.commission}</span>

                                        </div>
                                        <div className="col-lg-4">
                                            <input readOnly className='form-control' value={data.commission && data.charges ? (data.commission / 100) * data.charges : 0} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Introduction </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={introduction}
                                                onChange={(event, editor) => {
                                                    handleIntroduction(editor.getData())
                                                }}

                                            />


                                            <span className="form-errors">{errors.introduction}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <h5>Address</h5>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Address <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="address"
                                                onChange={(e) => handle(e)}
                                                value={data.address}
                                                className="form-control"
                                                placeholder="enter address here"
                                            />
                                            <span className="form-errors">{errors.address}</span>
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Area <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="area"
                                                onChange={(e) => handle(e)}
                                                value={data.area}
                                                className="form-control"
                                                placeholder="enter area here"
                                            />
                                            <span className="form-errors">{errors.area}</span>
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                State <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <select
                                                id="state"
                                                onChange={(e) => handle(e)}
                                                value={data.state}
                                                className="form-control"
                                                placeholder="enter state here"
                                            >
                                                <option value="">Select State</option>
                                                {
                                                    states.map((state, index) => {
                                                        return (
                                                            <option value={state.name}>{state.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <span className="form-errors">{errors.state}</span>
                                        </div>

                                    </div>

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                City <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <select
                                                id="city"
                                                onChange={(e) => handle(e)}
                                                value={data.city}
                                                className="form-control"
                                                placeholder="enter city here"
                                                defaultValue
                                            >
                                                <option value="">Select City</option>
                                                {
                                                    cities.map((city, index) => {
                                                        return (
                                                            <option value={city}>{city}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <span className="form-errors">{errors.city}</span>
                                        </div>

                                    </div>

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Pincode <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="pincode"
                                                onChange={(e) => handle(e)}
                                                value={data.pincode}
                                                className="form-control"
                                                placeholder="enter pincode here"
                                            />
                                            <span className="form-errors">{errors.pincode}</span>
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Latitude & Longitude <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-3">
                                            <input
                                                id="latitude"
                                                onChange={(e) => handle(e)}
                                                value={data.latitude}
                                                className="form-control"
                                                placeholder="enter latitude here"
                                            // defaultValue
                                            />
                                            <span className="form-errors">{errors.latitude}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <input
                                                id="longitude"
                                                onChange={(e) => handle(e)}
                                                value={data.longitude}
                                                className="form-control"
                                                placeholder="enter longitude here"
                                            // defaultValue
                                            />
                                            <span className="form-errors">{errors.longitude}</span>
                                        </div>
                                        <div className="col-lg-2">
                                            <button type='button' className='btn btn-sm btn-secondary' onClick={() => getCurrentLocation()}>Get Current Location</button>
                                        </div>



                                    </div>

                                    {/* <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Opening Time - Closing Time <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-4">
                                            <select

                                                className="w-100 start_time form-control"
                                                name="opening_time"
                                                id="opening_time"
                                                amPmAriaLabel="Select AM/PM"
                                                disableClock="false"
                                                format="hh:mm a"
                                                value={data.opening_time?.replace(/^0+/, '')}
                                                onChange={(e) => handle(e)}

                                            >
                                                <option value="">Select Opening Time</option>

                                                {

                                                    Array(96).fill().map((_, i) => {
                                                        var time = moment('12:00 pm', 'h:mm a').add(i * 15, 'minutes').format('h:mm a')
                                                        return (
                                                            <option value={time}> {time}</option>
                                                        )
                                                    })
                                                }

                                            </select>

                                            <span className="form-errors">{errors.opening_time}</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <select

                                                className="w-100 closing_time form-control"
                                                name="closing_time"
                                                id="closing_time"
                                                amPmAriaLabel="Select AM/PM"
                                                disableClock="false"
                                                format="hh:mm a"
                                                onChange={(e) => handle(e)}
                                                value={data.closing_time?.replace(/^0+/, '')}

                                            >
                                                <option value="">Select Closing Time</option>


                                                {

                                                    data.opening_time ?
                                                        Array(96).fill().map((_, i) => {

                                                            var time = moment(data.opening_time, 'h:mm a').add((i + 1) * 15, 'minutes').format('h:mm a')

                                                            return (
                                                                parseInt(moment(time, 'h:mm a').format('Hmmss')) > parseInt(moment(data.opening_time, 'h:mm a').format('Hmmss')) && parseInt(moment(data.opening_time, 'h:mm a').format('Hmmss')) <= 240000 ?
                                                                    <option value={time}>{time}</option> : ''
                                                            )
                                                        })
                                                        :
                                                        ''
                                                }

                                            </select>

                                            <span className="form-errors">{errors.closing_time}</span>
                                        </div>
                                      



                                    </div> */}


                                   
                                    <hr />
                                    <h5>Time</h5>
                                    <div className="text-right mb-2">
                                        <button
                                            onClick={handleAddFields}
                                            type="button" className="btn btn-secondary btn-sm add-more-time"
                                        >
                                            Add More
                                        </button>
                                    </div>
                                    <table className="table table-boarderless">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Opening Time</th>
                                                <th>Closing</th>
                                                {slots.length > 1 ? <th>Remove</th> : null}
                                            </tr>
                                        </thead>

                                        {
                                            slots.map((slot, index) => {

                                                return (

                                                    <tbody key={index} id="time-list">
                                                        <TimeComponent slot={slot} index={index} handleChangeInput={handleChangeInput} handleRemoveFields={handleRemoveFields} totalSlots={slots.length} />

                                                    </tbody>
                                                )
                                            }
                                            )
                                        }

                                    </table>
                                    <span className="form-errors">{errors.error}</span>
                                    <div className="form-group row">
                                        <div className="col-lg-8 offset-lg-3 text-right">
                                            <button type="submit" className="btn btn-primary mr-2">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div >


        </Layout >

    )
}

export default AddCenterScreen
