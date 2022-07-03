import React, {useState, useEffect} from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../Layout'

function PastAppointment() {

  
    return (
        <Layout>

            <section className="past-appointment">
                <div className="container">
                    <div className="row">

                        <div className="col-md-8 offset-md-2">
                            <p className="heading-t">Thursday, 04 Nov 2021</p>
                            <div className="service-bx service-l">

                                <img src="img/banner-inner.jpg" width="100%" height="400px" />
                                    <div className="col-md-12">
                                        <div className="row service-pd">

                                            <div className="col-md-6">
                                                <div className="service">
                                                    <h3>Max Hospital</h3>

                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="service-i">
                                                    <i className="fa fa-heart-o" aria-hidden="true"></i><br /><br />


                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="service">
                                                            <p>Date <span className="bed-l">04 | Nov | 2021</span></p>
                                                            <p className="sp-se">2,000 <span>Per Session</span></p>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="service">
                                                            <p>Timings <span className="bed-l">10:00-18:00</span></p>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>


                                    </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

        </Layout>
    )
}

export default PastAppointment
