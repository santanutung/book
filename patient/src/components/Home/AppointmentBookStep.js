import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 767 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 767, min: 0 },
        items: 1
    }
};
function AppointmentBookStep() {
    return (
        <section id="book-slot-section" className="book-slot mt-3">
        <div className="container">

            <div className="section-title" data-aos="fade-up">
                <h2>Steps to book a slot with us</h2>

            </div>

            <Carousel responsive={responsive}>
                
                <div className="item">
                    <div className="mb-5 mb-lg-0">
                        <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                            <img src="img/book-slot/1.png" />
                            <p className="hosp-l">Choose a centre</p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="mb-5 mb-lg-0">
                        <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                            <img src="img/book-slot/2.png" />
                            <p className="hosp-l">Select Slot</p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="mb-5 mb-lg-0">
                        <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                            <img src="img/book-slot/3.png" />
                            <p className="hosp-l">Fill Form</p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="mb-5 mb-lg-0">
                        <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                            <img src="img/book-slot/4.png" />
                            <p className="hosp-l">Make payment</p>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="mb-5 mb-lg-0">
                        <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                            <img src="img/book-slot/5.png" />
                            <p className="hosp-l">Slot booked</p>
                        </div>
                    </div>
                </div>
            </Carousel>
            {/* <div className="row">
                <div className="owl-carousel owl-theme">
                    <div className="item">
                        <div className="mb-5 mb-lg-0">
                            <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                                <img src="img/book-slot/1.png" />
                                <p className="hosp-l">Choose a hospital</p>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="mb-5 mb-lg-0">
                            <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                                <img src="img/book-slot/2.png" />
                                <p className="hosp-l">Select Slot</p>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="mb-5 mb-lg-0">
                            <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                                <img src="img/book-slot/3.png" />
                                <p className="hosp-l">Fill Form</p>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="mb-5 mb-lg-0">
                            <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                                <img src="img/book-slot/4.png" />
                                <p className="hosp-l">Make payment</p>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="mb-5 mb-lg-0">
                            <div className="book-box" data-aos="fade-up" data-aos-delay="100">
                                <img src="img/book-slot/5.png" />
                                <p className="hosp-l">Slot booked</p>
                            </div>
                        </div>
                    </div>



                </div>


            </div> */}

        </div>
    </section>
    )
}

export default AppointmentBookStep
