import React, {useState, useEffect} from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import useGlobalContexts from '../../context/GlobalState'
import { socket } from '../../context/socket'
import { bookAppointmentValidation } from '../validation/Validation'

function BookAppointmentForm(props) {
    const { setLoaderState } = useGlobalContexts()
    const {getDates, setPatientForm, patientDetail, setPatientDetail, activeDate, selectSlot, setSelectSlot} = props
    // console.log(props)

    const [errors, setErrors] = useState({});
    useEffect(() => {
        const newData = { ...patientDetail }
        newData['slot_id'] = selectSlot
        newData['date'] = activeDate
        setPatientDetail(newData)

    }, [])



    const handleChangeInput = (e) => {
        const newData = { ...patientDetail }
        newData[e.target.id] = e.target.value
        setPatientDetail(newData)
    }

    const bookAppointment = (e) => {

        e.preventDefault()

        // console.log(patientDetail)

        var error_data = bookAppointmentValidation(patientDetail);
        setErrors(error_data);
        // console.log(error_data)

        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Are you sure?',
                showCancelButton: true,
                confirmButtonText: `Book`,
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoaderState(true)

                    axiosBaseUrl.post(`private/appointment-book`, {date: activeDate, slot_id:selectSlot, mobile:patientDetail.mobile, name : patientDetail.name})
                        .then((res) => {
                            // console.log(res)
                            setLoaderState(false)
                            socket.emit("notification", res.data.user_id+"user", res.data.notification);

                            Swal.fire('Appointment is successfully booked!', '', 'success')
                            setPatientForm("")
                            getDates()
                            setPatientDetail({mobile:''})
                            setSelectSlot("")

                            // let newData = { ...patientDetail }
                            // newData["name"] = ""
                            // newData["mobile"] = ""
                        
                            // setPatientDetail(newData)
                           
                        }).catch(error => {
                            // console.log(error)
                            if (error.response) {
                                if(error.response.status == 400) {
                                    Swal.fire('', error.response.data.message, 'error');
                                }
                                else {

                                    Swal.fire(error.response.data.error, '', 'error')
                                }


                            }
                            else if (error.request) {
                                // The request was made but no response was received
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            setLoaderState(false)
                        })


                } 
            });
        }
        else {
            setLoaderState(false)
        }

    }
    return (
        <div className="card mt-5">
        <div className="card-header">
            <h4>Patient Details</h4>
            </div>
        <div className="card-body">
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                        className="form-control" 
                        placeholder="" 
                        name="name" 
                        id="name"
                        onChange={(e) => handleChangeInput(e)}
                        value={patientDetail.name}
                         />
                         <span className='text-danger'>{errors.name}</span>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input className="form-control" placeholder="" name="mobile" id="mobile" value={patientDetail.mobile} disabled />
                    </div>
                </div>






                <div className="col-md-12">
                    <div className="form-group text-right">
                    <button className="btn btn-sm btn-secondary mr-2" onClick={e => setPatientForm(false)}>Back</button>
                        <button className="btn btn-sm btn-secondary" onClick={bookAppointment}>Book Appointment</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default BookAppointmentForm
