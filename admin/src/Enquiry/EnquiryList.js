import moment from 'moment';
import React, { useState } from 'react'
import ProcessLoader from '../ReuseableComponent/ProcessLoader';
import EnquiryModal from './EnquiryModal';

function EnquiryList(props) {
    const { enquiry, getEnquiries, loading, setLoading, setEnquiryId, module } = props

    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editData, setEditData] = useState({})
    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        {
                            module !== 'dashboard' ? <th>Date</th> : ''
                        }

                        <th>Name</th>
                        {/* <th>Email</th> */}
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        {
                            module !== 'dashboard' ? <th>Action</th> : ''
                        }


                    </tr>
                </thead>
                <tbody>

                    {

                        loading ?

                            <tr>
                                <th className="text-center" colSpan="9">
                                    <ProcessLoader />  Loading ...
                                </th>
                            </tr>

                            :
                            enquiry.map((enq, index) => {
                                return (
                                    <tr key={index + "enquiry"}>
                                        <td>{enq.enquiry_no}</td>
                                        {
                                            module !== 'dashboard' ? <td>{moment(enq.date).format('DD/MM/YYYY')}</td> : ''
                                        }


                                        <td className='word-break capitalize'>{enq.name}</td>
                                        {/* <td className='word-break '>{enq.email}</td> */}
                                        <td className='word-break '>{enq.subject.substr(0, 20)}{enq.subject.length > 20 ? "..." : ''}</td>
                                        <td className='word-break '>{enq.message.substr(0, 20)}{enq.message.length > 20 ? "..." : ''}</td>
                                        <td><span className={enq.status.toLowerCase() == 'open' ? "text-success" : "text-danger"}>{enq.status}</span></td>
                                        {
                                            module !== 'dashboard' ?
                                                <td>
                                                    <button className='btn btn-sm btn-primary mr-1' onClick={() => { setEditData(enq); setShowModal(true) }}>View</button>
                                                    <button className='btn btn-sm btn-primary' onClick={() => { setEnquiryId(enq._id); }}>Follow up</button>

                                                </td> : ''
                                        }


                                    </tr>

                                )
                            })}

                </tbody>
            </table>

            {
                showModal ? <EnquiryModal setShowModal={setShowModal} editData={editData} getEnquiries={getEnquiries} /> : ''
            }

        </div>
    )
}

export default EnquiryList
