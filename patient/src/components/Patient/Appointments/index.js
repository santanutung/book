import moment from 'moment-timezone'
import React, { useState, useEffect } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../../axiosBaseUrl'
import { socket } from '../../../context/sokcet'
import Pagination from '../../../ReusableComponents/Pagination'
import ProcessLoader from '../../../ReusableComponents/ProcessLoader'
import Attachments from './Attachments'
import Reschedule from './Reschedule'
import ViewModal from './ViewModal'

function Appointments() {
    const [appointmentModal, setAppointmentModal] = useState(false)

    const [rescheduleStatus, setRescheduleStatus] = useState(false)
    const [appointmentDetail, setAppointmentDetail] = useState({})
    const [appointments, setAppointments] = useState([])
    const [filterAppointments, setFilterAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState({})
    const [attachmentModal, setAttachmentModal] = useState(false)
    const limit = 10;
    const [reports, setReports] = useState({appointmentId : '', reports:[]})

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [reportData, setReportData] = useState([])


    useEffect(() => {
        getAppointments()
    }, [])
    function getAppointments() {
        setLoading(true)
     
        setSearch({select : "", date : ''})
        axiosBaseUrl.get(`patients/api/list-appointment?appointment_status=ne-cancelled`)
            .then((res) => {
              
                setAppointments(res.data.data.doc)
                setFilterAppointments(res.data.data.doc)

                setTotalPages(Math.ceil(res.data.data.doc.length / limit))
                setLoading(false)

            }).catch(error => {
                console.log(error)

            })
    }

    function filterData(e, type) {
        // var search = 

        var search_data = {...search}
        search_data[type] = e.target.value;
        setSearch(search_data)
        if (type == 'select') {
            if (e.target.value == 'today') {
                const filterData = appointments?.filter((x) => {

                    if (x.date.includes(moment().format('DD-MM-YYYY'))) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)

             

            }
            else  if (e.target.value == 'week')  {

                 

                var startDate = moment().startOf('week').format('DDMMYYYY');

                var endDate = moment().endOf('week').format('DDMMYYYY');
              
                const filterData = appointments?.filter((x) => {
                  
                    if (parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) >= parseInt(startDate) && parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) <= parseInt(endDate)) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)
            }
            else  if (e.target.value == 'month')  {

                 

                var startDate = moment().startOf('month').format('DDMMYYYY');

                var endDate = moment().endOf('month').format('DDMMYYYY');
            
                const filterData = appointments?.filter((x) => {
                   

                    if (parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) >= parseInt(startDate) && parseInt(moment(x.date, 'DD-MM-YYYY').format('DDMMYYYY')) <= parseInt(endDate)) {
                        return x;
                    }


                });
                setTotalPages(Math.ceil(filterData.length / limit))
                setFilterAppointments(filterData)
            }
            else  if (e.target.value == 'year')  {

                 

                var startDate = moment().startOf('year').format('DDMMYYYY');

                var endDate = moment().endOf('year').format('DDMMYYYY');
            
                const filterData = appointments?.filter((x) => {

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
         
            var search = e.target.value
            const filterData = appointments?.filter((x) => {
                if(search == '') return x;
                else if (x.date.includes(moment(search, 'YYYY-MM-DD').format('DD-MM-YYYY'))) {
                    return x;
                }


            });
            setTotalPages(Math.ceil(filterData.length / limit))
            // setTotalPages(Math.ceil(filterData.length / limit))
            setFilterAppointments(filterData)

        
        }

     
    }

    function cancelAppointment(id, centre_id) {
    
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Cancel`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`patients/api/cancel-appointment/${id}`)
                    .then((res) => {
                    
                        Swal.fire('Cancel!', 'Appointment is successully cancelled', 'success')
                        getAppointments()
                        socket.emit("notification", centre_id, res.data.data); 


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    function changePage(page) {
       
    }

    function patientReports(appointment, id) {
        // setAppointmentId(appointmentId)
        setLoading(true)
        setReportData(appointment.reports)
        
        axiosBaseUrl.get(`patients/api/reports?patientId=${id}`)
            .then((res) => {


                setReports({appointmentId:appointment._id, reports:res.data.data.doc})
                setLoading(false)


            }).catch(error => {
                console.log(error)

            })
    }

    return (
        <>
            <div className="row">


                <div className="col-lg-12 grid-margin stretch-card mt-5">
                    <div className="card">
                        <div className="card-body">

                            <div className='row'>
                                
                                <div className='col-md-3'>
                                    <lable>Date Filter</lable>
                                    <input className='form-control' type="date" onChange={(e) => filterData(e, 'date')} value={search.date} />
                                </div>
                                <div className='col-md-3'>
                                    <lable>Other Filters </lable>
                                    <select className='form-control' onChange={(e) => filterData(e, 'select')} value={search.select}>
                                        <option value="">Select</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="year">This Year</option>
                                    </select>
                                </div>
                                <div className='col-md-3'>
                                    <lable></lable>
                                    <button className='btn btn-sm btn-primary mt-4' onClick={() => { getAppointments()}}>Reset</button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>Patient Name</th>
                                            <th>Centre</th>
                                            <th>Date</th>
                                            <th>Slot</th>
                                            <th>Cancel</th>
                                            <th>Reschedule</th>
                                            <th>Attachments</th>
                                            <th>View</th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {

                                            loading ?
                                                <tr>
                                                    <td colSpan={8} className='text-center'>
                                                        <ProcessLoader />
                                                    </td>
                                                </tr>
                                                :
                                                filterAppointments.length == 0 ?

                                                <tr>
                                                    <td colSpan={8}>
                                                        <h6 className='text-center'>Appointment are not available</h6>
                                                    </td>
                                                </tr>

                                                :
                                                filterAppointments.slice((currentPage-1)*limit,currentPage*limit).map((appointment, index) => {
                                                    return (
                                                        <tr key={appointment._id + 'appointment'}>
                                                            <td>{[appointment.patient_familyMemberId?.name]}</td>
                                                            <td><Link to={`/centre/${appointment.center_id._id}`}>{appointment.center_id?.name}</Link></td>
                                                            <td>{moment(appointment.date, 'DD-MM-YYYY').format('DD/MM/YYYY')}</td>
                                                            <td>{appointment.appointment_start_time + " - " + appointment.appointment_end_time}</td>
                                                            <td>
                                                                {
                                                                    appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id) ? 
                                                                <button className='btn btn-sm btn-secondary' onClick={() => { cancelAppointment(appointment._id, appointment.center_id._id) }}>Cancel</button>

                                                                        : appointment.appointment_status
                                                                }
                                                                </td>
                                                                <td>
                                                                {
                                                                    appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id) ? 
                                                                <button className='btn btn-sm btn-secondary' onClick={() => {setAppointmentDetail(appointment);setRescheduleStatus(true)}}>Reschedule</button>
:''
                                                                      
                                                                }
                                                                </td>
                                                                <td>
                                                                    <button className='btn btn-sm btn-secondary'  onClick={() => { setAppointmentDetail(appointment); setAttachmentModal(true); patientReports(appointment, appointment.patient_familyMemberId._id) }}>Attach</button>
                                                                </td>

                                                            <td><button className='btn btn-sm btn-secondary' onClick={() => { setAppointmentDetail(appointment); setAppointmentModal(true) }}>View</button></td>

                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {
                            totalPages > 1  ?
                        <Pagination callbackFunction={changePage}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                        }
                        </div>

                    </div>
                </div>


            </div>
            <Reschedule rescheduleStatus={rescheduleStatus} setRescheduleStatus={setRescheduleStatus} appointmentDetail={appointmentDetail} getAppointments={getAppointments}/>
            
            {rescheduleStatus ?
            <Reschedule rescheduleStatus={rescheduleStatus} setRescheduleStatus={setRescheduleStatus} appointmentDetail={appointmentDetail} getAppointments={getAppointments}/> :
            ""
            }
            <Attachments attachmentModal={attachmentModal} setAttachmentModal={setAttachmentModal} reports={reports} reportData={reportData} setReportData={setReportData}/>

            {appointmentModal ? <ViewModal setAppointmentModal={setAppointmentModal} appointmentDetail={appointmentDetail} getAppointments={getAppointments}/> : ''}
        </>
    )
}

export default Appointments
