import Swal from "sweetalert2";
import axiosBaseUrl from "../axiosBaseUrl";

const cancelAppointment = (id, appointment_key) => {
    Swal.fire({
        title: 'Do you want to cancel ' + appointment_key + ' appointment?',
        showCancelButton: true,
        confirmButtonText: `Save`,
    }).then((result) => {
        if (result.isConfirmed) {

            axiosBaseUrl.put(`private/appointment-cancel/${id}`)
                .then((res) => {

                    // console.log(res)
                    // setCenter(res.data.data)
                    Swal.fire('', 'Appointment is successfully cancelled', 'success')
                    // getPatient()


                }).catch(error => {
                    console.log(error)

                })


        }
        else {

        }
    });
}

export default cancelAppointment;