import moment from 'moment';
import React, { useEffect, useState } from 'react'
import TimePicker from 'react-time-picker';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { centerDateSlotValidation } from '../../Validation/Validation';

function DateSlotModal(props) {
    const { setShowModal, getDateSlots, edit, setEdit, centerId, activeDate, setActiveDate } = props

    const [errors, setErrors] = useState({});

    const [slot, setSlot] = useState({ start_time: '', end_time: '', total_bed: 0, date:'' })

    useEffect(() => {
        console.log((edit));
       
        if (edit._id) {
            const newData = { ...slot }
                newData['total_bed'] = edit.total_bed
                newData['start_time'] = moment(edit.start_time, "hh:mm A").format("HH:mm")
                newData['end_time'] = moment(edit.end_time, "hh:mm A").format("HH:mm")
                newData['date'] = edit.date
                setSlot(newData)

            // getEditSlot()
        }
    }, [])

    const handleChangeTimeInput = (type, e) => {

        const newData = { ...slot }

        if(type === 'total_bed'|| type == 'date') {

            newData[type] = e.target.value
        }
        else {
            var time = e;
            if (time != null) {

                newData[type] = time
            }

        }

        setSlot(newData)

    }

    function submitCenterSlotForm(e) {
        e.preventDefault()
        console.log(slot)
        var error_data = centerDateSlotValidation(slot);
        setErrors(error_data);

        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                if (result.isConfirmed) {

                    if(edit._id) {
                       updateSlot()
                     
                    }
                    else {
                        // alert("test")
                        addSlot()
                    }
                    


                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }
    }


    function updateSlot() {
        // alert(edit._id)
        // alert("test")
        var  url = `admin/appointment/date-slot/update/${edit._id}`
        axiosBaseUrl.put(url, { start_time: slot.start_time, end_time: slot.end_time, total_bed: slot.total_bed, centerId:centerId})
        .then((res) => {
          
            Swal.fire('Slot is successfully updated!', '', 'success')
            // getCenterTime()
            // setSlot({ day: '', opening_time: '', closing_time: '' })
            setEdit({})
            setActiveDate(slot.date)
            getDateSlots(slot.date)
            setShowModal(false)

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
    }

    function addSlot() {
      
        var url =  `admin/appointment/date-slot`;
        axiosBaseUrl.post(url, { start_time: slot.start_time, end_time: slot.end_time, total_bed: slot.total_bed, date:slot.date, centerId:centerId})
        .then((res) => {
          
            Swal.fire('Slot is successfully added!', '', 'success')
            // getCenterTime()
            // setSlot({ day: '', opening_time: '', closing_time: '' })
            setEdit({})
            setActiveDate(slot.date)
            getDateSlots(slot.date)
            setShowModal(false)

        }).catch(error => {
            console.log(error.response)
            if (error.response) {
                // Swal.fire(error.response.data.error, '', 'error')
                if (error.response.status == 422) {
                    const newData = { ...errors }
                    error.response.data.errors.map((x) => {
                        newData[x.param] = x.msg

                    })
                    setErrors(newData)
                    // window.scroll(0,document.getElementById(Object.keys(newData)[0]).offsetTop-50);
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
    }

    return (
        <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
        <div className="modal-dialog" role="document">
            <form onSubmit={submitCenterSlotForm}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{edit._id ? 'Update' : 'Add'} Date Slot</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {setShowModal(false);setEdit({})}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">


                        {
                            !edit._id ?
                            <div className="form-group">
                            <lable className="mb-2p">Start Time</lable>

                            
                            <input

                                type="date"
                                className="w-100 form-control"
                                name="date"
                                id="date"
                               
                                onChange={(e) => handleChangeTimeInput('date', e)}

                            />

                            <span className="form-errors">{errors.date}</span>
                        </div>
                        :
                        ''
                        }


                        <div className="form-group">
                            <lable className="mb-2p">Start Time</lable>

                            <TimePicker
                                className="w-100 start_time"
                                name="start_time"
                                id="start_time"
                                amPmAriaLabel="Select AM/PM"
                                disableClock="false"
                                format="hh:mm a"
                                onChange={(e) => handleChangeTimeInput('start_time', e)}
                            value={slot.start_time}
                            />
                            {/* <input

                                className="w-100 start_time"
                                name="start_time"
                                id="start_time"
                                amPmAriaLabel="Select AM/PM"
                                disableClock="false"
                                format="hh:mm a"
                                onChange={(e) => handleChangeTimeInput('start_time', e)}

                            /> */}

                            <span className="form-errors">{errors.start_time}</span>
                        </div>

                        <div className="form-group">
                            <lable className="mb-2p">End Time</lable>

                            <TimePicker
                                className="w-100 end_time"
                                name="end_time"
                                id="end_time"
                                amPmAriaLabel="Select AM/PM"
                                disableClock="false"
                                format="hh:mm a"
                                onChange={(e) => handleChangeTimeInput('end_time', e)}
                            value={slot.end_time}
                            />

                            <span className="form-errors">{errors.end_time}</span>
                        </div>

                        <div className="form-group">
                            <lable className="mb-2p">Total Beds</lable>
                            <input
                                className="form-control total_beds"
                                name="total_beds"
                                type="number"
                                id="total_beds"
                                onChange={(e) => handleChangeTimeInput('total_bed', e)}
                                value={slot.total_bed}
                            />


                            {/* <span className="form-errors">{errors.total_beds}</span> */}
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {setShowModal(false);setEdit({})}}>Close</button>
                        <button type="submit" className="btn btn-primary">Save changes</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
    )
}

export default DateSlotModal
