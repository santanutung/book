import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'
import useGlobalContexts from '../context/GlobalContext'
import { socket } from '../context/socket'
import Chat from './Chat'

function EnquiryModal(props) {
    const { setShowModal, editData, getEnquiries } = props
    const [followUp, setFollowUp] = useState('')
    const [enquiry, setEnquiry] = useState({})

    const [messages, setMessages] = useState([])
    const { setLoadingState } = useGlobalContexts()

    useEffect(() => {
        // setFollowUp(editData.follow_up)
        getEnquiry()
        // console.log(editData);
    }, [])

    const [errors, setErrors] = useState({});
    function updateEnquiry(e) {
        e.preventDefault()
        // alert("test")
        setLoadingState(true)
        setErrors({})
        if (followUp == "") {
            setErrors({ 'follow_up': "Message is required" })
            setLoadingState(false)
        }
        else {


            axiosBaseUrl.post(`admin/enquiry/${editData._id}`, { message: followUp })
                .then((res) => {
                    Swal.fire("", 'Enquiry is updated', 'success')
                    // setShowModal(false)
                    socket.emit("enquiry-chat", editData._id);
                    getEnquiry()
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

    function getEnquiry() {
        axiosBaseUrl.get(`admin/enquiry/${editData._id}`)
            .then((res) => {
                console.log(res.data.data.folow_up)
                setEnquiry(res.data.data)
                // if(res.data.data.follow_up) {

                setMessages(res.data.data.follow_up)
                // }

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

    function updateStatus(status) {
     
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Update`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.put(`admin/enquiry/${editData._id}`, { status: status })
                    .then((res) => {

                        Swal.fire('', 'Enquiry is successfully update', 'success')
                        // getEnquiry()
                        getEnquiries(1)
                        setShowModal(false)


                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }



    return (
        <div className="modal fade show modal-show" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-md" role="document">
                <form onSubmit={updateEnquiry}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enquiry Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <strong>Enquiry No. :</strong> {enquiry.enquiry_no}
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group capitalize'>
                                        <strong>Name :</strong> {enquiry.name}
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <strong>Email :</strong> {enquiry.email}
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <strong>Date :</strong> {moment(enquiry.date).format('DD/MM/YYYY')}
                                    </div>
                                </div>
                                <div className='col-md-12'>
                                    <div className='form-group query'>
                                        <strong>Subject :</strong> {enquiry.subject}
                                    </div>
                                </div>
                                <div className='col-md-12'>
                                    <div className='form-group query'>
                                        <strong>Query :</strong> {enquiry.message}
                                    </div>
                                </div>
                            </div>




                        </div>
                        <div className="modal-footer">

                            {
                                editData.status.toLowerCase() == 'open' ?
                                    <button type="button" className="btn btn-secondary" onClick={() => updateStatus('Closed')}>Close Enquiry</button>

                                    :
                                    <button type="button" className="btn btn-secondary" onClick={() => updateStatus('Open')}>Open Enquiry</button>

                            }

                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default EnquiryModal
