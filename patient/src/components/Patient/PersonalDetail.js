import React from 'react'
import Layout from '../Layout'

function PersonalDetail() {
    return (
        <Layout>
            <section className="login-l">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <form action="#" method="post" role="form" className="php-email-form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <div className="file-text">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload profile-input"
                                                    id="myFile"
                                                    required
                                                />
                                                <p>Upload your image (Optional)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id="name"
                                                placeholder="Full Name*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                placeholder="Email address*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="subject"
                                                id="subject"
                                                placeholder="Phone number*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                placeholder="MM | DD | YYY"
                                                className="form-control"
                                                name="date"
                                                id="date"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="subject"
                                                id="subject"
                                                placeholder="Insurance No.(optional)*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="gender-k">
                                            <button className="btn btn-g">Male</button>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="gender-g">
                                            <button className="btn btn-g">Female</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="add-l">
                                        <h3>Address</h3>
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name
                                                    id
                                                    placeholder="Street line 1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name
                                                id
                                                placeholder="Street line 2"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name
                                                id
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name
                                                id
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group log-f">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name
                                                id
                                                placeholder="Pincode"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <h3 className="report-p">
                                        <span>Reports</span> (Upload your files)
                                    </h3>
                                    <ul className="file-bx">
                                        <li>
                                            <div className="form-group log-f">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload report-file"
                                                    style={{ width: 50, borderRadius: 0 }}
                                                    id="myFile"
                                                    required
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-group log-f">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload report-file"
                                                    style={{ width: 50, borderRadius: 0 }}
                                                    id="myFile"
                                                    required
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-group log-f">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload report-file"
                                                    style={{ width: 50, borderRadius: 0 }}
                                                    id="myFile"
                                                    required
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-group log-f">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload report-file"
                                                    style={{ width: 50, borderRadius: 0 }}
                                                    id="myFile"
                                                    required
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-group log-f">
                                                <input
                                                    type="file"
                                                    className="custom-file-upload report-file"
                                                    style={{ width: 50, borderRadius: 0 }}
                                                    id="myFile"
                                                    required
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                </div> */}
                            </form>
                        </div>
                        <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-12">
                                <div className="button-s text-center">
                                    <a href="#" className="btn-save">
                                        Save
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Layout>
    )
}

export default PersonalDetail
