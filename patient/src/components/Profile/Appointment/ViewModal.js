import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';
import numberFormat from '../../../functions';
import ReportModal from './ReportModal';


function ViewModal(props) {
    const { appointmentModal, setAppointmentModal, appointment, cancelAppointment, getAppointments } = props

    const appointmentId = localStorage.getItem('apt_key')
    const [convertedFiles, setConvertedfiles] = useState([{ image: '' }])
    // const [appointmentId, setAppointmentId] = useState(localStorage.getItem('apt_key'))
    const [cretenine, setCretenine] = useState('')
    const [reports, setReports] = useState([])
    const [selectedReport, setSelectedReport] = useState({})
    const [reportModal, setReportModal] = useState(false)
    const [reportIndex, setReportIndex] = useState('')
    useEffect(() => {
        console.log(appointment, "appointment")
        if (appointment._id) {

            setConvertedfiles([{ image: '' }])
            setCretenine(appointment.cretenine)
            setSelectedReport(appointment.reports)
            getReports()
            console.log(Object.values(appointment.reports), "reports")
            var newData = []
            for (var i = 0; i < appointment.reports.length; i++) {
                newData.push(appointment.reports[i].reportId._id)
            }
            setSelectedReport({ ...selectedReport, ['reports']: newData })

        }
    }, [appointment]);


    function browseFile(e, index) {
        var newData = [...convertedFiles]

        const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            // setProfileError({ 'image': 'Image size should be maximum 2 MB' });
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {
                // setConvertedfiles((prevFiles) => [...prevFiles, { image: reader.result }])
                newData[index] = { image: reader.result }
                // newData['profile_photo_path'] = reader.result
                setConvertedfiles(newData)
                // console.log(reader.result);//base64encoded string
            };
        }
    }


    function editProfileHandler(e, index) {
        var data = convertedFiles
        data[index]['title'] = e.target.value
        data[index]['key'] = e.target.value
        setConvertedfiles(data)
        console.log(data)
    }

    function uploadDocuments() {
        var error_data = {}
        var error_status = false

        if (error_status === false) {

            var newData = []
            for (var i = 0; i < selectedReport.reports.length; i++) {
                newData.push({ reportId: selectedReport.reports[i] })
            }

            console.log(newData)


            axiosBaseUrl.post(`patients/api/appointment/upload-documents`, { appointmentId: appointment._id, files: convertedFiles, cretenine: cretenine, uploadedReport: newData })
                .then((res) => {
                    console.log(res)
                    Swal.fire("", "document upoaded", 'success')
                    getAppointments()
                    setAppointmentModal(false)
                    // history.push("/Profile");
                }).catch(error => {
                    console.log(error.response)

                })
        }
    }

    function removeReport(remove_index) {
        var data = convertedFiles
        // data.splice(index, 1);

        var data = convertedFiles.filter((item, index) => {
            return remove_index !== index
        })
        setConvertedfiles(data)


    }


    const handleAddFields = () => {
        setConvertedfiles([...convertedFiles, { image: '' }])
    }

    function getReports() {


        axiosBaseUrl.get(`patients/api/reports?patientId=${appointment.patient_familyMemberId._id}`)
            .then((res) => {
                console.log(res.data.data, "reports")
                setReports(res.data.data.doc)
                // setMembers(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }



    const inputHandler = (e, member, report) => {
  
        let newData = selectedReport['reports'] || [];

        if (newData.includes(report._id)) {
            const index = newData.indexOf(report._id);
            if (index > -1) {
                newData.splice(index, 1);
            }
        } else {
            newData.push(report._id);
            // newData1.push(report._id);
        }
        console.log(newData)
        // setSelectedReport1({...selectedReport1, ['test']: newData})
        setSelectedReport({ ...selectedReport, ['reports']: newData })


    }




    function reportExist(key) {
        var status = selectedReport.filter((x) => {
            if (x.reportId === key) {
                return x;
            }
        })
        return status.length;


    }



    return (
        <>
            <Modal
                show={appointmentModal}
                onHide={() => setAppointmentModal(false)}
                dialogClassName="modal-m-width-4-vw"
                aria-labelledby="example-custom-modal-styling-title"
            >
                {/* <Modal.Header closeButton>

            </Modal.Header> */}
                <Modal.Body>

                    <div className="service-info appointment-details-modal">
                        <div className="row" style={{ borderBottom: "2px solid #457b9d29" }}>
                            <div className="col-md-6 col-6">
                                <h4 className='title mac-css capitalize font-600'>{appointment.center_id?.name}</h4>
                                <p className='center-address mb-3 mt-2'>{appointment.center_id?.area + " " + appointment.center_id?.city}</p>
                            </div>
                            <div className="col-md-6 col-6">
                                <h3 style={{ textAlign: "right" }}>{numberFormat(appointment.charges).replace('.00', '')}</h3>
                                <p className='appointment-payment mb-3 mt-2 text-right color'>Payment Mode: <br />{appointment.payment_type === 'cash' ? 'cash on appointment' : 'online paid'}</p>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-4 col-4 col-sm-12  appointmemt-id-sec">
                                <div className="btn-d">
                                    <h6 className='text-center uppercase theme-color'>Appointment No.</h6>
                                    <h5 className='text-center theme-color'><strong>{appointment.appointment_key}</strong></h5>
                                </div>
                            </div>
                            <div className="col-md-4 col-4 col-sm-6 date-time">
                                <div className="btn-d">
                                    <button className="btn btn-b">{moment(appointment.date, 'DD-MM-YYYY').format('D MMM ‘YY')}</button>
                                </div>
                            </div>
                            <div className="col-md-4 col-4 col-sm-6 date-time">
                                <div className="btn-d">
                                    <button className="btn btn-b">{appointment.appointment_start_time}</button>
                                </div>
                            </div>
                            <p className="dial-l text-left">Dialysis takes upto 4-6 hours</p>
                        </div>
                        <br />




                        <div className="row">
                            {
                                appointment.appointment_status === 'pending' ?
                                    <>
                                        <div className='col-m-12'>
                                            <h5 className='mb-3 theme-color'>Upload your reports (optional)</h5>
                                        </div>
                                        {
                                             appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id)  ?
                                            reports ?
                                                reports.map((report, index) => {
                                                    return (
                                                        <div className='col-md-6 col-6 col-sm-12' onClick={(e) => inputHandler(e, report._id, report)}>
                                                            <div className="lipid-btn" href="#!">

                                                                <i class={selectedReport['reports']?.includes(report._id) ? "fas fa-circle" : 'far fa-circle'}></i>

                                                                {/* {reportExist(report._id) > 0 ? <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} checked /> : <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} />} */}
                                                                {" "}
                                                                &nbsp;&nbsp;<a href={env.imageurl + report.file} target="blank"> {report.title}</a>


                                                            </div>
                                                        </div>
                                                    )
                                                }) : ''
                                                :
                                                appointment.reports.map((report, index) => {
                                                    return (
                                                        <div className='col-md-6 col-6 col-sm-12' onClick={(e) => inputHandler(e, report?.reportId?._id, report)}>
                                                            <div className="lipid-btn" href="#!">

                                                                {/* {reportExist(report._id) > 0 ? <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} checked /> : <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} />} */}
                                                                {" "}
                                                                &nbsp;&nbsp;<a href={env.imageurl + report?.reportId?.file} target="blank"> {report?.reportId?.title}</a>


                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        }
                                        
                                        {
                                            appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id)  ?
                                            convertedFiles.map((image, index) => {
                                                return (
                                                    <div className="col-md-6 col-6 col-sm-12 mb-2">

                                                        <div className="relative">
                                                            {/* {image.image} */}
                                                            {/* <i className="fas fa-circle"></i> */}
                                                            {
                                                                image.image ?
                                                                    <button target="_blank" className="file-upload" type="button">{image.title} <i className="fas fa-times" onClick={() => removeReport(index)}></i></button>
                                                                    :
                                                                    <>
                                                                        <button className="file-upload" type="button" value="male" name="gender" onClick={() => {setReportModal(true); setReportIndex(index)} }>Upload <i className="fas fa-upload"></i></button>
                                                                        {/* <input type="file" accept='application/pdf, image/*' className='file-input' onChange={(e) => browseFile(e, index)} /> */}
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>
                                                )
                                            }) : ''
                                        }


                                        <div className="col-md-6 mb-3">
                                            <div className="relative">
                                                <button className="btn btn-primary" type="button" onClick={handleAddFields} >Add More </button>

                                            </div>
                                        </div>

                                    </> : ''

                            }

                            <div className='col-md-12 row'>
                                <div className='col-6 col-md-4 p8px'>
                                    <lable className="w-40">Cretenine Level</lable>
                                </div>

                                <div className='col-6 col-md-8'>
                                    <input className='form-control w-40 cretenine-input' name="cretenine" placeholder='Type here' max="100" min="0" type="number" disabled={  appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.appointment_id)  ? false : true} onChange={(e) => setCretenine(e.target.value)} value={cretenine} />
                                </div>

                            </div>
                            <div className='col-md-12 row'>
                                <div className='col-6 col-md-4 p8px'>
                                    <lable className="w-40">Before Weight</lable>
                                </div>

                                <div className='col-6 col-md-8'>
                                    <input className='form-control w-40 cretenine-input' disabled value={appointment.before_weight} />
                                </div>

                            </div>
                            <div className='col-md-12 row'>
                                <div className='col-6 col-md-4 p8px'>
                                    <lable className="w-40">After Weight</lable>
                                </div>

                                <div className='col-6 col-md-8'>
                                    <input className='form-control w-40 cretenine-input' disabled value={appointment.after_weight} />
                                </div>

                            </div>


                        </div>


                        <div className="row mt-5">
                            <div className="col-6 col-md-6 text-right">
                                {
                                    appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.apt_date+appointment.apt_start_time) ?
                                        <>

                                            <button className='btn-save' onClick={() => { cancelAppointment(appointment._id, appointment.center_id._id) }}>Cancel Appointment</button>
                                        </>
                                        : <Link className='btn-save' to={`/centre/${appointment.center_id?._id}`}>Book Again</Link>
                                }
                            </div>

                            <div className="col-3 col-md-3">
                                <a onClick={() => setAppointmentModal(false)} className="btn-cancel">Close</a>
                            </div>
                            {
                                    appointment.appointment_status === 'pending' && parseInt(moment().format('DDMMYYYYHHmmss')) > parseInt(appointment.apt_date+appointment.apt_start_time) ?

                            <div className="col-3 col-md-3">
                                <button type="submit" style={{ cursor: "pointer" }} className="btn-save" onClick={uploadDocuments}>Update</button>
                            </div> : ''
}
                        </div>
                    </div>



                </Modal.Body>

            </Modal>

           
              <ReportModal reportModal={reportModal} setReportModal={setReportModal} reportIndex={reportIndex} convertedFiles={convertedFiles} setConvertedfiles={setConvertedfiles} />                  

        </>
    );
}

export default ViewModal;
