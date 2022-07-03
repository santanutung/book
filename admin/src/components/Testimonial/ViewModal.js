import moment from 'moment';
import React from 'react';

function ViewModal(props) {
    const {view, setView, updateStatus} = props
  
    return (
        <div className="modal fade show modal-show" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Testimonial Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setView({})}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='row'>
                               
                                <div className='col-md-6'>
                                    <div className='form-group capitalize'>
                                        <strong>Name :</strong> {view.userId?.name}
                                    </div>
                                </div>
                                
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <strong>Date :</strong> {moment(view.createdAt).format('DD/MM/YYYY')}
                                    </div>
                                </div>
                              
                                <div className='col-md-12'>
                                    <div className='form-group query'>
                                        <strong>Query :</strong> {view.review}
                                    </div>
                                </div>
                            </div>




                        </div>
                        <div className="modal-footer">

                        {
                                                           view.verify_status == 'pending' ? 
                                                            <>
                                                             <button className='btn btn-success' onClick={() => updateStatus({'verify_status': 'approved'}, view._id)}>Approved</button>
                                                             <button className='btnbtn-danger ml-1'  onClick={() => updateStatus({'verify_status': 'reject'}, view._id)}>Reject</button>
                                                            </>
                                                            :
                                                            (
                                                                view.verify_status == 'approved' ? 
                                                                (
                                                                    view.status == 'active' ?
                                                                    <button className='btn btn-success' onClick={() => updateStatus({'status': 'inactive'}, view._id)}>Enabled</button>
                                                                    :
                                                                    <button className='btn btn-danger' onClick={() => updateStatus({'status': 'active'}, view._id)}>Disabled</button>
                                                                )
                                                                :
                                                                ''
                                                                
                                                            )
                                                           
                                                           }
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setView({})}>Close</button>
                        </div>

                    </div>
            </div>
        </div>
    )
}

export default ViewModal;
