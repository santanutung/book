import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { documents } from '../../../rawData/DataSet';

function ReportModal(props) {
    const {reportModal,setReportModal, reportIndex, convertedFiles, setConvertedfiles} = props
    const [reportError, setReportError] = useState({});
    const [otherDocument, setOtherDocument] = useState(false)
    const [addData, setAddData] = useState({ title: '', file: ''});

    useEffect(() => {
      setAddData({ title: '', file: ''})
      setOtherDocument(false)
    
    }, [reportIndex]);
    

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
       
        var data = convertedFiles
        data[reportIndex]['title'] = addData.title
        data[reportIndex]['image'] = addData.file
        setConvertedfiles(data)
        setReportModal(false)
        console.log(data)


    }
    return (
        <Modal
            show={reportModal}
            onHide={() => setReportModal(false)}
            dialogClassName="modal-w-20"
            aria-labelledby="example-custom-modal-styling-title"
        >
            {/* <Modal.Header closeButton>

</Modal.Header> */}
            <Modal.Body>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group log-f">
                            <p>
                                <button className="file-upload" type="button" value="male" name="gender" >{addData.file ? 'Uploaded' : 'Upload'} <i className="fas fa-upload mr-1"></i></button>
                                <input type="file" accept='application/pdf, image/*' className='upload-input'
                                onChange={(e) => handleFile(e)} 
                                />
                            </p>

                        </div>
                        <span className='text-danger'>{reportError.file}</span>
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
                                    onClick={() => setReportModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="button" onClick={(e) => reportFormHandler(e)} className="btn btn-primary">
                                    Done
                                </button>

            </Modal.Footer>
        </Modal>
    );
}

export default ReportModal;
