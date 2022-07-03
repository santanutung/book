import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../../axiosBaseUrl'
import Chat from './Chat'

function Enquiry() {
    const [enquiries, setEnquiries] = useState([])
    const [enquiryId, setEnquiryId] = useState('')
    const [loader, setLoader] = useState(false)
    useEffect (() => {
        getEnquiries()
    }, [])

    function getEnquiries() {
        axiosBaseUrl.get('patients/api/enquiry?page=1&limit=10')
        .then((res) => {
           
            setEnquiries(res.data.data)

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
            setLoader(false)

        })
    }
    return (
        <>
        <div className="row">


            <div className="col-lg-12 grid-margin stretch-card mt-5">
                <div className="card">
                   
                    <div className="card-body">
                        <div className='text-center'>

                        </div>
                        <div className='table-responsive'>
                            <table className="table table-hover table-striped" >
                                <thead>
                                    <tr>
                                        <th>Enquiry Id</th>
                                        <th>Subject</th>
                                        <th>Query</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                    
                                    loader ? 
                                        <tr>
                                            <td colSpan={6} className='text-center'>
                                                {/* <ProcessLoader /> */}
                                            </td>
                                        </tr>
                                        :

                                    enquiries.map((x, index) => {
                                        return (
                                            <tr key={x._id+"report"}>
                                                <td>{x.enquiry_no}</td>
                                                <td>{x.subject}</td>
                                                <td>{x.message}</td>
                                                <td>
                                                    <button className='btn btn-sm btn-primary' onClick={() => setEnquiryId(x._id)}>Message</button>
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
        {
            enquiryId ? 
            <Chat enquiryId={enquiryId} setEnquiryId={setEnquiryId} /> : ''
        }
      
        {/* {reportModal == 'add' ? <AddModal setReportModal={setReportModal} patientReports={patientReports} /> : reportModal == 'edit' ? <EditModal setReportModal={setReportModal} editReport={editReport} patientReports={patientReports} /> : reportModal == 'share' ? <ShareModal setReportModal={setReportModal} report={editReport} patientReports={patientReports} /> : ''} */}
    </>
    )
}

export default Enquiry
