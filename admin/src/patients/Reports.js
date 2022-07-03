import React from 'react'
import { env } from '../env'

function Reports(props) {
    const {reports} = props
    return (
        <div
            className="tab-pane fade active show"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
        >
            <div className="table-responsive">
                <table className="table table-hover" >
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Patient Name</th>
                            <th>Report Name</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reports.map((report, index) => {
                                return (
                                    <tr key={index}>
                                    <td>{++index}</td>
                                                    <td>{report.patientId?.name}</td>
                                                  
                                                    <td>{report.title}</td>
                            <td><a href={env.imageurl+report.file} className="btn btn-sm btn-secondary" target="blank">View</a></td>
                        </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </table>

            </div>


        </div>
    )
}

export default Reports
