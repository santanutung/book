import React from 'react'

function Modal() {
    return (
        <>
        <div
            className="modal fade show"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog login-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            // onClick={() => setShowReviewModal(false)}
                        />
                    </div>
                    <div className="modal-body">
                      
                    </div>
                    <div className="modal-footer text-center">

                        <button type="button" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Modal
