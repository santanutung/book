import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../../axiosBaseUrl'
import { env } from '../../../env'
import ProcessLoader from '../../../ReusableComponents/ProcessLoader'

function Attachments(props) {
    const { attachmentModal, setAttachmentModal, reports, reportData, setReportData } = props

    
    function reportExist(key) {
        var status = reportData.filter((x) => {
            if(x.reportId === key) {
                return x;
            }
        })
        return status.length;
    

    }

    const inputHandler = (e) => {
        let newData = reportData;
        const checked = e.target.checked;
        if (checked) {

            newData.push({reportId : e.target.value})
            // newData[e.target.name] = true

        }
        else {

            newData = reportData.filter((x) => {
                if (x.reportId !== e.target.value) {
                    return x;
                }
            })
            // newData[e.target.name] = false

        }
      
        setReportData(newData)

    }

    const reportFormHandler = (e) => {
       

        axiosBaseUrl.post(`patients/api/appointment-attachment/${reports.appointmentId}`, reportData)
            .then((res) => {
             
                if (res.status == 200) {
                    Swal.fire('', 'Report is successfully uploaded', 'success')
                 
                }


            }).catch(error => {
              
               
                if (error.response) {
                    
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
            <Modal show={attachmentModal} onHide={() => setAttachmentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <table className='table'>
                        <thead>
                            <th>#</th>
                            <th>Title</th>
                            <th>Report</th>
                        </thead>
                        <tbody>

                            {

                               

                                    reports.reports.map((x, index) => {
                                        return (
                                            <tr key={x._id + "report"}>
                                                <td>
                                                {
                                                           

                                                           reportExist(x._id) ==1 ? <input type="checkbox" value={x._id} onChange={(e) => inputHandler(e)} checked /> : <input type="checkbox" value={x._id} onChange={(e) => inputHandler(e)} />                                                               
                                                        }
                                                    
                                                </td>
                                                <td>{x.patientId?.name}</td>
                                                <td><a href={env.imageurl + x.file} target="blank">View Report</a></td>
                                                <td>{x.title}</td>

                                            </tr>
                                        )
                                    })}


                        </tbody>

                    </table>

                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={reportFormHandler} 
                        type="button" className="btn btn-primary">
                        Submit
                    </button>
                </Modal.Footer>

            </Modal>

        </>
    )
}

export default Attachments
