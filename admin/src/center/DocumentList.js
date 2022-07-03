import React, {useState, useEffect} from 'react'
import { env } from '../env'

function DocumentList(props) {
    const {documents} = props
   

    return (
        <div className="col-12 col-xl-4  mt-4">
            <div className="card h-100">
                <div className="card-header pb-0 p-3">
                    <h6 className="mb-0"><strong>Documents</strong></h6>
                </div>
                <div className="card-body center-profile-card-body p-3">
                  
                    <ul className="list-group">
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Document Name</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    documents.map((x) => {

                                        return (
                                            <tr key={"document" + x._id}>
                                                <td>{x.document_typeId ? x.document_typeId : ''}</td>
                                                <td><a href={env.pdfUrl + "" + x.document} target="blank">View</a></td>
                                            </tr>

                                        )
                                    })
                                }

                            </tbody>
                        </table>

                    </ul>
                </div>
            </div>

          
        </div>

    )
}

export default DocumentList
