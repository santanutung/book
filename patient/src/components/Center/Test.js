import React, { useEffect } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../Layout'

function Test() {





    return (
        <Layout>
            <section className="login-l">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">

                            <div className="card selected-slot-card" >
                              <div className='card-body'>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group  card-header">
                                            <h3 className="text-center">Appintment SLots</h3>
                                        </div>
                                    </div>

                                    {/* <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <input type="text" name="name" className="form-control" id="name" placeholder="Full Name*" required="" />
                                        </div>
                                    </div> */}
                                    <div></div>
                                    <div className="col-md-12 mt-3">
                                        <div className="form-group log-f">
                                            <strong>Center Name : MAX Hospital</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <strong>Address : MAX Hospital</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <strong>Date : 12 jan 2022</strong>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group log-f">
                                            <strong>Time : 12 AM</strong>
                                        </div>
                                    </div>
                                   

                                </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-md-12'>
                                   
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Test
