import moment from 'moment';
import React from 'react';

function ViewModal(props) {
    const {view, setView, updateStatus} = props
  
    return (
        <div className="modal fade show modal-show" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Notification Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setView({})}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='row'>
                              
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <strong>Date :</strong> {view.date}
                                    </div>
                                </div>
                              
                                <div className='col-md-12'>
                                    <div className='form-group query'>
                                        <strong>Message :</strong> {view.message}
                                    </div>
                                </div>
                            </div>




                        </div>
                        <div className="modal-footer">

                       
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setView({})}>Close</button>
                        </div>

                    </div>
            </div>
        </div>
    )
}
export default ViewModal;
