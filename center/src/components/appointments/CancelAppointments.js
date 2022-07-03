import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import Pagination from '../../custom/Pagination';
import ProcessLoader from '../../custom/ProcessLoader';
import Layout from '../../Layout';
import Footer from '../partials/Footer';
import ViewAppointment from './ViewAppointment';
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars"

function CancelAppointments() {

    const [search, setSearch] = useState({ from_date: "", to_date: "", appointment_status: "ne-cancelled", appointment_id: "", patient:'' })
    const [appointmentData, setAppointmentData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [viewData, setViewData] = useState({})
    const [filterData, setFilterData] = useState([])
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
        setLoading(true)
        var url = `private/appointments?from_date=${search.from_date}&to_date=${search.to_date}&appointment_status=cancelled&patient=${search.patient}`
        if(type === 'initial') {
            var url = `private/appointments?appointment_status=cancelled`
        }
        // alert(url)
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

    function changePage(page) {
        setFilterData(appointmentData.slice((page - 1) * limit, page * limit))
    }


    function reset() {
        setSearch({ from_date: "", to_date: "", appointment_status: "ne-cancelled", appointment_id: "",patient:'' })
        getAppointment(1, 'initial')
        currentPage(1)
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
                                                aria-current="page">Cancelled Appointments</li>
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
                                                <button className="btn btn-sm btn-secondary mr-1" onClick={() => reset()}>Reset</button>
                                                <button className="btn btn-sm btn-secondary" onClick={()=>getAppointment(1)}>Search</button>
                                            </div>
                                        </div>



                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Cancelled Appointments</p>
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

                                                            <th>Appt. Id</th>
                                                            <th>Patient Name</th>
                                                            <th>Patient Phone</th>
                                                            <th>Time</th>
                                                            <th>Charges</th>
                                                            <th>Payment</th>

                                                            <th>Reports</th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {
                                                            loading ?
                                                                <tr>
                                                                    <td colSpan={10} className='text-center'>
                                                                        <ProcessLoader />
                                                                    </td>
                                                                </tr>
                                                                :
                                                                filterData.map((x, index) => {

                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{x.appointment_key}</td>
                                                                            <td className='capitalize'><Link to={`/patientProfile/${x.patient_familyMemberId._id}`}>{x.patient_familyMemberId.name}</Link></td>
                                                                            <td>{x.patient_familyMemberId?.user_id?.phone}</td>
                                                                            <td>{moment(x.date, 'DD-MM-YYYY').format('DD/MM/YYYY')} ({x.appointment_start_time})</td>
                                                                            <td>₹ {x.charges}</td>
                                                                            <td>{x.payment_status}</td>

                                                                            {/* <td>{x.reports.length > 0 ? <button className='btn btn-xs btn-primary' onClick={() => {setViewData(x);}}>View Reports</button>:''} </td> */}
                                                                            <td> <button className='btn btn-sm btn-primary' disabled={x.reports.length > 0 ? false : true} onClick={() => { setViewData(x); }}>View Reports</button> </td>


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

                                    {
                                        totalPages > 1 ?
                                            <Pagination callbackFunction={changePage} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                            : ''
                                    }

                                    {/* <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-end">
                                            <li className={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
                                                <a className="page-link" href="#" onClick={e => { getAppointment(currentPage - 1) }}>
                                                    Previous
                                                </a>
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
                                                <a className="page-link" onClick={e => { getAppointment(currentPage + 1) }}>
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </nav> */}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {
                    viewData._id ? <ViewAppointment viewData={viewData} setViewData={setViewData} /> : ''
                }


                {/* content-wrapper ends */}
                {/* partial:partials/_footer.html */}
                <Footer />
                {/* partial */}
            </div>
            {/* main-panel ends */}


        </Layout>


    )
}
export default CancelAppointments;
