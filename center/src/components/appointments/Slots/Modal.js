import moment, {useState, useEffect} from 'moment-timezone';
import React from 'react'
import TimePicker from 'react-time-picker';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';

function Modal(props) {
    const { setShowModal, getCurrentDateSlots, day, edit, setEdit } = props

    // const [errors, setErrors] = useState({});

    const [slot, setSlot] = useState({ start_time: '', end_time: '', total_beds: 0 })


    useEffect(() => {
        console.log((edit));
        if (edit != '') {
            const newData = { ...slot }
                newData['total_beds'] = edit.total_beds
                newData['start_time'] = moment(edit.start_time, "HH:mm:ss").format("hh:mm A")
                newData['end_time'] = moment(edit.end_time, "HH:mm:ss").format("hh:mm A")
                setSlot(newData)

            // getEditSlot()
        }
    }, [])

    // function getEditSlot() {
    //     axiosBaseUrl.get(`private/appointment/slot-detail/${edit._id}`)
    //         .then((res) => {
    //             console.log(moment(res.data.data[0].start_time, "HH:mm:ss").format("hh:mm A"))

    //             const newData = { ...slot }
    //             newData['total_beds'] = res.data.data[0].total_beds
    //             newData['start_time'] = moment(res.data.data[0].start_time, "HH:mm:ss").format("hh:mm A")
    //             newData['end_time'] = moment(res.data.data[0].end_time, "HH:mm:ss").format("hh:mm A")
    //             setSlot(newData)


    //         }).catch(error => {
    //             console.log(error)
    //             if (error.response) {
    //                 Swal.fire(error.response.data.error, '', 'error')


    //             }
    //             else if (error.request) {
    //                 // The request was made but no response was received
    //                 console.log(error.request);
    //             } else {
    //                 // Something happened in setting up the request that triggered an Error
    //                 console.log('Error', error.message);
    //             }
    //         })
    // }

    const handleChangeTimeInput = (type, e) => {

        const newData = { ...slot }

        if(type === 'total_beds') {

            newData[type] = e.target.value
        }
        else {
            var time = e;
            if (time != null) {
                // if (e.substr(0, 2) > 12) {
                //     // time += 'PM'
                //     time = e.substr(0, 2) - 12 + ":" + e.substr(3, 2) + ' PM'
                // }
                // else {
                //     time += ' AM'
                // }
                // console.log(time)


                newData[type] = time



            }

        }

        setSlot(newData)

    }





    const submitCenterSlotForm = (e) => {
        e.preventDefault()

        // var error_data = centerSlotValidation(slot);
        // setErrors(error_data);

        // if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                if (result.isConfirmed) {

                    if(edit != "") {
                       updateSlot()
                    }
                    else {
                        addSlot()
                    }
                    


                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        // }


    }

    function updateSlot() {
        var  url = `private/appointment/slot/update/${edit._id}`
        axiosBaseUrl.put(url, { start_time: slot.start_time, end_time: slot.end_time, total_beds: slot.total_beds, day: day })
        .then((res) => {
            console.log(res)
            Swal.fire('Centre is successfully updated!', '', 'success')
            // getCenterTime()
            // setSlot({ day: '', opening_time: '', closing_time: '' })
            setEdit({})
            getCurrentDateSlots(day)
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
        var url =  `private/appointment/slot-create`;
        axiosBaseUrl.post(url, { start_time: slot.start_time, end_time: slot.end_time, total_beds: slot.total_beds, day: day })
        .then((res) => {
            // console.log(res)
            Swal.fire('Centre is successfully updated!', '', 'success')
            // getCenterTime()
            // setSlot({ day: '', opening_time: '', closing_time: '' })
            setEdit({})
            getCurrentDateSlots(day)
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

    return (
        <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog" role="document">
                <form onSubmit={submitCenterSlotForm}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Center Time</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">


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

                                {/* <span className="form-errors">{errors.start_time}</span> */}
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

                                {/* <span className="form-errors">{errors.end_time}</span> */}
                            </div>

                            <div className="form-group">
                                <lable className="mb-2p">Total Beds</lable>
                                <input
                                    className="form-control total_beds"
                                    name="total_beds"
                                    type="number"
                                    id="total_beds"
                                    onChange={(e) => handleChangeTimeInput('total_beds', e)}
                                    value={slot.total_beds}
                                />


                                {/* <span className="form-errors">{errors.total_beds}</span> */}
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                            <button type="submit" className="btn btn-primary">Save changes</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal
