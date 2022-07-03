import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { GlobalContext } from '../../context/GlobalState';
import { SocketContext } from '../../context/socket';
import { selectCenterId } from '../../Redux/userSlice';
import CenterTimeModal from './CenterTimeModal'
const moment = require('moment')
function CenterTimeList() {

    const centerId = useSelector(selectCenterId)
    const socket = useContext(SocketContext);
    const [showTimeModal, setShowTimeModal] = useState("");

    const [centerTime, setCenterTime] = useState([
        { day: '', opening_time: '', closing_time: '' },

    ])

    useEffect(() => {
        getCenterTime()

        socket.on(centerId + '-center-time', (message) => {
            getCenterTime()

        });


    }, [])

    const deleteSlot = (slot_id) => {

        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`private/center/center-time-delete/${slot_id}`)
                    .then((res) => {

                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getCenterTime()
                        socket.emit("update-center-time", centerId);


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function getCenterTime() {
        axiosBaseUrl.get(`private/center/center-time`)
            .then((res) => {
                // console.log(res.data.data)
                setCenterTime(res.data.data.times)
                // setCenter(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }

    return (
        <div className="col-12 col-xl-4  mt-4">
            <div className="card h-100">
                <div className="card-header pb-0 p-3">
                    <div className="row">
                        <div className="col-6 d-flex align-items-center">
                            <h6 className="mb-0">Centre Timing</h6>
                        </div>
                        <div className="col-6 text-right">
                            <button className="btn custom-btn btn-sm"
                                onClick={() => setShowTimeModal(true)}
                            >
                                Update Time
                            </button>
                        </div>
                    </div>

                </div>
                <div className="card-body center-profile-card-body p-3">

                    <ul className="list-group table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    centerTime.map((x) => {

                                        return (
                                            <tr key={x.day + "" + x._id}>
                                                <td>{x.day.slice(0,3)}</td>
                                                <td>{x.opening_time} - {x.closing_time}</td>
                                                <td><button className="btn btn-danger  btn-xs" onClick={() => deleteSlot(x._id)}>Delete</button></td>
                                            </tr>

                                        )
                                    })
                                }
                            </tbody>
                        </table>

                    </ul>
                </div>
            </div>

            {
                showTimeModal ?

                    <CenterTimeModal showTimeModal={showTimeModal} setShowTimeModal={setShowTimeModal} getCenterTime={getCenterTime} centerId={centerId} />
                    : null
            }
        </div>
    )
}

export default CenterTimeList
