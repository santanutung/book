import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import useGlobalContexts from '../../context/GlobalState'
import { socket } from '../../context/socket'

function ExistUser(props) {
    const { setLoaderState } = useGlobalContexts()
    const { getDates, familyMembers, setFamilyMember, setPatientForm, patientDetail, setPatientDetail, activeDate, selectSlot, setSelectSlot } = props
    // console.log(familyMembers)
    const [selectMember, setSelectMember] = useState('')
    const [errors, setErrors] = useState({});
    const bookAppointment = (e) => {

        e.preventDefault()

        if(!selectMember.patient_id) {
            Swal.fire( "", 'Please Select patient', '', 'danger')
        }
        else {

            Swal.fire({
                title: 'Are you sure?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                if (result.isConfirmed) {
    
                    setLoaderState(true)
                    axiosBaseUrl.post(`private/appointment-book`, { date: activeDate, slot_id: selectSlot, mobile: patientDetail.mobile, patient_id: selectMember.patient_id, 'user' : selectMember.user })
                        .then((res) => {
                            // console.log(res)
                            setLoaderState(false)
                            socket.emit("notification", res.data.user_id+"user", res.data.notification);
                            Swal.fire('Appointment is successfully booked!', '', 'success')
                            setPatientForm("")
                            getDates()
                            // setPatientDetail({})
                            setPatientDetail({mobile:''})
                            setSelectSlot("")
    
                        }).catch(error => {
                            // console.log(error)
                            if (error.response) {
                                if(error.response.status == 400) {
                                    Swal.fire('', error.response.data.message, 'error');
                                }
                                else {
    
                                    
                                    Swal.fire(error.response.data.error, '', 'error').then({
                                        
                                    })  
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
    
    
                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }


        // }

    }


    return (
        <div>
            <div className="card">
                <div className="card-header">Patient List</div>
                <div className="card-body">
                    <div className="row">

                    {/* <div className="col-md-4 mt-3">
                                        <div className="card exist-user-item">
                                            <div className="card-body">
                                            <div onClick={e => setSelectMember({'user' : 'user','patient_id' :familyMembers.user._id})} id={familyMembers.user._id} > {selectMember.patient_id == familyMembers.user._id && selectMember.user == 'user' ? <i class="fas fa-circle mr-2"></i> : <i class="far fa-circle mr-2"></i>}{familyMembers.user.name}
                                        </div>

                                            </div>
                                        </div>
                                    </div> */}

                        {
                            familyMembers.members.map((x) => {

                                return (
                                    <div className="col-md-4 mt-3">
                                        <div className="card exist-user-item">
                                            <div className="card-body">
                                            <div className='pointer' onClick={e => setSelectMember({'user' : 'family_member','patient_id' :x._id})} id={x._id} > {selectMember.patient_id == x._id && selectMember.user == 'family_member' ? <i class="fas fa-circle mr-2"></i> : <i class="far fa-circle mr-2"></i>}{x.name}</div>
                                       
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }

                        <div className="col-md-12 mt-3 text-right">
                            <button className="btn btn-sm btn-secondary mr-2" type="button" onClick={bookAppointment} >Book Appointment</button>

                            <button className="btn btn-sm btn-secondary mr-2" type="button" onClick={e => { setPatientForm(''); setSelectMember(''); }}>Back</button>

                            <button className="btn btn-sm btn-secondary" type="button" onClick={e => { setPatientForm('new'); setSelectMember(''); }}>Other</button>
                        </div>


                    </div>
                </div>
            </div>
            {/* {patientForm == 'other' ? <BookAppointmentForm setPatientForm={setPatientForm} patientDetail={patientDetail} setPatientDetail={setPatientDetail} activeDate={activeDate} selectSlot={selectSlot} /> : ""} */}

        </div>
    )
}

export default ExistUser
