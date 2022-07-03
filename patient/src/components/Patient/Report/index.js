import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
// import { ReportListData } from '../../../rawData/ReportListData';
import AddModal from './AddModal';
import EditModal from './EditModal';
import ShareModal from './ShareModal';


function Report() {
    const [reportModal, setReportModal] = useState(false)
    const [reports, setReports] = useState([]);
    const [editReport, setEditReport] = useState({});
    const [loading, setLoading] = useState(false)
    const [isShare, setIsShare] = useState(false)
    useEffect(() => {
        patientReports()
    }, [])

    function patientReports() {

        setLoading(true)
        axiosBaseUrl.get(`patients/api/reports`)
            .then((res) => {

              
                setReports(res.data.data.doc)
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
                        patientReports()


                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    return (
        <>
            <div className="row">


                <div className="col-lg-12 grid-margin stretch-card mt-5">
                    <div className="card">
                        <div className='text-right card-header'>
                            <button className='btn btn-sm btn-primary' onClick={() => { {setReportModal(true); setEditReport({}); setIsShare(false)}}}>Upload Report</button>


                        </div>
                        <div className="card-body">
                            <div className='text-center'>

                            </div>
                            <div className='table-responsive'>
                                <table className="table table-hover table-striped" >
                                    <thead>
                                        <tr>
                                            <th>S No.</th>
                                            <th>Patient</th>
                                            <th>Report</th>
                                            <th>Title</th>
                                            <th>Delete</th>
                                            <td>Share</td>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                        
                                        loading ? 
                                            <tr>
                                                <td colSpan={6} className='text-center'>
                                                    <ProcessLoader />
                                                </td>
                                            </tr>
                                            :

                                        reports.map((x, index) => {
                                            return (
                                                <tr key={x._id+"report"}>
                                                    <td>{++index}</td>
                                                    <td>{x.patientId?.name}</td>
                                                    <td><a href={env.imageurl+x.file} target="blank">View Report</a></td>
                                                    <td>{x.title}</td>
                                                    <td>

                                                        <a className='text-primary' onClick={() => { setReportModal(true); setEditReport(x); setIsShare(false) }}><i className='fa fa-edit' /></a>
                                                        <a className='text-danger ml-1' onClick={() => deleteReport(x._id)}><i className='fa fa-trash' /></a>
                                                    </td>
                                                    <td>
                                                        <button className='btn btn-sm btn-primary'onClick={() => {setReportModal(true);setIsShare(true); setEditReport(x) }} >Share</button>
                                                    </td>
                                                </tr>
                                            )
                                        })}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddModal reportModal={reportModal} setReportModal={setReportModal} patientReports={patientReports} editReport={editReport} isShare={isShare} />
            {/* {reportModal == 'add' ? <AddModal setReportModal={setReportModal} patientReports={patientReports} /> : reportModal == 'edit' ? <EditModal setReportModal={setReportModal} editReport={editReport} patientReports={patientReports} /> : reportModal == 'share' ? <ShareModal setReportModal={setReportModal} report={editReport} patientReports={patientReports} /> : ''} */}
        </>
    )
}

export default Report
