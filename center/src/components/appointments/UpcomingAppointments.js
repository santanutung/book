import React, { useState, useEffect } from 'react'
import Layout from '../../Layout';
import { appointment_status, payment_status } from '../../rawData/AppointmentStatus';
import Footer from '../partials/Footer';
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl';
import AppointmentTable from '../../custom/List/AppointmentTable';
import { socket } from '../../context/socket';
import useGlobalContexts from '../../context/GlobalState';
import moment from 'moment-timezone';

import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars"

function UpcomingAppointments() {

    const app_status = appointment_status

    const [appointmentData, setAppointmentData] = useState([])
    const [search, setSearch] = useState({ from_date: "", to_date: "", appointment_status: "ne-cancelled", appointment_id: "", patient: '' })
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])
    const [loading, setLoading] = useState(false)
    const { setLoaderState } = useGlobalContexts()
    const [viewData, setViewData] = useState({})
    const [filterData, setFilterData] = useState([])
    const [errors, serErrors] = useState({})
    var limit = 10
    useEffect(() => {
        getAppointment(1, 'initial')

    }, [])


    const handleChangeInput = (e) => {
        const newData = { ...search }
        newData[e.target.name] = e.target.value
        setSearch(newData)
    }


    function getAppointment(page, type) {
        // console.log(page)
        // console.log(search)
     
        serErrors({})
        if (parseInt(moment().format('YYYYMMDD')) > parseInt(moment(search.from_date).format('YYYYMMDD'))) {
            serErrors({ 'from_date': "from date must be greate then or equal to current date" })
        }
        else {
            setLoading(true)

            var url = `private/appointments?type=upcoming&from_date=${search.from_date}&to_date=${search.to_date}&patient=${search.patient}`
            if (search.appointment_status == 'all') {
                url += `&appointment_status=ne-cancelled`
            }
            else {
                url += `&appointment_status=${search.appointment_status}`
            }

            if(type == 'initial') {
                // alert(moment().add(1, 'days').format('YYYY-MM-DD'))
                var url = `private/appointments?type=upcoming&appointment_status=ne-cancelled&from_date=${moment().add(1, 'days').format('YYYY-MM-DD')}`;
            }
           

            axiosBaseUrl.get(url)
                .then((res) => {
                    // console.log(res.data)
                    setAppointmentData(res.data.data)
                    setTotalPages(Math.ceil(res.data.data.length / limit))
                    setLoading(false)
                    setFilterData(res.data.data.slice((currentPage - 1) * limit, currentPage * limit))

                }).catch(error => {
                    // console.log(error)
                    if (error.response) {
                        Swal.fire(error.response.data.error, '', 'error')


                    }
                    else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                })
        }

    }

    function changePage(page) {
        setFilterData(appointmentData.slice((page - 1) * limit, page * limit))
    }

    const cancelAppointment = (id, appointment_key) => {
        Swal.fire({
            title: 'Do you want to cancel ' + appointment_key + ' appointment?',
            showCancelButton: true,
            confirmButtonText: `Save`,
        }).then((result) => {
            if (result.isConfirmed) {

                setLoaderState(true)

                axiosBaseUrl.put(`private/appointment-cancel/${id}`)
                    .then((res) => {
                        setLoaderState(false)
                        socket.emit("notification", res.data.user_id + "user", res.data.notification);
                        Swal.fire('', 'Appointment is successfully cancelled', 'success')
                        getAppointment(1)


                    }).catch(error => {
                        // console.log(error)

                    })


            }
            else {

            }
        });
    }



    const updateStatusHandler = (id, status) => {

        let placeholder = "";

        if (status == 'pending') {
            placeholder = "Enter Weight before dialysis"
        }
        else {
            placeholder = "Enter Weight after dialysis"
        }
        var weight = 0;

        Swal.fire({
            title: 'Update Status',
            html: ` <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <input id="after_weight" class="form-control search input-box" name="after_weight"  placeholder="${placeholder}"/>
                            </div>
                        </div>
                    </div>`,
            confirmButtonText: 'Update',
            focusConfirm: false,
            showCancelButton: true,

            preConfirm: () => {
                const after_weight = Swal.getPopup().querySelector('#after_weight').value
                if (!after_weight) {

                    if (status == 'pending') {
                        Swal.showValidationMessage(`Please Enter Before Dialysis Weight`)

                    }
                    else {
                        Swal.showValidationMessage(`Please Enter After Dialysis Weight`)
                    }
                }
                else {
                    weight = after_weight

                }
                return { afterWeight: after_weight }
            }
        }).then((result) => {
            // console.log("result ", result)

            var data = { 'appointment_status': status === 'pending' ? "ongoing" : "completed" }
            if (status == 'pending') {
                data['before_weight'] = weight
            }
            else {
                data['after_weight'] = weight
                data['payment_status'] = 'complete'
            }

            if (result.isConfirmed == true) {
                axiosBaseUrl.put(`private/center/appointment/${id}`, data)
                    .then((res) => {
                        // console.log(res)
                        if (res.data.notification) {

                            socket.emit("notification", res.data.apt.userId + "user", res.data.notification);
                        }


                        getAppointment(currentPage)
                        Swal.fire("Weight is successfully updated", '', 'success')

                    }).catch(error => {
                        // console.log(error)
                        if (error.response) {
                            Swal.fire(error.response.data.error, '', 'error')


                        }
                        else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                    })


                // console.log(result.value.afterWeight, " and ", result.value.updatedStatus)
            }

        })
    }

    function resetSearch() {

        // socket.emit("notification", "61d02a1353a0a4f4e0951b3buser", {message:"hello"});
        setSearch({ from_date: "", to_date: "", appointment_status: "", appointment_id: "", patient: '' });
        getAppointment(1, "initial")
        setCurrentPage(1)
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
                                            <li className="breadcrumb-item"
                                            ><a href="/dashboard">Dashboard</a></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Upcoming Appointments</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Filters</p>
                                    <div className="row">



                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">
                                                <label>From Date - To Date</label>

                                                <div className='relative'>
                                                    <input className='form-control' value={search.from_date ? moment(search.from_date, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' - ' + moment(search.to_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'DD/MM/YYYY - DD/MM/YYYY'} />
                                                    <i class="fa fa-calendar" aria-hidden="true"></i>

                                                    <DateRangePickerComponent
                                                        placeholder="From Date - To Date"
                                                        min={new Date()}
                                                        onChange={(e) => {

                                                            const newData = { ...search }
                                                            newData['from_date'] = e.target.value !== null ? moment(e.target.value[0]).format('YYYY-MM-DD') : ''
                                                            newData['to_date'] = e.target.value !== null ? moment(e.target.value[1]).format('YYYY-MM-DD') : ''
                                                            setSearch(newData)
                                                        }}

                                                        format="dd-MMM-yy"
                                                    />

                                                </div>

                                            </div>
                                        </div>


                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">

                                                <label>Appointment Status</label>

                                                <select
                                                    className="form-control"
                                                    name="appointment_status"
                                                    onChange={(e) => handleChangeInput(e)}
                                                    value={search.appointment_status}
                                                >
                                                    <option value="ne-cancelled">Select Appointment status</option>

                                                    {
                                                        app_status.map((x, index) => {

                                                            return (
                                                                <option key={index} value={x.status.toLowerCase()}>{x.status}</option>

                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3">
                                                <label>Patient Name, Contact No.</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search By Patient Name and Contact No."
                                                    name="patient"
                                                    onChange={(e) => handleChangeInput(e)}
                                                    value={search.patient}
                                                />
                                            </div>
                                        </div>





                                        <div className="col-12 d-flex flex-column justify-content-start">
                                            <div className="ml-xl-4 mt-3 text-right">
                                                <button className="btn btn-sm btn-secondary mr-1" onClick={() => resetSearch()}>Reset</button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => getAppointment(1)}>Search</button>
                                                {/* <button className="btn btn-sm btn-secondary" onClick={filterData}>Search</button> */}
                                            </div>
                                        </div>



                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>



                    <AppointmentTable tableHeading={"Upcoming Appointments"} appointmentData={filterData} updateStatusHandler={updateStatusHandler} cancelAppointment={cancelAppointment} getAppointment={changePage} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} pages={pages} loading={loading} viewData={viewData} setViewData={setViewData} />


                    {/* <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Upcoming Appointments</p>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="table-responsive">
                                                <table
                                                    id="example"
                                                    className="display expandable-table"
                                                    style={{ width: "100%" }}
                                                >
                                                    <thead>
                                                        <tr>

                                                            <th>Appointment Id</th>
                                                            <th>Patient Name</th>
                                                            <th>Patient Phone</th>
                                                            <th>Appointment Date</th>
                                                            <th>Appointment Time</th>
                                                            <th>Charges</th>
                                                            <th>Payment Status</th>
                                                            <th>Appointment Status</th>
                                                            <th>Before Dialysis(W)</th>
                                                            <th>After Dialysis(W)</th>
                                                            <th>Update</th>
                                                            <th>Cancel Appointment</th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {
                                                            appointmentData.map((x, index) => {

                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{x.appointment_id}</td>
                                                                        <td><Link to={`/patientProfile/${x.patient_familyMemberId._id}`}>{x.patient_familyMemberId.name}</Link></td>
                                                                       <td>{x.patient_familyMemberId.phone}</td>
                                                                        <td>{x.date}</td>
                                                                        <td>{x.appointment_start_time}</td>
                                                                        <td>{x.charges}</td>
                                                                        <td>{x.payment_status}</td>
                                                                        <td>

                                                                            {
                                                                                x.appointment_status == "Pending" ?

                                                                                <label className="badge badge-info">Pending</label>
                                                                                : x.appointment_status == "ongoing" ?
                                                                                    <label className="badge badge-warning">On Going</label>
                                                                                    : x.appointment_status == "cancelled" ?
                                                                                        <label className="badge badge-danger">Cancelled</label>
                                                                                        :
                                                                                        <label className="badge badge-success">Completed</label>

                                                                            }
                                                                        </td>
                                                                        <td>{x.before_weight}</td>
                                                                        <td>{x.after_weight}</td>
                                                                        <td>
                                                                            <button className="btn custom-btn btn-sm" disabled={(x.appointment_status === "cancelled" || x.appointment_status === "completed") ? true : false}
                                                                                onClick={() => updateStatusHandler(x._id, x.appointment_status)}
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        </td>

                                                                        <td>
                                                                            <button className="btn btn-danger btn-sm" disabled={x.appointment_status != "pending" ? true : false}
                                                                                onClick={() => cancelAppointment(x._id, x.appointment_id)}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </td>


                                                                    </tr>

                                                                )
                                                            })
                                                        }

                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">

                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-end">
                                            <li className={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
                                                <button className="page-link" disabled={currentPage == 1 ? false : true} onClick={e => { getAppointment(currentPage - 1) }}>
                                                    Previous
                                                </button>
                                            </li>


                                            {
                                                pages.map(pageNumber => {
                                                    return pageNumber < totalPages ?
                                                        <li className="page-item">
                                                            <a className="page-link" onClick={e => { getAppointment(pageNumber) }}>
                                                                {pageNumber}
                                                            </a>
                                                        </li>
                                                        :
                                                        ""
                                                })
                                            }

                                            <li className={currentPage == totalPages ? 'page-item disabled' : 'page-item'} >
                                                <button className="page-link" disabled={currentPage === totalPages ? true : false} onClick={e => { getAppointment(currentPage + 1) }}>
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div> */}

                </div>


                {/* content-wrapper ends */}
                {/* partial:partials/_footer.html */}
                <Footer />
                {/* partial */}
            </div>
            {/* main-panel ends */}


        </Layout>


    )
}

export default UpcomingAppointments
