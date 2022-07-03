import React, {useContext, useEffect, useState} from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';
import { SocketContext } from '../context/socket';
import AddCenterTimeModal from './AddCenterTimeModal';
const moment = require('moment')
function CenterTimeList(props) {
    const {id} = props
    const socket = useContext(SocketContext);
    const [showTimeModal, setShowTimeModal] = useState("");

    const [centerTime, setCenterTime] = useState([])

    useEffect(() => {
        getCenterTime()


        socket.on(id+'-center-time', (message) => {
            getCenterTime()
          
          }); 
    
    }, [])


    const deleteSlot = (slot_id) => {

        Swal.fire({
            title: 'Are You Sure?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Delete`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`admin/center-time/${id}/${slot_id}`)
                    .then((res) => {

                        // console.log(res)
                        // setCenter(res.data.data)
                        Swal.fire('Delete!', 'Slot is successfully deleted', 'success')
                        getCenterTime()
                     
                        socket.emit("update-center-time", id); 


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function getCenterTime() {
        axiosBaseUrl.get(`admin/center-time/${id}`)
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
                    {/* <h6 className="mb-0">Centre Timing</h6> */}
                    <div className="row">
                        <div className="col-6 d-flex align-items-center">
                            <h6 className="mb-0"><strong>Centre Timing</strong></h6>
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
                    
                    {/* <button className="btn custom-btn btn-sm"
                        onClick={() => setShowTimeModal(true)}
                    >
                        Update Time
                    </button> */}
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
                                                <td>{x.day.substr(0,3)}</td>
                                                <td>{x.opening_time} - {x.closing_time}</td>
                                                <td><button className="btn btn-danger btn-sm" onClick={() => deleteSlot(x._id)}>Delete</button></td>
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

                    <AddCenterTimeModal showTimeModal={showTimeModal} setShowTimeModal={setShowTimeModal} getCenterTime={getCenterTime} id={id}/>
                    : null
            }
        </div>
    )
}

export default CenterTimeList
