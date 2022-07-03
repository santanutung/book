import React from 'react'
import Layout from '../components/Layout'

function OnlinePaymentScreen() {
    return (
        <Layout>
  <section id="portfolio-details" className="portfolio-details payment-detail">

        <div className="container">
            <div className="row gy-4">
                <div className="col-lg-6 col-md-12 offset-lg-3">
                    <div className="service-info">
                        <div className="row" style={{ borderBottom: "1px solid #eee" }}>
                            <div className="col-md-6 col-6">
                                <h3>Max Hospital</h3>
                                <p>Saket, New Delhi</p>
                            </div>
                            <div className="col-md-6 col-6">
                                <h3>Rs. 2,000</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-6">
                                <div className="btn-d">
                                    <button className="btn btn-b">01 Nov'21</button>
                                </div>
                            </div>
                            <div className="col-md-6 col-6">
                                <div className="btn-d">
                                    <button className="btn btn-b">10:00 AM</button>
                                </div>
                            </div>
                            <p className="dial-l">Dialysis takes upto 4-6 hours</p>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <form
                                    action="#"
                                    method="post"
                                    role="form"
                                    className="php-email-form"
                                >
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-check check-b">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexRadioDefault1"
                                                >
                                                    Credit/Debit Card
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group log-f">
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
                                            <div className="form-group log-f">
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
                                        <div className="col-md-6">
                                            <div className="form-group log-f">
                                                <input
                                                    type="text"
                                                    placeholder="MM  | YYY"
                                                    className="form-control"
                                                    name="date"
                                                    id="date"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group log-f">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="cvv"
                                                    id="cvv"
                                                    placeholder="CVV"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2"></div>
                                        <div className="col-md-12">
                                            <div className="form-check check-b">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexRadioDefault1"
                                                >
                                                    UPI
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-check check-b">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexRadioDefault1"
                                                >
                                                    Cash on appointment
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="button-k">
                                                <a href="#" className="btn-cancel">
                                                    Cancel
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="button-s">
                                                <a href="#" className="btn-save">
                                                    Pay Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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

export default OnlinePaymentScreen
