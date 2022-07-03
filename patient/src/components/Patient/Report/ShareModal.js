import React, {useEffect, useState} from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';


function ShareModal(props) {
    const { setReportModal, report, patientReports} = props
    const [centers, setCenters] = useState([]);
    const [centerData, setCenterData] = useState([])
    useEffect(() => {
        getAppointmentCenters()
        setCenterData(report.shareWith)
     
    }, [])

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

    const reportFormHandler = (e) => {


        axiosBaseUrl.post(`patients/api/reports/${report._id}`, centerData)
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
                                                <tr key={index+"center"}>
                                                    <td>
                                                        {
                                                           

                                                           centerExist(center._id[0]._id) ==1 ? <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} checked /> : <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} />                                                               
                                                        }
                                                    
                                                        {/* <input type="checkbox" value={center._id[0]._id} onChange={(e) => inputHandler(e)} checked={ centerExist(center._id[0]._id) ==1 ? true : false}  /> */}
                                                    </td>
                                                    <td>
                                                        {center._id[0].name+" ("+center._id[0].area+")"}
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
                        <button type="button" onClick={(e) => reportFormHandler(e)} className="btn btn-primary">
                            Save &amp; Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default ShareModal
