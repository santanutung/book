import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from "../../env";
import DocumentModal from './DocumentModal';

function DocumentList(props) {


    const [showDocumentModal, setShowDocumentModal] = useState("");

    const [centerDocument, setCenterDocument] = useState([])
    useEffect(() => {

        getDocuments()
    }, [])




    function getDocuments() {
        axiosBaseUrl.get(`private/center/documents`)
            .then((res) => {
                console.log(res.data.data)
                setCenterDocument(res.data.data)



            }).catch(error => {
                console.log(error)

            })
    }

    const deleteDocument = (data_id) => {

        let url = `private/center/document/${data_id}`
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.delete(url)
                    .then((res) => {

                        Swal.fire('Delete!', 'Document is successfully deleted', 'success')
                        getDocuments()

                    }).catch(error => {
                        console.log(error)

                    })


            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    return (

        <div className="col-12 col-xl-4  mt-4">
            <div className="card h-100">
                <div className="card-header pb-0 p-3">
                    <div className="row">
                        <div className="col-4 d-flex align-items-center">
                            <h6 className="mb-0">Documents</h6>
                        </div>
                        <div className="col-8 text-right">
                            <button className="btn custom-btn"
                                onClick={() => setShowDocumentModal('document')}
                            >
                                Upload Document
                            </button>
                        </div>
                    </div>

                </div>
                <div className="card-body center-profile-card-body p-3">

                    <ul className="list-group table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Document Name</td>
                                    <td>View</td>
                                    <td>Delete</td>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    centerDocument.map((x) => {

                                        return (
                                            <tr key={"document" + x._id}>
                                                <td>{x.document_typeId ? x.document_typeId : ''}</td>
                                                <td><a href={env.imageurl + "" + x.document} target="blank">View</a></td>
                                                <td><button className="btn btn-danger btn-xs" onClick={() => deleteDocument(x._id)}>Delete</button></td>
                                            </tr>

                                        )
                                    })
                                }

                            </tbody>
                        </table>

                    </ul>
                </div>
            </div>

            {
                showDocumentModal ?

                    <DocumentModal showDocumentModal={showDocumentModal} setShowDocumentModal={setShowDocumentModal} getDocuments={getDocuments} />
                    : null
            }
        </div>




    )
}

export default DocumentList
