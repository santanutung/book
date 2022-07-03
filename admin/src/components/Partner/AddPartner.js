import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';

function AddPartner(props) {
    const { setShowModal, getPartners } = props
    const [data, setData] = useState({ name: '', image: '' });

    const [error, setError] = useState({});
    function handle(e) {
        const newData = { ...data }
        newData[e.target.name] = e.target.value
        setData(newData)
        console.log(data)
    }

    function handleFile(e) {

        // let file = e.target.files[0]

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...data }
            newData['image'] = reader.result
            setData(newData)
            console.log(reader.result);//base64encoded string
        };


    }

    const partnerHandler = (e) => {
        e.preventDefault()



        console.log(data)
        axiosBaseUrl.post('admin/partner', data)
            .then((res) => {
                console.log(res)
                if (res.status == 200) {
                    Swal.fire('', 'Partner is successfully added', 'success')
                    getPartners()
                    setShowModal("")

                }


            }).catch(error => {
                if (error.response) {
                    if (error.response.status == 422) {

                        console.log(error.response);
                        const errorData = { ...error }
                        error.response.data.error.map((value, index) => {
                            // console.log(value);
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
                        <h5 className="modal-title" id="exampleModalLabel">Add Partner</h5>
                        <button onClick={() => setShowModal('')} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='form-group'>
                                    <input
                                        name="file"
                                        type="file"
                                        data-height="100"
                                        onChange={(e) => handleFile(e)} /><br />
                                    <span className='text-danger'>{error.image}</span>
                                </div>
                            </div>
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
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => setShowModal('')} className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onClick={partnerHandler} className="btn btn-primary">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPartner
