import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';

function EditPartner(props) {
    const { setShowModal, getPartners, editData } = props
    const [data, setData] = useState({ name: '', active: '' });
    const [error, setError] = useState({});
    useEffect(() => {
        setData({ name: editData.name, active: editData.active })
    }, [])
    function handle(e) {
        const newData = { ...data }
        newData[e.target.name] = e.target.value
        setData(newData)
        console.log(data)
    }


    const partnerHandler = (e) => {
        e.preventDefault()

        axiosBaseUrl.put(`admin/partner/${editData.id}`, data)
            .then((res) => {
                // alert("estt")
                console.log(res)
                if (res.status == 200) {
                    Swal.fire('', 'Partner is successfully updated', 'success')
                    getPartners()
                    setShowModal("")

                }


            }).catch(error => {
                if (error.response) {
                    if (error.response.status == 422) {

                        const errorData = { ...error }
                        error.response.data.error.map((value, index) => {
                            errorData[value.param] = value.msg

                        })
                        setError(errorData)
                    }

                }
                else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }

            })


    }

    return (
        <div className="modal fade show in" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Edit Partner</h5>
                        <button onClick={() => setShowModal('')} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='row'>

                            <div className='col-md-12'>
                                <div className='form-group'>
                                    <input
                                        name="name"
                                        type="text"
                                        className="form-control"
                                        placeholder='Name'
                                        required
                                        required=""
                                        onChange={(e) => handle(e)}
                                        value={data.name}
                                    />
                                    <span className='text-danger'>{error.name}</span>
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <div className='form-group'>
                                    <select
                                        name="active"
                                        type="text"
                                        className="form-control"
                                        required
                                        onChange={(e) => handle(e)}
                                        value={data.name}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => setShowModal('')} className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onClick={partnerHandler} className="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPartner
