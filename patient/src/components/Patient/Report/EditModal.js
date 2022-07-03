import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import useGlobalContexts from '../../../context/GlobalContext';
import { documents } from '../../../rawData/DataSet';

function EditModal(props) {

    const { setReportModal, editReport, patientReports } = props
    const {setLoaderState} = useGlobalContexts()
    const [addData, setAddData] = useState({ title: '', file: '', patientId: '' });
    const [reportError, setReportError] = useState({});
    const [members, setMembers] = useState([]);
    const [otherDocument, setOtherDocument] = useState(false)
    useEffect(() => {
        console.log(editReport);
        setAddData({ title: editReport.title, patientId: editReport.patientId._id })

        patientFamily()
    }, [])

    function patientFamily() {

        axiosBaseUrl.get(`patients/api/family-member-list`)
            .then((res) => {
                console.log(res.data.data)
                setMembers(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }

    function editProfileHandler(e) {
        const newData = { ...addData }

        if(e.target.name == 'title') {
            // alert(e.target.value)
            if(e.target.value == 'Other' && e.target.title != 'other_title') {
                setOtherDocument(true)
            }
            else if(e.target.title == 'other_title') {
                newData[e.target.name] = e.target.value
                setAddData(newData)
            }
            else {
                newData[e.target.name] = e.target.value
                setAddData(newData)
            }
        }
        else {
            newData[e.target.name] = e.target.value
            setAddData(newData)

        }

        // newData[e.target.name] = e.target.value
        // setAddData(newData)
    }

    function handleFile(e) {

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...addData }
            newData['file'] = reader.result
            setAddData(newData)
            console.log(reader.result);//base64encoded string
        };


    }

    const reportFormHandler = (e) => {

        setLoaderState(true)

        axiosBaseUrl.put(`patients/api/reports/${editReport._id}`, addData)
            .then((res) => {
                // alert("estt")
                console.log(res)
                setLoaderState(false)
                if (res.status == 200) {
                    patientReports()
                    Swal.fire('', 'Report is successfully uploaded', 'success')
                    setReportModal("")

                }



            }).catch(error => {
                console.log(error)
                // alert("none done")
                setLoaderState(false)
                if (error.response) {
                    if (error.response.status == 422) {

                        const errorData = {}
                        error.response.data.errors.map((value, index) => {
                            errorData[value.param] = value.msg

                        })
                        setReportError(errorData)
                    }
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

    return (
        <>
            <div
                className="modal fade show"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            // style={{ display: 'none' }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => setReportModal('')}
                            />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group log-f">
                                    <input type="file" className='form-control' accept='application/pdf, image/*, application/msword' onChange={(e) => handleFile(e)} />
                                        {/* <div className="file-text">
                                          
                                            <label htmlFor="photo-upload1" className="custom-file-upload fas">
                                                <div className="img-wrap img-upload" >
                                                    <img for="photo-upload1" src={addData.file} width="100" />
                                                </div>
                                                <input id="photo-upload1" type="file" onChange={(e) => handleFile(e)} />
                                            </label>
                                        </div> */}

                                    </div>
                                    <span className='text-danger'>{reportError.file}</span>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group log-f">
                                        <select
                                            name="patientId"
                                            className="form-control"
                                            required
                                            onChange={(e) => editProfileHandler(e)}
                                            value={addData.patientId}
                                        >
                                            <option value="">Select Patient</option>

                                            {members.map((member, index) => {
                                                return (
                                                    <option value={member._id}>{member.name}</option>
                                                )
                                            })}
                                        </select>
                                        <span className='text-danger'>{reportError.patientId}</span>
                                    </div>
                                </div>


                                <div className="col-md-12">
                                    <div className="form-group log-f">


                                        {otherDocument ?
                                            <div className='d-flex p-relative'>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="form-control"
                                                    id="other_title"
                                                    placeholder="Title*"
                                                    required
                                                    onChange={(e) => editProfileHandler(e)}
                                                    value={addData.title != 'Other' ? addData.title : ''}
                                                />
                                                {/* <a className='close-input-cross'  name="title" value="" onClick={(e) => editProfileHandler(e)}><i className='fa fa-times'></i></a> */}
                                            </div>
                                            :
                                            <select
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                id="title"
                                                placeholder="Title*"
                                                required
                                                onChange={(e) => editProfileHandler(e)}
                                                value={addData.title}
                                            >
                                                <option value="">Select Report Type</option>
                                                <option value={addData.title}>{addData.title}</option>

                                                {documents.map((document, index) => {
                                                    return (
                                                        <option value={document}>{document}</option>
                                                    )
                                                })}
                                            </select>


                                        }


                                        <span className='text-danger'>{reportError.title}</span>
                                    </div>
                                </div>


                            </div>



                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setReportModal('')}
                            >
                                Cancel
                            </button>
                            <button type="button" onClick={reportFormHandler} className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditModal
