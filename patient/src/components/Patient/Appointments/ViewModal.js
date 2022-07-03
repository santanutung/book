import moment from 'moment-timezone';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import useGlobalContexts from '../../../context/GlobalContext';
import { socket } from '../../../context/sokcet';
import { env } from '../../../env';
import Slots from './Slots';

function ViewModal(props) {
    const { setAppointmentModal, appointmentDetail, getAppointments } = props
  
    const { setLoaderState } = useGlobalContexts()
    // const  [rescheduleStatus, setRescheduleStatus] = useState(false)
    const  [selectedslot, setSelectedslot] = useState('')

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
                        socket.emit("cancel-appointment", centre_id);


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function bookAppointment() {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Cancel`,
        }).then((result) => {

            setLoaderState(true)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`patients/api/reschedule-appointment/${appointmentDetail._id}`, {slot_id : selectedslot})
                    .then((res) => {
                        setLoaderState(false)
                        Swal.fire('Reschedule!', 'Appointment is successully reschedule', 'success')
                        getAppointments()
                        setAppointmentModal(false)
                        socket.emit("notification", appointmentDetail.center_id._id, res.data.data); 
                        // socket.emit("cancel-appointment",  appointmentDetail.center_id._id);


                    }).catch(error => {
                        setLoaderState(false)
                        console.log(error)

                    })




            } 
        });
    }


    return (
        <>
            <div
                className="modal fade show"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            // style={{ display: 'none' }}
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => setAppointmentModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <div className="row">

                                <div className='col-md-6'>

                                    <Link to={`/centre/${appointmentDetail.center_id._id}`}> <img src={env.imageurl + appointmentDetail.center_id.primaryImage} width="100%" className='modal-center-image' /></Link>
                                </div>
                                {/* <div className='col-md-8'>
<p>
    <strong>Center Name : {appointmentDetail.center_id.name}</strong>
</p>
</div> */}
                                {/* <div className='col-md-8'></div> */}

                                <div className="form-group col-md-6 mt-2">


                                    <table className="table table-borderless">
                                        <tr height="35px">
                                            <th>Appointment Id : </th>
                                            <td> {appointmentDetail.appointment_key}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Centre Name : </th>
                                            <td><Link to={`/centre/${appointmentDetail.center_id._id}`} className='p-0'>{appointmentDetail.center_id.name}</Link></td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Patient Name : </th>
                                            <td>{appointmentDetail.patient_familyMemberId.name}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Appointment Date : </th>
                                            <td>{moment(appointmentDetail.date, 'DD-MM-YYYY').format('DD/MM/YYYY')}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Appointment Time : </th>
                                            <td>{appointmentDetail.appointment_start_time + " - " + appointmentDetail.appointment_end_time}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Before Dialysis(W) : </th>
                                            <td>{appointmentDetail.before_weight}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>After Dialysis(W) : </th>
                                            <td>{appointmentDetail.after_weight}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Charges : </th>
                                            <td> {appointmentDetail.charges} (INR)</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Payment Type : </th>
                                            <td>{appointmentDetail.payment_type}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Payment Status : </th>
                                            <td>{appointmentDetail.payment_status}</td>
                                        </tr>
                                        <tr height="35px">
                                            <th>Appointment  Status : </th>
                                            <td>{appointmentDetail.appointment_status}</td>
                                        </tr>
                                    </table>

                                    <strong className='text-danger'>Disclaimer :  Upload a document or to carry physical documents</strong>



                                </div>




                            </div>
{/* 
                            {
                                rescheduleStatus ? 
                                <div>
                                <Slots centerId={appointmentDetail.center_id._id} selectedslot={selectedslot} setSelectedslot={setSelectedslot}/>
                                </div>
                                :
                                ''

                            } */}
                           



                        </div>
                        <div className="modal-footer">
                            {/* {
                                appointmentDetail.appointment_status === 'pending' && rescheduleStatus == false ?
                                <>
                                    <button className='btn btn-sm btn-secondary' onClick={() => setRescheduleStatus(true)}>Reschedule</button>

                                    <button className='btn btn-sm btn-secondary' onClick={() => { cancelAppointment(appointmentDetail._id, appointmentDetail.center_id._id) }}>Cancel Appointment</button>
                                    </>
                                    :  <button className='btn btn-sm btn-primary' onClick={(e) => bookAppointment()} >Book Appointment</button>
                            } */}

                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setAppointmentModal(false)}
                            >
                                Close
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewModal
