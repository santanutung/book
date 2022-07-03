import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';

function Chat(props) {
    const { setShowModal, enquiry } = props
    console.log(enquiry, "enquiry")
    const [followUp, setFollowUp] = useState('')
    const { setLoadingState } = useGlobalContexts()
    const [errors, setErrors] = useState({});
    function updateEnquiry(e) {
        // console
        e.preventDefault()
        setLoadingState(true)
        setErrors({})
        if (followUp == "") {
            setErrors({ 'follow_up': "Message is required" })
            setLoadingState(false)
        }
        else {


            axiosBaseUrl.post(`admin/center-enquiry/${enquiry._id}`, { message: followUp })
                .then((res) => {
                    Swal.fire("", 'Enquiry is updated', 'success')
                    // setShowModal(false)
                    // socket.emit("enquiry -chat", enquiryId);
                    // getEnquiry()
                    setFollowUp('')
                    setLoadingState(false)
                }).catch(error => {
                    console.log(error.response)

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
    }

    return (
        <div className="modal fade show modal-show" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-md" role="document">
                <form onSubmit={(e) => updateEnquiry(e)}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enquiry Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='row'>
                                <div className='col-md-12'>
                                    {/* <div className='form-group'>
                                        <strong>Enquiry No. :</strong> {enquiry.enquiryNumber}
                                    </div> */}
                                </div>

                            </div>

                            <textarea 
                            className='form-control'
                            onChange={(e) => setFollowUp(e.target.value)}
                            value={followUp}
                            ></textarea>



                        </div>
                        <div className="modal-footer">

                            <button type="submit" className="btn btn-secondary" >Reply</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat;
