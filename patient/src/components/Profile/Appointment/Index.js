import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { socket } from '../../../context/sokcet';
import ViewModal from './ViewModal';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import Pagination from '../../../ReusableComponents/Pagination';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
import { env } from '../../../env';
import useGlobalContexts from '../../../context/GlobalContext';


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}



function Appointment() {

    const [appointmentModal, setAppointmentModal] = useState(false)

    const [rescheduleStatus, setRescheduleStatus] = useState(false)
    const [appointmentDetail, setAppointmentDetail] = useState({})
    const [appointments, setAppointments] = useState([])
    const [filterAppointments, setFilterAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState({})
    const [attachmentModal, setAttachmentModal] = useState(false)
    const limit = 10;
    const [reports, setReports] = useState({ appointmentId: '', reports: [] })

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [reportData, setReportData] = useState([])
    const { setLoaderState } = useGlobalContexts()
    const [profileData, setProfileData] = useState({})
    useEffect(() => {
        getAppointments()
        getProfile()
    }, [])
    function getAppointments() {
        setLoading(true)

        setSearch({ select: "", date: '' })
        var url = `patients/api/list-appointment?appointment_status=ne-cancelled`
        // var url = `patients/api/list-appointment`
        axiosBaseUrl.get(url)
            .then((res) => {
                // console.log(res.data.data.doc);
                setAppointments(res.data.data.doc)
                setFilterAppointments(res.data.data.doc)

                setTotalPages(Math.ceil(res.data.data.doc.length / limit))
                setLoading(false)

            }).catch(error => {
                console.log(error)

            })
    }


    function getProfile() {

        axiosBaseUrl.get(`patients/api/profile`)
            .then((res) => {
                setProfileData(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }


  

    function filterData(value, type) {
        // var search = 

        var search_data = { ...search }
        search_data[type] = value;
        setSearch(search_data)
        if (type == 'select') {
            if (value == 'today') {
                const filterData = appointments?.filter((x) => {

                    if (x.date.includes(moment().format('DD-MM-YYYY'))) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)

                console.log(filterData);

            }
            else if (value == 'week') {



                var startDate = moment().startOf('week').format('DDMMYYYY');

                var endDate = moment().endOf('week').format('DDMMYYYY');
                console.log(startDate, "-", endDate)
                const filterData = appointments?.filter((x) => {
                    console.log(moment(x.date, 'DDMM-YYYY'));

                    if (parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) >= parseInt(startDate) && parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) <= parseInt(endDate)) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)
            }
            else if (value == 'month') {



                var startDate = moment().startOf('month').format('DDMMYYYY');

                var endDate = moment().endOf('month').format('DDMMYYYY');
                console.log(startDate, "-", endDate)
                const filterData = appointments?.filter((x) => {
                    console.log(moment(x.date, 'DDMM-YYYY'));

                    if (parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) >= parseInt(startDate) && parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) <= parseInt(endDate)) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)
            }
            else if (value == 'year') {



                var startDate = moment().startOf('year').format('DDMMYYYY');

                var endDate = moment().endOf('year').format('DDMMYYYY');
                console.log(startDate, "-", endDate)
                const filterData = appointments?.filter((x) => {
                    console.log(moment(x.date, 'DDMM-YYYY'));

                    if (parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) >= parseInt(startDate) && parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) <= parseInt(endDate)) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)
            }
            else {
                setTotalPages(Math.ceil(appointments.length / limit))
                setFilterAppointments(appointments)
            }
        }
        else {
            // console.log(e.target.value)
            var search = value
            const filterData = appointments?.filter((x) => {
                if (search == '') return x;
                else if (x.date.includes(moment(search, 'YYYY-MM-DD').format('DD-MM-YYYY'))) {
                    return x;
                }


            });
            setTotalPages(Math.ceil(filterData.length / limit))
            // setTotalPages(Math.ceil(filterData.length / limit))
            setFilterAppointments(filterData)

            console.log(filterData);
        }


    }


    function cancelAppointment(id, centre_id) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
            cancelButtonText : 'No',
        }).then((result) => {
            setLoaderState(true)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`patients/api/cancel-appointment/${id}`)
                    .then((res) => {
                     
                        Swal.fire('Cancelled!', 'Appointment is successully cancelled', 'success')
                        getAppointments()
                        socket.emit("notification", centre_id, res.data.data);
                        setLoaderState(false)
                        setAppointmentModal(false)

                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                setLoaderState(false)
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    function changePage(page) {
        // alert((page-1)*limit)
        console.log(filterAppointments, "-------------")
        // setFilterAppointments(filterAppointments.slice((page-1)*limit,page*limit))
    }

    function patientReports(appointment, id) {
        // setAppointmentId(appointmentId)
        setLoading(true)
        setReportData(appointment.reports)

        axiosBaseUrl.get(`patients/api/reports?patientId=${id}`)
            .then((res) => {


                setReports({ appointmentId: appointment._id, reports: res.data.data.doc })
                setLoading(false)


            }).catch(error => {
                console.log(error)

            })
    }



    async function displayRazorpay(data) {
        // alert("test")
        console.log(data, 'razor pay')
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        // checking if the script is added or not
        if (!res) {

            alert("Unable to load the the script")
            return
        }

        var appointment = data
        var charges = data.charges;
        var appointment_id = data._id;
        // Making an Post api call to the server to proceed the payment
        data = await fetch(`${env.baseUrl}razorpay?total=${data.charges * 100}`, { method: 'POST' }).then((t) =>
            t.json()
        )

        const options = {
            // key: "rzp_test_t9VIr7uZmekfPI", // Enter the Key ID generated from the Dashboard
            key: env.razorpay_key,
            "amount": charges * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": 'INR',
            "name": "Book Care",
            "description": "Test Transaction",
            "image": env.razorpay_logo,
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                // alert("Payment ID: ",response.razorpay_payment_id);
                // alert("Order ID: ",response.razorpay_order_id);
                // alert("Razorpay Signature: ",response.razorpay_signature)
                createTransaction(data.id, charges, appointment._id, response.razorpay_payment_id, appointment)
           
            },
            "error": function (response) {
             
                alert("ERR")
            },
            "prefill": {
                "name": profileData.name,
                "email": profileData.email,
                "contact": profileData.phone
            },

        };
        setLoaderState(false)

        // Open the payment window on the screen
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }


    function createTransaction(order_id, amount, appointment_id, transaction_id, appointment) {
        var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'appointment' };
     
        axiosBaseUrl.post(`patients/api/create-transaction`, data)
            .then((res) => {
             
                // alert("succes")

                setLoaderState(false)
                // socket.emit("notification", appointment.center_id._id, res.data.notification);
                // socket.emit("book-slot", { centerId:appointment.center_id._id, date: appointment.date, data: res.data.notification });
                Swal.fire("", `payment is successfully done of ${appointment.appointment_key}`, 'success')
                getAppointments()
               

            }).catch(error => {
                

            })
    }


    return (
        <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
        >
            <div className="row">
                <div className="col-md-2" />
                <div className="col-5 col-md-3 relative appointment-calendar">
                    <span className='d-flex'>
                        {" "}
                        <i className="fa fa-calendar fa-si-color" /> <span className='color-secondary ml-1'>{search['date'] ? moment(search['date']).format('DD MMM YY') : "Select a Date"}</span>
                    </span>
                    <DatePickerComponent
                        id="datepicker"

                        onChange={(e) => {

                            // console.log(e.target.value)
                            filterData(e.target.value !== null ? moment(e.target.value).format('YYYY-MM-DD') : '', 'date')
                        }}

                    />
                    <div className="dissis-top44" />
                </div>
                <div className="col-5 col-md-3">
                    <select
                        className="form-select slctcss"
                        aria-label="Default select example"
                        onChange={(e) => filterData(e.target.value, 'select')} value={search.select}
                    >
                        <option value="">Select</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <div className="col-1 col-md-2">
                    <a className="rest" onClick={() => { getAppointments() }}>
                        Reset
                    </a>
                </div>
            </div>
            {

                loading ?
                    <div className='text-center'>
                        <ProcessLoader />
                    </div>
                    :
                    filterAppointments.length == 0 ?

                        <div className='text-center mt-5'>
                            <h5 className='text-center text-theme-color'>Appointment are not available</h5>
                        </div>


                        :


                        filterAppointments.slice((currentPage - 1) * limit, currentPage * limit).map((appointment, index) => {
                            return (
                                <>
                                    <div className="card shadow sp_csg">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-3 col-3 patient">
                                                    <div className="user-Css mt-5">
                                                        <div className='profile-icon'>
                                                            <p>
                                                                {appointment.patient_familyMemberId?.name?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}
                                                            </p>
                                                        </div>

                                                        <div className='patient-name'>
                                                            <span className="patn-css">
                                                                <div>
                                                                    Patient: 
                                                                    {/* {appointment._id} */}
                                                                </div>
                                                                <div className='capitalize'>
                                                                    {appointment.patient_familyMemberId?.name}
                                                                </div>

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-9 col-9">
                                                    <div className='appointment-desc'>
                                                        <div className='row'>
                                                            <div className='col-md-8'>
                                                                <h4 className="title mac-css capitalize font-600"><Link to={`/centre/${appointment.center_id._id}`}>{appointment.center_id?.name}</Link></h4>
                                                                <span className="post pposcs">{appointment.center_id?.area + ", " + appointment.center_id?.city}</span>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <h4 className="sssti-c pposcs capitalize">
                                                                    Status: <br /> {appointment.appointment_status}{" "}
                                                                </h4>
                                                            </div>

                                                        </div>
                                                        <hr />
                                                        <div>
                                                            <div className="sp_date">
                                                                <span className="badge bg-bgd-bg  mb-3">{moment(appointment.date, 'DD-MM-YYYY').format('D MMM ‘YY')}</span>
                                                                <span className="badge bg-bgd-bg  mb-3">{appointment.appointment_start_time}</span>

                                                                {
                                                                    appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id) ?
                                                                        <Link className="pposcs  mb-3"
                                                                            to={{
                                                                                pathname: `/centre/${appointment.center_id._id}`,
                                                                                state: {
                                                                                    appointment_id: appointment._id,
                                                                                }
                                                                            }}
                                                                        >Reschedule</Link>

                                                                        : ''


                                                                }

                                                                <div className="dissis-top" />
                                                                <span className="pposcs dissis">
                                                                    Dialysis takes upto 3-4 hours
                                                                </span>
                                                            </div>

                                                        </div>
                                                        <div className="text-right mt-3">
                                                            <button className="know__nore" onClick={() => { setAppointmentDetail(appointment); setAppointmentModal(true); }}>
                                                                Know more
                                                            </button>
                                                            {
                                                                appointment.payment_status === 'pending' && appointment.appointment_status === 'cancelled' ? 
                                                                <button className="cancel__css" onClick={() => displayRazorpay(appointment)}>
                                                                Pay
                                                            </button>
                                                            : ''
                                                            }
                                                           




                                                            {
                                                                appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt() ?
                                                                    <button className='cancel__css' onClick={() => { cancelAppointment(appointment._id, appointment.center_id._id) }}>Cancel</button>


                                                                    : ''
                                                            }

                                                            {/* <button className='cancel__css' onClick={() => { cancelAppointment(appointment._id, appointment.center_id._id) }}>Cancel</button> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <br />
                                </>
                            )
                        })
            }
            <ViewModal appointmentModal={appointmentModal} setAppointmentModal={setAppointmentModal} appointment={appointmentDetail} cancelAppointment={cancelAppointment} getAppointments={getAppointments} />
            {
                totalPages > 1 ?
                    <Pagination callbackFunction={changePage} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                    : ''
            }
        </div>
    );
}


export default Appointment;
