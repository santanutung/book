import moment from 'moment-timezone'
import React, { useState, useEffect } from 'react'
import TimePicker from 'react-time-picker'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../../axiosBaseUrl'
import { centerDateSlotValidation } from '../../validation/Validation'

function SlotModal(props) {
    const { setShowModal, getCurrentDateSlots, date, edit, setEdit, activeDate } = props

    const [errors, setErrors] = useState({});

    const [slot, setSlot] = useState({ start_time: '', end_time: '', total_bed: 0, repeat : '' })

    useEffect(() => {
        console.log((edit));

        if (edit._id) {
            const newData = { ...slot }
            newData['total_bed'] = edit.total_bed
            newData['start_time'] = edit.start_time
            newData['end_time'] = edit.end_time
            newData['date'] = date
            setSlot(newData)

            // getEditSlot()
        }
        else {
            const newData = { ...slot }

            newData['date'] = date
            setSlot(newData)

        }
    }, [])

    const handleChangeTimeInput = (type, e) => {

        const newData = { ...slot }
        // alert(type)
        if(type == 'total_bed') {
            if(e.target.value < 0) {

                newData[type] = 0
            }
            else {
                newData[type] = e.target.value
            }
        }
        else {

            newData[type] = e.target.value
        }

        setSlot(newData)


    }

    function submitCenterSlotForm(e) {
        e.preventDefault()
        // console.log(slot)
        var error_data = centerDateSlotValidation(slot);
        setErrors(error_data);
        // console.log(error_data)
        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                if (result.isConfirmed) {

                    if (edit._id) {
                        updateSlot()
                    }
                    else {
                    
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
        var url = `private/appointment/date-slot/update/${edit._id}`
        axiosBaseUrl.put(url, { start_time: slot.start_time, end_time: slot.end_time, total_bed: slot.total_bed })
            .then((res) => {

                Swal.fire('Slot is successfully updated!', '', 'success')
                // getCenterTime()
                // setSlot({ day: '', opening_time: '', closing_time: '' })
                setEdit({})
                getCurrentDateSlots(date)
                setShowModal(false)

            }).catch(error => {
                // console.log(error)
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
        var data = { start_time: slot.start_time, end_time: slot.end_time, total_bed: slot.total_bed, date: moment(slot.date, 'DD/MM/YYYY').format('DD-MM-YYYY'), repeat:slot.repeat }
        console.log(data)
        var url = `private/appointment/date-slot`;
        axiosBaseUrl.post(url, data)
            .then((res) => {

                Swal.fire('Slot is successfully added!', '', 'success')
                // getCenterTime()
                // setSlot({ day: '', opening_time: '', closing_time: '' })
                setEdit({})
                getCurrentDateSlots(date)
                setShowModal(false)

            }).catch(error => {
                // console.log(error.response)
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
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { setShowModal(false); setEdit({}) }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">


                            {/* {
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
                        } */}

                            <div className='row'>
                                <div className='col-md-6'>

                                    <div className="form-group">
                                        <lable className="mb-2p">Start Time</lable>


                                        <select

                                            className="w-100 start_time form-control"
                                            name="start_time"
                                            id="start_time"
                                            amPmAriaLabel="Select AM/PM"
                                            disableClock="false"
                                            format="hh:mm a"
                                            onChange={(e) => handleChangeTimeInput('start_time', e)}
                                            value={slot.start_time ? slot.start_time.replace(/^0+/, '') : ''}

                                        >
                                             <option value="">Select Start Time</option>

                                            {

                                                Array(96).fill().map((_, i) => {
                                                    //    var prev_date = date
                                                    var time = moment('12:00 pm', 'h:mm a').add(i * 15, 'minutes').format('h:mm a')
                                                    //   console.log(activeDate)
                                                    return (
                                                        <option value={time}> {time}</option>
                                                    )
                                                })
                                            }

                                        </select>

                                        <span className="form-errors">{errors.start_time}</span>
                                    </div>
                                </div>
                                <div className='col-md-6'>

                            <div className="form-group">
                                <lable className="mb-2p">End Time</lable>

                                <select

                                    className="w-100 start_time form-control"
                                    name="start_time"
                                    id="start_time"
                                    amPmAriaLabel="Select AM/PM"
                                    disableClock="false"
                                    format="hh:mm a"
                                    onChange={(e) => handleChangeTimeInput('end_time', e)}
                                    value={slot.end_time ? slot.end_time.replace(/^0+/, '') : ''}

                                >
                                    <option value="">Select End Time</option>

                                  
                                    {

                                        slot.start_time ?
                                            Array(96).fill().map((_, i) => {

                                                var time = moment(slot.start_time, 'h:mm a').add((i + 1) * 15, 'minutes').format('h:mm a')

                                                return ( 
                                                    parseInt(moment(time, 'h:mm a').format('Hmmss')) > parseInt(moment(slot.start_time, 'h:mm a').format('Hmmss')) ?
                                                    <option value={time}>{time}</option> : ''
                                                )
                                            })
                                            :
                                            ''
                                    }

                                </select>


                                <span className="form-errors">{errors.end_time}</span>
                            </div>
                                </div>
                            </div>




                            <div className="form-group">
                                <lable className="mb-2p">Total Beds</lable>
                                <input
                                    className="form-control total_beds"
                                    name="total_beds"
                                    type="number"
                                    id="total_beds"
                                    min="0"
                                    onChange={(e) => handleChangeTimeInput('total_bed', e)}
                                    value={slot.total_bed}
                                />


                                <span className="form-errors">{errors.total_beds}</span>
                            </div>
                            <div className="form-group">
                                {/* <lable className="mb-2p">Total Beds</lable> */}
                                <select
                                    className="form-control repeat"
                                    name="repeat"
                                    type="number"
                                    id="repeat"
                                    onChange={(e) => handleChangeTimeInput('repeat', e)}
                                    value={slot.repeat}
                                >
                                    <option value="">Select</option>
                                    <option value="daily">Repeat daily for next 30 days</option>
                                    <option value="weekly">Repeat weekly for next 30 days</option>
                                    </select>


                                {/* <span className="form-errors">{errors.total_beds}</span> */}
                            </div>
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setShowModal(false); setEdit({}) }}>Close</button>
                            <button type="submit" className="btn btn-primary">Save changes</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default SlotModal
