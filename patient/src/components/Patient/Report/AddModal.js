import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl'
import useGlobalContexts from '../../../context/GlobalContext';
import { documents } from '../../../rawData/DataSet';
import ReportValidation from '../../../Validation/ReportValidation'

function AddModal(props) {
    const { reportModal, setReportModal, patientReports, editReport, isShare } = props
    const [addData, setAddData] = useState({ title: '', file: '', patientId: '' });
    const [reportError, setReportError] = useState({});
    const [members, setMembers] = useState([]);
    const { setLoaderState } = useGlobalContexts()
    const [otherDocument, setOtherDocument] = useState(false)

    const [centers, setCenters] = useState([]);
    const [centerData, setCenterData] = useState([])

    useEffect(() => {

        if (!isShare) {

            if (editReport._id) {
                setAddData({ title: editReport.title, patientId: editReport.patientId._id })
            }
            else {

                setAddData({ title: '', file: '', patientId: '' })
            }
            patientFamily()
        }
        else {
            getAppointmentCenters()
            setCenterData(editReport.shareWith)
        }

    }, [reportModal]);


    function getAppointmentCenters()
    {
        axiosBaseUrl.get(`patients/api/appointment-centers`)
        .then((res) => {
            console.log(res.data.data);
            setCenters(res.data.data)
           

        }).catch(error => {
            console.log(error)

        })
    }


    const inputHandler = (e) => {
        let newData = centerData;
        const checked = e.target.checked;
        if (checked) {

            newData.push({centerId : e.target.value})
            // newData[e.target.name] = true

        }
        else {

            newData = centerData.filter((x) => {
                if (x.centerId !== e.target.value) {
                    return x;
                }
            })
            // newData[e.target.name] = false

        }
        // console.log(newData)
        setCenterData(newData)

    }

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

        if (e.target.name == 'title') {
            // alert(e.target.value)
            if (e.target.value == 'Other' && e.target.title != 'other_title') {
                setOtherDocument(true)
            }
            else if (e.target.title == 'other_title') {
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
        if (!isShare) {

            if (editReport._id) {
                edit(e)
            }
            else {
                add(e)
            }
        }
        else {
            share(e)
        }



    }

    function share(e) {
        axiosBaseUrl.post(`patients/api/reports/${editReport._id}`, centerData)
        .then((res) => {
            // alert("estt")
            console.log(res)
            if (res.status == 200) {
                Swal.fire('', 'Report is successfully uploaded', 'success')
                setReportModal("")
                patientReports()
            }


        }).catch(error => {
            console.log(error)
            // alert("none done")
            if (error.response) {
                // if (error.response.status == 422) {

                //     const errorData = { ...reportError }
                //     error.response.data.errors.map((value, index) => {
                //         errorData[value.param] = value.msg

                //     })
                //     setReportError(errorData)
                // }
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

    function edit(e) {
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
                console.log(error.response)
                // alert("none done")
                setLoaderState(false)
                if (error.response) {
                    // if (error.response.status == 422) {

                    //     const errorData = { ...reportError }
                    //     error.response.data.errors.map((value, index) => {
                    //         errorData[value.param] = value.msg

                    //     })
                    //     setReportError(errorData)
                    // }
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

    function add(e) {
        var error_data = ReportValidation(addData);
        setReportError(error_data);
        // console.log(error_data);
        setLoaderState(true)
        if (Object.keys(error_data).length == 0) {

            axiosBaseUrl.post(`patients/api/reports`, addData)
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
                    console.log(error.response, "error")
                    // alert("none done")
                    setLoaderState(false)
                    if (error.response) {
                        // if (error.response.status == 422) {

                        //     const errorData = {}
                        //     error.response.data.errors.map((value, index) => {
                        //         errorData[value.param] = value.msg

                        //     })
                        //     setReportError(errorData)
                        // }
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
        else {
            setLoaderState(false)
        }

    }


    function reset() {
        setReportModal(false);
        setReportError({})
        setAddData({ title: '', file: '', patientId: '' })
    }
    function centerExist(key) {
        var status = centerData.filter((x) => {
            if(x.centerId === key) {
                return x;
            }
        })
        return status.length;
    

    }


    return (
        <>
            <Modal show={reportModal} onHide={() => { reset() }}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                {
                    !isShare ?
                        <>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group log-f">

                                            <input type="file" className='form-control' accept='application/pdf, image/*, application/msword' onChange={(e) => handleFile(e)} />
                                            {/* <label htmlFor="photo-upload1" className="custom-file-upload fas">
                                            <div className="img-wrap img-upload" >
                                                <img for="photo-upload1" src={addData.file} width="100" />
                                            </div>
                                            <input id="photo-upload1" type="file" onChange={(e) => handleFile(e)} />
                                        </label> */}
                                        </div>
                                        <span className='text-danger'>{reportError.file}</span>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <select
                                                name="patientId"
                                                className="form-control"
                                                id="patientId"
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


                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setReportModal('')}
                                >
                                    Cancel
                                </button>
                                <button type="button" onClick={reportFormHandler} className="btn btn-primary">
                                    Save &amp; Proceed
                                </button>
                            </Modal.Footer>
                        </> :
                        <>
                            <Modal.Body>
                                <div className="row">

                                    <div className="col-md-12">
                                        <div className="form-group log-f table-repsonsive">
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Centre name</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {centers.map((center, index) => {
                                                        return (
                                                            <tr key={index + "center"}>
                                                                <td>
                                                                    {


                                                                        centerExist(center._id[0]._id) == 1 ? <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} checked /> : <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} />
                                                                    }

                                                                    {/* <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} checked={ centerExist(center._id[0]._id) ==1 ? true : false}  /> */}
                                                                </td>
                                                                <td>
                                                                    {center._id[0].name + " (" + center._id[0].area + ")"}
                                                                </td>
                                                            </tr>

                                                        )
                                                    })}

                                                </tbody>

                                            </table>

                                            {/* <span className='text-danger'>{reportError.patientId}</span> */}
                                        </div>
                                    </div>


                                    <div className="col-md-12">
                                        <div className="form-group log-f">





                                        </div>
                                    </div>


                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => reset()}
                                >
                                    Cancel
                                </button>
                                <button type="button" onClick={(e) => reportFormHandler(e)} className="btn btn-primary">
                                    Save &amp; Proceed
                                </button>
                            </Modal.Footer>
                        </>
                }

            </Modal>
        </>
    )
}

export default AddModal
