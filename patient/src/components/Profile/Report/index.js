import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
import AddModal from './AddModal';

function Report() {

    const [members, setMembers] = useState([]);

    const [activeMember, setActiveMember] = useState("")
    const [reportModal, setReportModal] = useState(false)
    const [reports, setReports] = useState([]);
    const [editReport, setEditReport] = useState({});
    const [loading, setLoading] = useState(false)
    const [isShare, setIsShare] = useState(false)
    const [selectedReport, setSelectedReport] = useState({})
    const [selectedReport1, setSelectedReport1] = useState([])
    const [menu, setMenu] = useState("")

    useEffect(() => {
        patientFamily()
    }, [])

    function patientFamily() {
        setLoading(true)
        axiosBaseUrl.get(`patients/api/family-member-list`)
            .then((res) => {
                setMembers(res.data.data)
                setLoading(false)

            }).catch(error => {
                console.log(error)

            })
    }
    function deleteReport(id) {

        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`patients/api/reports/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Report is successfully deleted', 'success')
                        patientFamily()


                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    const inputHandler = (member, report, index) => {
        let newData = selectedReport['test'] || [];
        // let newData1 = selectedReport1
        if (activeMember !== member) {
            setActiveMember(member)
            newData = []
        }

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
        setSelectedReport({ ...selectedReport, ['test']: newData })


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


            <div
                className="tab-pane fade show active"
                id="pills-contact"
                role="tabpanel"
                aria-labelledby="pills-contact-tab"
            >

                {
                     loading ?
                     <div className='text-center'>
                         <ProcessLoader />
                     </div>
                     :
                     members.length == 0 ?

                         <div className='text-center mt-5'>
                             <h5 className='text-center text-theme-color'>Reports are not available</h5>
                         </div>


                         :
                         
                    members.map((x, index) => {
                        return (
                            <>
                                <div className="card shadow sp_csg">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3 col-4 patient">

                                                <div className="user-Css mt-5">
                                                    <div className='profile-icon'>
                                                        <p>
                                                            {x.name?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className='patient-name'>
                                                        <span className="patn-css">
                                                            <div>
                                                                Patient:
                                                            </div>
                                                            <div className='capitalize'>
                                                                {x.name}
                                                            </div>

                                                        </span>
                                                    </div>
                                                </div>



                                            </div>
                                            <div className="col-md-9 col-8">
                                                <div className='row'>
                                                    {
                                                        x.patients_reports ?
                                                            x.patients_reports.map((report, index) => {

                                                                return (
                                                                    <div className='col-md-6' >
                                                                        <div className="lipid-btn d-flex" >
                                                                            {/* {
                                                                    selectedReport.length
                                                                } */}
                                                                           <p className='text-left w-100 pointer' onClick={(e) => inputHandler(x._id, report, index)}>
                                                                           <i class={selectedReport['test']?.includes(report._id) ? "fas fa-circle" : 'far fa-circle'}></i>
                                                                            {" "}
                                                                            <span className='text-left' >&nbsp;&nbsp; {report.title}&nbsp;&nbsp;{" "}</span>

                                                                           </p>
                                                                            {/* <span> */}

                                                                                <i
                                                                                    onClick={() => menu === report._id ? setMenu('') : setMenu(report._id)}
                                                                                    className="fa fa-ellipsis-v"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                {/* <i
                                                                                    className="fa fa-edit"
                                                                                    aria-hidden="true"
                                                                                    onClick={() => { setReportModal(true); setEditReport(report); setIsShare(false); setActiveMember(x._id); }}
                                                                                />

                                                                                <i
                                                                                    className="fa fa-trash"
                                                                                    aria-hidden="true" onClick={() => deleteReport(report._id)} /> */}
                                                                            {/* </span> */}
                                                                            <ul className={menu === report._id ? 'report-menu' : 'report-menu hide'}>
                                                                                <li><a onClick={() => deleteReport(report._id)} >Delete</a></li>
                                                                                <li><a    onClick={() => { setReportModal(true); setEditReport(report); setIsShare(false); setActiveMember(x._id); }}>Edit</a></li>
                                                                            </ul>
                                                                            {" "}
                                                                            &nbsp;&nbsp;

                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) : ''
                                                    }
                                                </div>
                                                {/* <a className="lipid btn" href="#!">
                                                {" "}
                                                &nbsp;&nbsp; Lipid_Report &nbsp;&nbsp;{" "}
                                                <i
                                                    className="fa fa-ellipsis-v"
                                                    aria-hidden="true"
                                                />{" "}
                                                &nbsp;&nbsp;
                                            </a>
                                            <a className="lipid btn" href="#!">
                                                {" "}
                                                &nbsp;&nbsp; ABC Reports &nbsp;&nbsp;{" "}
                                                <i
                                                    className="fa fa-ellipsis-v"
                                                    aria-hidden="true"
                                                />{" "}
                                                &nbsp;&nbsp;
                                            </a>{" "} */}
                                                <br />
                                                <br />
                                                <a className="upload-report-btn" onClick={() => { { setReportModal(true); setActiveMember(x._id); setEditReport({}); setIsShare(false) } }} >
                                                    Upload <i className="fa fa-upload" aria-hidden="true" />
                                                </a>

                                            </div>

                                            <div className="text-right">
                                                <a className="know__nore"
                                                    onClick={() => { setReportModal(true); setIsShare(true); }}

                                                >
                                                    Share
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <br />
                            </>
                        )
                    })
                }



            </div>
            <AddModal reportModal={reportModal} setReportModal={setReportModal}
                // patientReports={patientReports} 
                editReport={editReport} isShare={isShare} activeMember={activeMember} patientFamily={patientFamily} selectedReport={selectedReport} />
        </>

    );
}

export default Report;
