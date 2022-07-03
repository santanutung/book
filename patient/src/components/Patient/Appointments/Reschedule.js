import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import useGlobalContexts from '../../../context/GlobalContext';
import { socket } from '../../../context/sokcet';
import Slots from './Slots'

function Reschedule(props) {
    const { rescheduleStatus, setRescheduleStatus, appointmentDetail, getAppointments } = props


    const { setLoaderState } = useGlobalContexts()
    // const  [rescheduleStatus, setRescheduleStatus] = useState(false)
    const [selectedslot, setSelectedslot] = useState('')

    function bookAppointment() {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
        }).then((result) => {

            setLoaderState(true)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`patients/api/reschedule-appointment/${appointmentDetail._id}`, { slot_id: selectedslot })
                    .then((res) => {
                        setLoaderState(false)
                        Swal.fire('Reschedule!', 'Appointment is successully reschedule', 'success')
                        getAppointments()
                        setRescheduleStatus(false)
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
<Modal
        show={rescheduleStatus}
        onHide={() => setRescheduleStatus(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
       
        </Modal.Header>
        <Modal.Body>
        <div>
                        <Slots centerId={appointmentDetail.center_id?._id} selectedslot={selectedslot} setSelectedslot={setSelectedslot} />
                    </div>

        </Modal.Body>
        <Modal.Footer>
                    <button className='btn btn-sm btn-primary' onClick={(e) => bookAppointment()} >Book Appointment</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => setRescheduleStatus(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
      </Modal>

            {/* <Modal size="lg" show={rescheduleStatus} onHide={() => setRescheduleStatus(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>

                <Modal.Body>


                    <div>
                        <Slots centerId={appointmentDetail.center_id?._id} selectedslot={selectedslot} setSelectedslot={setSelectedslot} />
                    </div>




                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-sm btn-primary' onClick={(e) => bookAppointment()} >Book Appointment</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => setRescheduleStatus(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal> */}

        </>
    )
}

export default Reschedule
