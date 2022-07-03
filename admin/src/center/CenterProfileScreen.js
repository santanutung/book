import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'

import Swal from "sweetalert2";
import { env } from '../env'
import { centerTimeValidation } from '../Validation/Validation';

function CenterProfileScreen() {


    const [show, setShow] = useState(false);

    const [centerTime, setCenterTime] = useState([
        { day: '', opening_time: '', closing_time: '' },

    ])

    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        name: "",
        center_manager: "",
        email: "",
        contact_no: "",
        total_beds: "",
        introduction: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
        status: "",
        charges: "",
        primaryImage: "",
        verify_status: "",
        status: ""
    });
    const { id } = useParams();

    console.log("ID: ", id)
    const [slot, setSlot] = useState({ day: '', opening_time: '', closing_time: '' })

    const handleChangeInput = (e) => {
        const newData = { ...slot }
        newData[e.target.id] = e.target.value
        setSlot(newData)
    }



    const submitCenterForm = (e) => {
        e.preventDefault()

        var error_data = centerTimeValidation(slot);
        setErrors(error_data);

        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true, showCancelButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then((result) => {
                if (result.isConfirmed) {


                    axiosBaseUrl.post(`admin/center-time/${id}`, slot)
                        .then((res) => {
                            console.log(res)
                            Swal.fire('Centre is successfylly added!', '', 'success')
                            getSlots()
                            setSlot({ day: '', opening_time: '', closing_time: '' })

                        }).catch(error => {
                            console.log(error)
                            if (error.response) {
                                Swal.fire(error.response.data.error, '', 'error')


                            }
                            else if (error.request) {
                                // The request was made but no response was received
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                        })


                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }


    }


    const deleteSlot = (slot_id) => {

        Swal.fire({
            title: 'Are You Sure?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Delete`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`admin/center-time/${id}/${slot_id}`)
                    .then((res) => {

                        console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Saved!', 'Slot is successfully deleted', 'success')
                        getSlots()


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function getSlots() {
        axiosBaseUrl.get(`admin/center-time/${id}`)
            .then((res) => {
                console.log(res.data.data)
                setCenterTime(res.data.data.times)
                // setCenter(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }

    const HandleClick = (passedValue) => {
        // console.log(statusKey)
        // var status = {statusKey : passedValue}
        console.log(passedValue, 'test')
        Swal.fire({
            title: 'Do you want to save the changes?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Update`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.put(`admin/center-verify/${id}`, passedValue)
                    .then((res) => {

                        Swal.fire('', 'Status is successfully updated', 'success')
                        getCenter()

                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    useEffect(() => {
        getCenter()
    }, [])

    function getCenter() {
        axiosBaseUrl.get(`admin/center/${id}`)
            .then((res) => {
                setCenterTime(res.data.data.times)
                const newData = { ...data }
                newData['name'] = res.data.data.name
                newData['email'] = res.data.data.email
                newData['contact_no'] = res.data.data.contact_no
                newData['total_beds'] = res.data.data.total_beds
                newData['charges'] = res.data.data.charges
                newData['introduction'] = res.data.data.introduction
                newData['address'] = res.data.data.address
                newData['city'] = res.data.data.city
                newData['state'] = res.data.data.state
                newData['pincode'] = res.data.data.pincode
                newData['latitude'] = res.data.data.latitude
                newData['longitude'] = res.data.data.longitude
                newData['status'] = res.data.data.status
                newData['verify_status'] = res.data.data.verify_status
                newData['center_manager'] = res.data.data.center_manager
                newData['primaryImage'] = res.data.data.primaryImage

                setData(newData)

            }).catch(error => {
                console.log(error)

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
                                            <li className="breadcrumb-item"><Link to="/manageCenter">Manage Centre</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Center Profile</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="container-fluid">
                        <div
                            className="page-header min-height-230 border-radius-xl mt-4"
                            style={{
                                backgroundImage: 'url("../assets/img/curved-images/curved0.jpg")',
                                backgroundPositionY: "50%"
                            }}
                        >
                            <span className="mask bg-gradient-primary opacity-6" />
                        </div>
                        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden center-profile">
                            <div className="row gx-4">
                                <div className="col-auto">
                                    <div className="avatar avatar-xl position-relative">
                                        <img
                                            src={`${env.imageurl + data.primaryImage}`}
                                            width="100"
                                            alt="profile_image"
                                            className="border-radius-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="col-auto my-auto">
                                    <div className="h-100">
                                        <h5 className="mb-1">{data.name}</h5>
                                        <p className="mb-0 font-weight-bold text-sm">{data.email}</p>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                                    <div className="nav-wrapper position-relative end-0">

                                        {data.verify_status == 'pending' ?
                                            <ul className="nav nav-pills nav-fill p-1 bg-transparent" role="tablist">

                                                <li className="nav-item">
                                                    <button
                                                        className=" btn btn-sm btn-success "
                                                        onClick={() => HandleClick({ 'verify_status': 'approved' })}
                                                    >
                                                        <i className="fa fa-check"> </i>
                                                        <span className="ms-1">Accept</span>
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className=" btn btn-sm btn-danger "
                                                        onClick={() => HandleClick({ 'verify_status': 'rejected' })}

                                                    >
                                                        <i className="fa fa-times"> </i>
                                                        <span className="ms-1">Reject</span>
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <Link
                                                        className=" btn btn-sm btn-primary "
                                                        to={"/editCentre/" + id}

                                                    >
                                                        <i className="fa fa-edit"> </i>
                                                        <span className="ms-1">Edit</span>
                                                    </Link>
                                                </li>


                                            </ul>
                                            :

                                            data.verify_status == 'approved' ?
                                                <ul className="nav nav-pills nav-fill p-1 bg-transparent" role="tablist">
                                                    {
                                                        data.status == 'active' ?
                                                            <li className="nav-item">
                                                                <button
                                                                    className=" btn btn-sm btn-danger "
                                                                    onClick={() => HandleClick({ 'status': 'inactivate' })}

                                                                >
                                                                    <i className="fa fa-times"> </i>
                                                                    <span className="ms-1">Deactivate</span>
                                                                </button>
                                                            </li>
                                                            :
                                                            <li className="nav-item">
                                                                <button
                                                                    className=" btn btn-sm btn-success "
                                                                    onClick={() => HandleClick({ 'status': 'active' })}

                                                                >
                                                                    <i className="fa fa-times"> </i>
                                                                    <span className="ms-1">Activate</span>
                                                                </button>
                                                            </li>
                                                    }


                                                    <li className="nav-item">
                                                        <Link
                                                            className=" btn btn-sm btn-primary "
                                                            to={"/editCenter/" + id}

                                                        >
                                                            <i className="fa fa-edit"> </i>
                                                            <span className="ms-1">Edit</span>
                                                        </Link>
                                                    </li>
                                                </ul>

                                                :

                                                ''

                                        }


                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>



                    <div className="container-fluid mt-n-80 ">
                        <div className="row dashabord-card-list">


                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-gray">
                                    <div className="card-body">
                                        <p className="statistics-title">Online Appointments</p>
                                        <h3 className="rate-percentage">68.8</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-purple">
                                    <div className="card-body">
                                        <p className="statistics-title">Offline Appointments</p>
                                        <h3 className="rate-percentage">68.8</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-primary ">
                                    <div className="card-body">
                                        <p className="statistics-title">Today Appointments</p>
                                        <h3 className="rate-percentage">42</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-yellow ">
                                    <div className="card-body">
                                        <p className="statistics-title">Cancel Appointments</p>
                                        <h3 className="rate-percentage">42</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-danger ">
                                    <div className="card-body">
                                        <p className="statistics-title">Total Earning</p>
                                        <h3 className="rate-percentage">42</h3>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-12 col-xl-4 mt-4">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">
                                        <div className="row">
                                            <div className="col-md-8 d-flex align-items-center">
                                                <h6 className="mb-0">Center Information</h6>
                                            </div>
                                            <div className="col-md-4 text-end">
                                                {/* <a href="javascript:;">
                                                    <i
                                                        className="fas fa-user-edit text-secondary text-sm"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title
                                                        aria-hidden="true"
                                                        data-bs-original-title="Edit Profile"
                                                        aria-label="Edit Profile"
                                                    />
                                                    <span className="sr-only">Edit Profile</span>
                                                </a> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">

                                        {/* <hr className="horizontal gray-light my-4" /> */}
                                        <ul className="list-group">
                                            <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                <strong className="text-dark">Center Name:</strong> &nbsp; {data.name}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Email Address:</strong> &nbsp; {data.email}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Contact:</strong> &nbsp; {data.contact_no}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Address:</strong> &nbsp; {data.address + " " + data.city + " " + data.state + " " + data.pincode}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Number of beds:</strong> &nbsp; {data.total_beds}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Number of Technician:</strong> &nbsp; 200
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Center managed by:</strong> &nbsp; {data.center_manager}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Charge per dialysis:</strong> &nbsp; {data.charges}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Doctor Availability:</strong> &nbsp; No
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of sitting area for family members:</strong> &nbsp; Yes
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of Pharmacy nearby:</strong> &nbsp; yes
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of life-saving drugs:</strong> &nbsp; No
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark"> A number of dialysis performed per month:</strong> &nbsp; 678
                                            </li>


                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div className="col-12 col-xl-4  mt-4">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">
                                        <h6 className="mb-0">Conversations</h6>
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">
                                        <ul className="list-group">
                                            <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                                                <div className="avatar me-3">
                                                    <img
                                                        src="../assets/img/kal-visuals-square.jpg"
                                                        alt="kal"
                                                        className="border-radius-lg shadow"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">Sophie B.</h6>
                                                    <p className="mb-0 text-xs">Hi! I need more information..</p>
                                                </div>
                                                <a
                                                    className="btn btn-link pe-3 ps-0 mb-0 ms-auto"
                                                    href="javascript:;"
                                                >
                                                    Reply
                                                </a>
                                            </li>
                                            <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                                                <div className="avatar me-3">
                                                    <img
                                                        src="../assets/img/marie.jpg"
                                                        alt="kal"
                                                        className="border-radius-lg shadow"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">Anne Marie</h6>
                                                    <p className="mb-0 text-xs">Awesome work, can you..</p>
                                                </div>
                                                <a
                                                    className="btn btn-link pe-3 ps-0 mb-0 ms-auto"
                                                    href="javascript:;"
                                                >
                                                    Reply
                                                </a>
                                            </li>
                                            <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                                                <div className="avatar me-3">
                                                    <img
                                                        src="../assets/img/ivana-square.jpg"
                                                        alt="kal"
                                                        className="border-radius-lg shadow"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">Ivanna</h6>
                                                    <p className="mb-0 text-xs">About files I can..</p>
                                                </div>
                                                <a
                                                    className="btn btn-link pe-3 ps-0 mb-0 ms-auto"
                                                    href="javascript:;"
                                                >
                                                    Reply
                                                </a>
                                            </li>
                                            <li className="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                                                <div className="avatar me-3">
                                                    <img
                                                        src="../assets/img/team-4.jpg"
                                                        alt="kal"
                                                        className="border-radius-lg shadow"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">Peterson</h6>
                                                    <p className="mb-0 text-xs">Have a great afternoon..</p>
                                                </div>
                                                <a
                                                    className="btn btn-link pe-3 ps-0 mb-0 ms-auto"
                                                    href="javascript:;"
                                                >
                                                    Reply
                                                </a>
                                            </li>
                                            <li className="list-group-item border-0 d-flex align-items-center px-0">
                                                <div className="avatar me-3">
                                                    <img
                                                        src="../assets/img/team-3.jpg"
                                                        alt="kal"
                                                        className="border-radius-lg shadow"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">Nick Daniel</h6>
                                                    <p className="mb-0 text-xs">Hi! I need more information..</p>
                                                </div>
                                                <a
                                                    className="btn btn-link pe-3 ps-0 mb-0 ms-auto"
                                                    href="javascript:;"
                                                >
                                                    Reply
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div className="col-12 col-xl-4  mt-4">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">
                                        <h6 className="mb-0">Center Timing</h6>
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">
                                        <button className="btn custom-btn btn-sm"
                                            onClick={() => setShow(true)}
                                        >
                                            Update Time
                                        </button>
                                        <ul className="list-group">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Day</th>
                                                        <th>Opening Time</th>
                                                        <th>Closing</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        centerTime.map((x) => {

                                                            return (
                                                                <tr key={x.day + "" + x._id}>
                                                                    <td>{x.day}</td>
                                                                    <td>{x.opening_time}</td>
                                                                    <td>{x.closing_time}</td>
                                                                    <td><button className="btn btn-danger btn-sm" onClick={() => deleteSlot(x._id)}>Delete</button></td>
                                                                </tr>

                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>

                                        </ul>
                                    </div>
                                </div>
                            </div>




                        </div>

                        {
                            (data.introduction).length > 0 ? <div className="row mt-4">

                                <div className="col-12 col-xl-12">
                                    <div className="card h-100">
                                        <div className="card-header pb-0 p-3">
                                            <h6 className="mb-0">Description</h6>
                                        </div>
                                        <div className="card-body center-profile-card-body p-3">
                                            <p>{data.introduction}</p></div>
                                    </div>
                                </div>

                            </div>
                                : null
                        }


                    </div>




                </div>
            </div>



            <div class={`modal fade ${show == true ? 'show modal-show' : ''}`} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
                <div className="modal-dialog" role="document">
                    <form onSubmit={submitCenterForm}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Center Time</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <lable className="mb-2p">Select Day</lable>
                                    <select
                                        className="form-control days"
                                        name="day"
                                        id="day"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={slot.day}
                                    >
                                        <option value="">Select Day</option>
                                        <option value="Sunday">Sunday</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                    </select>
                                    <span className="form-errors">{errors.day}</span>
                                </div>

                                <div className="form-group">
                                    <lable className="mb-2p">Opening Time</lable>
                                    <input
                                        className="form-control opening_time"
                                        name="opening_time"
                                        type="time"
                                        id="opening_time"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={slot.opening_time}
                                    />
                                    <span className="form-errors">{errors.opening_time}</span>
                                </div>

                                <div className="form-group">
                                    <lable className="mb-2p">Closing Time</lable>
                                    <input
                                        className="form-control closing_time"
                                        name="closing_time"
                                        type="time"
                                        id="closing_time"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={slot.closing_time}
                                    />
                                    <span className="form-errors">{errors.closing_time}</span>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShow(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

        </Layout>
    )
}

export default CenterProfileScreen
