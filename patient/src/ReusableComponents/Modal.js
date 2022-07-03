import React from 'react'

function Modal(props) {
    const {showModal, setShowModal} = props
    return (

        <>
            <div
                className={showModal ? 'modal fade show' : 'modal fade hide'}
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
                                onClick={() => setShowModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <form id="Login">
                                <div className="row">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Help us to serve you better!
                                    </h5>
                                    <div className="col-md-12">
                                        <div className="form-group form-login">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Full Name*"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-login">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="email"
                                                placeholder="Email Address*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group form-login">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                placeholder="Phone number*"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group form-login">
                                            <select
                                                className="form-select form-control"
                                                aria-label="Default select example"
                                                value=""
                                            >
                                                <option value="">Services</option>
                                                <option value={1}>One</option>
                                                <option value={2}>Two</option>
                                                <option value={3}>Three</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-check check-b">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="flexRadioDefault1"
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Credit/Debit Card
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group form-login log-f">
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id="name"
                                                placeholder="Name on Card"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group form-login log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="card"
                                                id="card"
                                                placeholder="Card Number"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2"></div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary">
                                Save &amp; Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}

export default Modal
