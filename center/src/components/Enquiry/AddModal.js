import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalState';
import { socket } from '../../context/socket';
import { enquiryValidation } from '../validation/Validation';

function AddModal(props) {
    const {setShowModal} = props


    const [enquiryData, setEnquiryData] = useState({
        subject: "",
        message: "",
    });

    const [enquiryErrors, setEnquiryErrors] = useState({});
    const { setLoaderState } = useGlobalContexts()

    function enquiryHandle(e) {
        const newData = { ...enquiryData }
        newData[e.target.name] = e.target.value
        setEnquiryData(newData)
    }

    const submitQueryForm = (e) => {
        // socket.emit("notification", 'admin', {message : "hello"});
      
        e.preventDefault()
        setLoaderState(true)
        var error_data = enquiryValidation(enquiryData);
        setEnquiryErrors(error_data);
        if (Object.keys(error_data).length == 0) {



            axiosBaseUrl.post('private/send-message', enquiryData)
                .then((res) => {
                    console.log()
                    if (res.status == 200) {
                        socket.emit("center-chat", "admin");

                        // socket.emit("notification", 'admin', res.data.data);
                        Swal.fire("", "Thank you, we will contact you soon!", "success")
                        setEnquiryData({
                            email: "",
                            name: "",
                            subject: "",
                            message: "",
                        })
                    }
                    setLoaderState(false)


                }).catch(error => {
                    console.log(error.response)
                    if (error.response) {
                        if (error.response.status == 422) {

                            const errorData = { ...enquiryErrors }
                            error.response.data.errors.map((value, index) => {
                                errorData[value.param] = value.msg

                            })
                            setEnquiryErrors(errorData)
                        }
                    }
                    else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    setLoaderState(false)

                })
        }
        else {
            setLoaderState(false)
        }


    }



    return (
        <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog" role="document">
                <form onSubmit={submitQueryForm}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Send Query</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                        {/* <div className="form-group">
                                <lable className="mb-2p">Subject</lable>
                                <input className='form-control' name="subject" onChange={(e) => enquiryHandle(e)} />

                                <span className='text-danger'>{enquiryErrors.subject}</span>
                            </div> */}
                            <div className="form-group">
                                <lable className="mb-2p">Query</lable>
                                <textarea className='form-control' name="message" onChange={(e) => enquiryHandle(e)}></textarea>
                                <span className='text-danger'>{enquiryErrors.message}</span>
                                
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                            <button type="submit" className="btn btn-primary">Send QUery</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddModal;
