import React, {useState} from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';

function Appointments(props) {
    const {appointmentData, getPatient} = props
    const [afterWeight, setAfterWeight] = useState('')
    const cancelAppointment = (id, appointment_key) => {
        Swal.fire({
            title: 'Do you want to cancel ' + appointment_key + ' appointment?',
            showCancelButton: true,
            confirmButtonText: `Save`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.put(`private/appointment-cancel/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Appointment is successfully cancelled', 'success')
                        getPatient()


                    }).catch(error => {
                        console.log(error)

                    })


            }
            else {

            }
        });
    }


    const updateStatusHandler = (id, status) => {

        let placeholder = "";

        if (status == 'pending') {
            placeholder = "Enter Weight before dialysis"
        }
        else {
            placeholder = "Enter Weight after dialysis"
        }
        var weight = 0;

        Swal.fire({
            title: 'Update Status',
            html: ` <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <input id="after_weight" class="form-control search input-box" name="after_weight"  placeholder="${placeholder}"/>
                            </div>
                        </div>
                    </div>`,
            confirmButtonText: 'Update',
            focusConfirm: false,
            showCancelButton: true,

            preConfirm: () => {
                const after_weight = Swal.getPopup().querySelector('#after_weight').value
                if (!after_weight) {

                    if (status == 'pending') {
                        Swal.showValidationMessage(`Please Enter Before Dialysis Weight`)

                    }
                    else {

                        Swal.showValidationMessage(`Please Enter After Dialysis Weight`)
                    }
                }
                else {
                    weight = after_weight

                }
                return { afterWeight: after_weight }
            }
        }).then((result) => {
            console.log("result ", result)

            var data = { 'appointment_status': status === 'pending' ? "ongoing" : "completed" }
            if (status == 'pending') {
                data['before_weight'] = weight
            }
            else {
                data['after_weight'] = weight
            }

            if (result.isConfirmed == true) {
                axiosBaseUrl.put(`private/center/appointment/${id}`, data)
                    .then((res) => {
                        console.log(res)
                        getPatient()
                        Swal.fire("Weight is successfully updated", '', 'success')

                    }).catch(error => {
                        console.log(error)
                        if (error.response) {
                            Swal.fire(error.response.data.error, '', 'error')


                        }
                        else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                    })


                console.log(result.value.afterWeight, " and ", result.value.updatedStatus)
            }

        })
    }
    return (
        <div
        className="tab-pane fade active show"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
    >

        <div className="table-responsive">
            <table
                className="display expandable-table"
                style={{ width: "100%" }}
            >
                <thead>
                    <tr>

                        <th>Appointment Id</th>
                        <th>Appointment Date</th>
                        <th>Appointment Time</th>
                        <th>Charges</th>
                        <th>Payment Status</th>
                        <th>Appointment Status</th>
                        <th>Before Dialysis(W)</th>
                        <th>After Dialysis(W)</th>
                        <th>Update</th>
                        <th>Cancel Appointment</th>

                    </tr>
                </thead>

                <tbody>

                    {
                        appointmentData.map((x, index) => {

                            return (
                                <tr key={index}>
                                    <td>{x.appointment_id}</td>
                                    <td>{x.date}</td>
                                    <td>{x.appointment_start_time}</td>
                                    <td>{x.charges}</td>
                                    <td>{x.payment_status}</td>
                                    <td>

                                        {
                                            x.appointment_status == "pending" ?

                                            <label className="badge badge-info">Pending</label>
                                            : x.appointment_status == "ongoing" ?
                                                <label className="badge badge-warning">On Going</label>
                                                : x.appointment_status == "cancelled" ?
                                                    <label className="badge badge-danger">Cancelled</label>
                                                    :
                                                    <label className="badge badge-success">Completed</label>

                                        }
                                    </td>
                                    <td>{x.before_weight}</td>
                                    <td>{x.after_weight}</td>
                                    <td>
                                        <button className="btn custom-btn btn-sm" disabled={(x.appointment_status === "cancelled" || x.appointment_status === "completed") ? true : false}
                                            onClick={() => updateStatusHandler(x._id, x.appointment_status)}
                                        >
                                            Update
                                        </button>
                                    </td>

                                    <td>
                                        <button className="btn btn-danger btn-sm" disabled={x.appointment_status != "pending" ? true : false}
                                            onClick={() => cancelAppointment(x._id, x.appointment_id)}
                                        >
                                            Cancel
                                        </button>
                                    </td>


                                </tr>

                            )
                        })
                    }

                </tbody>

            </table>
        </div>

    </div>

    )
}

export default Appointments
