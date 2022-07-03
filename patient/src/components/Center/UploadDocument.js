import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import { env } from '../../env';
import numberFormat from '../../functions';
import { documents } from '../../rawData/DataSet'
import Layout from '../Layout';
import ReportModal from '../Profile/Appointment/ReportModal';


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}


function UploadDocument() {
    let location = useLocation();
    console.log(location)
    const appointmentId = localStorage.getItem('apt_key')
    const [convertedFiles, setConvertedfiles] = useState([{ image: '' }])
    // const [appointmentId, setAppointmentId] = useState(localStorage.getItem('apt_key'))
    const [cretenine, setCretenine] = useState('')
    const [errors, setErrors] = useState({})
    const [appointment, setAppointment] = useState({})
    let history = useHistory();

    const [reports, setReports] = useState([])
    const [selectedReport, setSelectedReport] = useState({})
    const [reportModal, setReportModal] = useState(false)
    const [reportIndex, setReportIndex] = useState('')
    const [profileData, setProfileData] = useState({})
    const { setLoaderState } = useGlobalContexts()
    useEffect(() => {
        //   alert(appointmentId)

        // if(!localStorage.getItem('apt_key')) {
        //     return "teesr";
        // }
        // console.log(location.state.appointment, "state")
        if (location.state) {
            getAppointment()
            // setAppointment(location.state.appointment)
            // getReports()
        }
        getProfile()

    }, []);


    function getAppointment() {
        // setLoading(true)

        var url = `patients/api/appointment/${location.state.appointment_id}`
        // var url = `patients/api/list-appointment`
        axiosBaseUrl.get(url)
            .then((res) => {
                console.log(res.data.data);

                setAppointment(res.data.data)
                getReports(res.data.data.patient_familyMemberId)
                // setAppointments(res.data.data.doc)
                // setFilterAppointments(res.data.data.doc)

                // setTotalPages(Math.ceil(res.data.data.doc.length / limit))
                // setLoading(false)

            }).catch(error => {
                console.log(error)

            })
    }



    function getProfile() {

        axiosBaseUrl.get(`patients/api/profile`)
            .then((res) => {
                setProfileData(res.data.data)

            }).catch(error => {
                console.log(error)

            })
    }




    function getReports(patient_familyMemberId) {
        if (location.state.appointment_id) {
            // var url = `patients/api/reports?patientId=${location.state.appointment.patient_familyMemberId}`
            var url = `patients/api/reports?patientId=${patient_familyMemberId}`
            axiosBaseUrl.get(url)
                .then((res) => {
                    console.log(res.data.data, "reports")
                    setReports(res.data.data.doc)
                    // setMembers(res.data.data)

                }).catch(error => {
                    console.log(error)

                })
        }


    }



    function uploadDocuments() {
        var error_data = {}
        var error_status = false

        if (convertedFiles.length === 0 && cretenine === '') {
            error_status = true;
            setErrors({ error: 'please upload document or add cretenine level' })
        }

        if (error_status === false) {
            axiosBaseUrl.post(`patients/api/appointment/upload-documents`, { appointmentId: appointmentId, files: convertedFiles, cretenine: cretenine })
                .then((res) => {
                    console.log(res)
                    Swal.fire("", `Your slot for dialysis is booked and you appointment id is ${appointment.appointment_key}`, 'success')
                    history.push("/Profile");
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


    async function displayRazorpay() {
        // alert("test")
        console.log(data, 'razor pay')
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        // checking if the script is added or not
        if (!res) {

            alert("Unable to load the the script")
            return
        }

        // var appointment = data
        var charges = appointment.charges;
        var appointment_id = appointment._id;
        // Making an Post api call to the server to proceed the payment
        var data = await fetch(`${env.baseUrl}razorpay?total=${appointment.charges * 100}`, { method: 'POST' }).then((t) =>
            t.json()
        )

        const options = {
            // key: "rzp_test_t9VIr7uZmekfPI", // Enter the Key ID generated from the Dashboard
            key: env.razorpay_key,
            "amount": charges * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": 'INR',
            "name": "Book Care",
            "description": "Test Transaction",
            "image": env.razorpay_logo,
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {

                createTransaction(data.id, charges, appointment._id, response.razorpay_payment_id, appointment)

            },
            "error": function (response) {

                alert("ERR")
            },
            "prefill": {
                "name": profileData.name,
                "email": profileData.email,
                "contact": profileData.phone
            },

        };
        setLoaderState(false)

        // Open the payment window on the screen
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }


    function createTransaction(order_id, amount, appointment_id, transaction_id, appointment) {
        var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'appointment' };
        setLoaderState(true)
        axiosBaseUrl.post(`patients/api/create-transaction`, data)
            .then((res) => {

                // alert("succes")

                setLoaderState(false)
                // socket.emit("notification", appointment.center_id._id, res.data.notification);
                // socket.emit("book-slot", { centerId:appointment.center_id._id, date: appointment.date, data: res.data.notification });
                Swal.fire("", `payment is successfully done of ${appointment.appointment_key}`, 'success')
                getAppointment()
                


            }).catch(error => {


            })
    }

    return (



        <Layout>
            <section id="portfolio-details" className="portfolio-details">
                <div className="container">
                    <div className="row gy-4">
                        <div className='col-md-12'>
                            <h3 className='text-center slot-booked-message'>Your slot for dialysis is booked</h3>
                        </div>
                        <div className="col-lg-6 offset-lg-3">
                            <div className="service-info">
                                <div className="row" style={{ borderBottom: "2px solid #457b9d29" }}>
                                    <div className="col-md-6 col-6">
                                        <h3 className='capitalize'>{appointment.center_id?.name}</h3>
                                        <p className='center-address mb-3 mt-2'>{appointment.center_id?.area + " " + appointment.center_id?.city}</p>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <h3 style={{ textAlign: "right" }}>{numberFormat(appointment.charges).replace('.00', '')}</h3>
                                <p className='appointment-payment mb-3 mt-2 text-right color'>Payment Mode: <br />{appointment.payment_type === 'cash' ? 'cash on appointment' : 'online paid'}</p>

                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-md-4 col-4 col-sm-12 appointmemt-id-sec">
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

                                    <div className='col-m-12'>
                                        <h5 className='mb-3 theme-color'>Upload your reports (optional)</h5>
                                    </div>
                                    {
                                        reports ?
                                            reports.map((report, index) => {
                                                return (
                                                    <div className='col-md-6' onClick={(e) => inputHandler(e, report._id, report)}>
                                                        <div className="lipid-btn" href="#!">

                                                            <i class={selectedReport['reports']?.includes(report._id) ? "fas fa-circle" : 'far fa-circle'}></i>

                                                            {/* {reportExist(report._id) > 0 ? <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} checked /> : <input type="checkbox" value={report._id} onChange={(e) => inputHandler(e, report._id, report)} />} */}
                                                            {" "}
                                                            &nbsp;&nbsp;<a href={env.imageurl + report.file} target="blank"> {report.title}</a>&nbsp;&nbsp;{" "}

                                                            {" "}
                                                            &nbsp;&nbsp;

                                                        </div>
                                                    </div>
                                                )
                                            }) : ''
                                    }
                                    {
                                        convertedFiles.map((image, index) => {
                                            return (
                                                <div className="col-md-6 mb-3 mb-2">

                                                    <div className="relative">
                                                        {/* {image.image} */}
                                                        {/* <i className="fas fa-circle"></i> */}
                                                        {
                                                            image.image ?
                                                                <button target="_blank" className="file-upload" type="button">{image.title} <i className="fas fa-times" onClick={() => removeReport(index)}></i></button>
                                                                :
                                                                <>
                                                                    <button className="file-upload" type="button" value="male" name="gender" onClick={() => { setReportModal(true); setReportIndex(index) }}>Upload <i className="fas fa-upload"></i></button>
                                                                    {/* <input type="file" accept='application/pdf, image/*' className='file-input' onChange={(e) => browseFile(e, index)} /> */}
                                                                </>
                                                        }

                                                    </div>
                                                </div>
                                            )
                                        })
                                    }


                                    <div className="col-md-4 mb-3">
                                        <div className="relative">
                                            <button className="btn btn-primary" type="button" onClick={handleAddFields} >Add More </button>

                                        </div>
                                    </div>

                                    <div className='col-md-12 row mt-2'>
                                <div className='col-6 col-md-4 p8px'>
                                    <lable className="w-40">Cretenine Level</lable>
                                </div>

                                <div className='col-6 col-md-6'>
                                    <input className='form-control w-40 cretenine-input' placeholder='Type here' max="100" min="0" type="number" nname="cretenine" onChange={(e) => setCretenine(e.target.value)} value={cretenine} />
                                    <span className='text-danger'>{errors.error}</span>
                                </div>

                            </div>

                                    {/* <div className='col-md-12'>
                                        <lable>Cretenine Level</lable> <input className='form-control' name="cretenine" onChange={(e) => setCretenine(e.target.value)} value={cretenine} />
                                    </div>
                                    <span className='text-danger'>{errors.error}</span> */}

                                </div>


                                <div className="row mt-5">
                                    <div className='col-md-6 offset-md-3 d-flex p-0'>
                                        <div className="form-group m-2">
                                            <Link to="/" className="btn-cancel">Skip</Link>
                                        </div>
                                        {
                                            appointment.payment_status === 'pending' ?
                                                <div className="form-group m-2">
                                                    <button className="btn-save" onClick={() => displayRazorpay(appointment)}>
                                                        Pay
                                                    </button>
                                                </div> : ''
                                        }

                                        <div className="form-group m-2">
                                            <button type="submit" style={{ cursor: "pointer" }} className="btn-save" onClick={uploadDocuments}>Done</button>
                                        </div>
                                    </div>
                                </div>


                                {/* <div className="row mt-5">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <Link to="/" className="btn-cancel">Skip</Link>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <button className="cancel__css" onClick={() => displayRazorpay(appointment)}>
                                                Pay
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <button type="submit" style={{ cursor: "pointer" }} className="btn-save" onClick={uploadDocuments}>Done</button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>


                        </div>

                    </div>
                </div>
            </section>

            <ReportModal reportModal={reportModal} setReportModal={setReportModal} reportIndex={reportIndex} convertedFiles={convertedFiles} setConvertedfiles={setConvertedfiles} />


        </Layout>
        // <div
        //     className="modal fade show"
        //     id="exampleModal"
        //     tabIndex={-1}
        //     aria-labelledby="exampleModalLabel"
        //     aria-hidden="true"
        // >
        //     <div className="modal-dialog modal-lg">
        //         <div className="modal-content">
        //             <div className="modal-header">
        //                 <button
        //                     type="button"
        //                     className="btn-close"
        //                     data-bs-dismiss="modal"
        //                     aria-label="Close"
        //                 onClick={() => {setUploadDocumentForm(false); setShowAppointmentModal(false)}}
        //                 />
        //             </div>
        //             <div className="modal-body">
        //                 <div className="row">
        //                 <div className="row">
        //                     <h5 className="modal-title" id="exampleModalLabel">
        //                        Select reports and Upload or Update Cretenine level 
        //                     </h5>

        //                 </div>
        //                 <div className='col-md-12'>
        //                     <lable className="mb-2">Cretenine level </lable>
        //                     <input className='form-control' name="cretenine" onChange={(e) => setCretenine(e.target.value)} value={cretenine} />
        //                 </div>
        //                     <div className="col-md-12 mt-3">
        //                         <lable className="mb-2">Select reports and Upload</lable>
        //                         <input type="file" name="images" className='form-control' accept='application/pdf, image/*, application/msword' multiple onChange={(e) => handleFile(e)} />
        //                         <span>{errors.report}</span>


        //                         <div className='table-responsive'>

        //                             {
        //                                 convertedFiles.length > 0 ?
        //                                     <table className='table'>
        //                                         <thead>
        //                                             <tr>
        //                                                 <td>Document Title</td>
        //                                                 <td>Document</td>
        //                                                 <td></td>
        //                                             </tr>
        //                                         </thead>
        //                                         <tbody>
        //                                             {
        //                                                 convertedFiles.map((x, index) => {

        //                                                     return (
        //                                                         <tr key={index+"report"}>
        //                                                             <td>
        //                                                                 {
        //                                                                     x.key === 'Other' ?

        //                                                                         <input
        //                                                                             type="text"
        //                                                                             name="other_title"
        //                                                                             className="form-control"

        //                                                                             placeholder="Title*"
        //                                                                             required
        //                                                                             onChange={(e) => editProfileHandler(e, index)}

        //                                                                         />

        //                                                                         :
        //                                                                         <>

        //                                                                             <select
        //                                                                                 type="text"
        //                                                                                 name="title"
        //                                                                                 className="form-control"

        //                                                                                 placeholder="Title*"
        //                                                                                 required
        //                                                                                 onChange={(e) => editProfileHandler(e, index)}
        //                                                                             // value={addData.title}
        //                                                                             >
        //                                                                                 <option value="">Select Report Type</option>

        //                                                                                 {documents.map((document, index) => {
        //                                                                                     return (
        //                                                                                         <option value={document}>{document}</option>
        //                                                                                     )
        //                                                                                 })}
        //                                                                             </select>
        //                                                                         </>

        //                                                                 }

        //                                                                 <span className='text-danger'>{errors['title'+index]}</span>
        //                                                             </td>
        //                                                             <td>
        //                                                                 <div>
        //                                                                     <a href={x.image} target="blank" >View {index}</a>
        //                                                                 </div>
        //                                                             </td>
        //                                                             <td>
        //                                                                 <button className='btn btn-sm btn-danger' onClick={() => removeReport(index)}>Delete</button>
        //                                                             </td>
        //                                                         </tr>
        //                                                     )
        //                                                 })
        //                                             }



        //                                         </tbody>
        //                                     </table>

        //                                     :
        //                                     ''
        //                             }

        //                         </div>





        //                     </div>
        //                 </div>



        //             </div>
        //             <div className="modal-footer">
        //                 <button
        //                     type="button"
        //                     className="btn btn-secondary"
        //                     data-bs-dismiss="modal"
        //                 onClick={() => {setUploadDocumentForm(false); setShowAppointmentModal(false)}}
        //                 >
        //                     Cancel
        //                 </button>
        //                 <button type="button"
        //                     onClick={uploadDocuments}
        //                     className="btn btn-primary">
        //                     Upload
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>


    )
}

export default UploadDocument
