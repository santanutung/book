import moment from 'moment-timezone';
import React, { useState } from 'react'
import TimePicker from 'react-time-picker'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { socket } from '../../context/socket';
import { days } from '../../rawData/daysData';
import centerTimeValidation from '../validation/Validation';

function CenterTimeModal(props) {

    const { showTimeModal, setShowTimeModal, getCenterTime, centerId } = props


    const [errors, setErrors] = useState({});

    const [slot, setSlot] = useState({ day: '', opening_time: '', closing_time: '' })

  



    const handleChangeInput = (e) => {
        const newData = { ...slot }
        newData[e.target.id] = e.target.value
        setSlot(newData)
    }



    const submitCenterForm = (e) => {
        e.preventDefault()

        var error_data = centerTimeValidation(slot);
        setErrors(error_data);

        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                if (result.isConfirmed) {


                    axiosBaseUrl.post(`private/center/center-time-add`, slot)
                        .then((res) => {
                            // console.log(res)
                            Swal.fire('Centre is successfully added!', '', 'success')
                            getCenterTime()
                            setSlot({ day: '', opening_time: '', closing_time: '' })
                            socket.emit("update-center-time", centerId);
                            // setShowTimeModal()

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


                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }


    }

    return (
        <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog" role="document">
                <form onSubmit={submitCenterForm}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Center Time</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowTimeModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <lable className="mb-2p">Select Day</lable>
                                <select
                                    className="form-control days  mt-2"
                                    name="day"
                                    id="day"
                                    onChange={(e) => handleChangeInput(e)}
                                    value={slot.day}
                                >
                                    <option value="">Select Day</option>

                                    {
                                        days.map((x) => {
                                            return <option value={x}>{x}</option>
                                        })
                                    }

                                </select>
                                <span className="form-errors">{errors.day}</span>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <lable className="mb-2p">Opening Time</lable>


                                        <select

                                            className="w-100 opening_time form-control  mt-2"
                                            name="opening_time"
                                            id="opening_time"
                                            amPmAriaLabel="Select AM/PM"
                                            disableClock="false"
                                            format="hh:mm a"
                                            onChange={(e) => handleChangeInput(e)}
                                            value={slot.opening_time ? slot.opening_time.replace(/^0+/, '') : ''}

                                        >
                                            <option value="">Select Opening Time</option>

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


                                        <span className="form-errors">{errors.opening_time}</span>
                                    </div>
                                </div>

                                <div className='col-md-6'>

                                    <div className="form-group">
                                        <lable className="mb-2p">Closing Time</lable>



                                        <select

                                            className="w-100 closing_time form-control  mt-2"
                                            name="closing_time"
                                            id="closing_time"
                                            amPmAriaLabel="Select AM/PM"
                                            disableClock="false"
                                            format="hh:mm a"
                                            onChange={(e) => handleChangeInput(e)}
                                            value={slot.closing_time ? slot.closing_time.replace(/^0+/, '') : ''}

                                        >
                                            <option value="">Select Closing Time</option>


                                            {

                                                slot.opening_time ?
                                                    Array(96).fill().map((_, i) => {

                                                        var time = moment(slot.opening_time, 'h:mm a').add((i + 1) * 15, 'minutes').format('h:mm a')

                                                        return (
                                                            parseInt(moment(time, 'h:mm a').format('Hmmss')) > parseInt(moment(slot.opening_time, 'h:mm a').format('Hmmss')) ?
                                                                <option value={time}>{time}</option> : ''
                                                        )
                                                    })
                                                    :
                                                    ''
                                            }

                                        </select>



                                        <span className="form-errors">{errors.closing_time}</span>
                                    </div>
                                </div>
                            </div>




                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowTimeModal(false)}>Close</button>
                            <button type="submit" className="btn btn-primary">Save changes</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default CenterTimeModal
