import moment from 'moment'
import React, { useState } from 'react'

function TimeComponent(props) {
    const { slot, index, handleChangeInput, handleRemoveFields, totalSlots } = props

    const [days, setDays] = useState(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

    const dayHandler = async (e) => {
        handleChangeInput(index, e)

        // console.log(e.target.value)

        // let dayList = days.slice()

        // let item = dayList.filter(a => a == e.target.value)

        // let xyz = await dayList.findIndex(a => a == e.target.value)
        // console.log(xyz)
        // dayList.splice(xyz, 1)

        // console.log(dayList)
        // setDays(dayList)

        // if(item.length > 0){
        //     dayList.splice(xyz, 1)
        //     setDays(dayList)

        // }
        // console.log(dayList)

    }

    const convertTime = timeStr => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    };

    return (
        <tr>
            <td>
                <select className="form-control days" name="day"
                    value={slot.day}
                    // onChange={event => handleChangeInput(index, event)}
                    onChange={event => dayHandler(event)}

                >
                    <option value="">Select Day</option>
                    {
                        days.map((x) => {

                            return (
                                <option value={x}>{x}</option>

                            )
                        })
                    }
                    {/* <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option> */}
                </select>

            </td>
            <td>
                {/* <input
                    className="form-control opening_time"
                    name="opening_time"
                    type="time"
                    value={convertTime(slot.opening_time)}
                    onChange={event => handleChangeInput(index, event)}
                /> */}


                <select

                    className="w-100 start_time form-control"
                    name="opening_time"

                    amPmAriaLabel="Select AM/PM"
                    disableClock="false"
                    format="hh:mm a"
                    // onChange={(e) => handleChangeTimeInput('start_time', e)}
                    value={slot.opening_time.replace(/^0+/, '')}
                    onChange={event => handleChangeInput(index, event)}
                // value={convertTime(slot.opening_time)}

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







            </td>
            <td>
                {" "}
                {/* <input
                    className="form-control closing_time"
                    name="closing_time"
                    type="time"
                    value={convertTime(slot.closing_time)}
                    onChange={event => handleChangeInput(index, event)}
                /> */}

                <select

                    className="w-100 closing_time form-control"
                    name="closing_time"

                    amPmAriaLabel="Select AM/PM"
                    disableClock="false"
                    format="hh:mm a"
                    onChange={event => handleChangeInput(index, event)}
                    value={slot.closing_time.replace(/^0+/, '')}
                // value={convertTime(slot.closing_time)}

                >
                    <option value="">Select Closing Time</option>


                    {

                        slot.opening_time ?
                            Array(96).fill().map((_, i) => {

                                var time = moment(slot.opening_time, 'h:mm a').add((i + 1) * 15, 'minutes').format('h:mm a')

                                return (
                                    parseInt(moment(time, 'h:mm a').format('Hmmss')) > parseInt(moment(slot.opening_time, 'h:mm a').format('Hmmss')) && parseInt(moment(slot.opening_time, 'h:mm a').format('Hmmss')) <= 240000?
                                        <option value={time}>{time}</option> : ''
                                )
                            })
                            :
                            ''
                    }

                </select>




            </td>
            {

                totalSlots == 1 && index == 0 ?
                    null :
                    <td>
                        <button
                            onClick={handleRemoveFields}
                            className="btn btn-danger btn-sm remove-time" type="button">
                            Remove
                        </button>
                    </td>

            }
        </tr>
    )
}

export default TimeComponent
