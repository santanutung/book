import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Modal from '../../ReusableComponents/Modal'
import Layout from '../Layout'
import AppointmentBookStep from './AppointmentBookStep'
import Blogs from './Blogs'
import CenterApp from './CenterApp'
import ContactForm from './ContactForm'
import JoinUs from './JoinUs'
import Partners from './Partners'
import Testimonial from './Testimonial'
import Testimonials from './Testimonials'
import WhyChooseUs from './WhyChooseUs'


function Home() {
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {

        // navigator.geolocation.getCurrentPosition((position) => {
        //     console.log(position.coords)
        // })

       


    }, [])
    // const executeScroll = () => myRef.current.scrollIntoView()  



    
    return (
        <Layout>


            {/* Hero Section */}
            <section id="hero" className="d-flex align-items-center">

                <div className="container">
                    <div className="row">

                    <div className="col-lg-6 col-md-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
          <div className="header-j">
          <h1 data-aos="fade-up">Booking dialysis </h1>
         <h1 data-aos="fade-up">made easy</h1>
       </div>
          <div data-aos="fade-up" data-aos-delay="800">
            <Link  to="/centres"  className="btn-get-started book-btn scrollto">Book a slot</Link>
            <a onClick={() => window.scroll(0,document.getElementById("book-slot-section").offsetTop-50) } className="btn-get-started konw-btn scrollto">Know more</a>
          </div>
        </div>


                        {/* <div className="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
                        <h1 data-aos="fade-up">Booking dialysis </h1>
         <h1 data-aos="fade-up">made easy</h1>

                            <div data-aos="fade-up" data-aos-delay="800">
                                <Link to="/centres" className="btn-get-started book-btn scrollto">Book a slot</Link>
                                <a onClick={() => window.scroll(0,document.getElementById("book-slot-section").offsetTop-50) } className="btn-get-started konw-btn scrollto">Know more</a>
                            </div>
                        </div> */}
                        <div className="col-lg-6 col-md-6 order-1 order-lg-2 hero-img" data-aos="fade-left" data-aos-delay="200">
                            <img src="img/banner.png" className="img-fluid animated" alt="" />
                        </div>
                    </div>
                </div>

            </section>
            {/* End Hero */}

            <Modal showModal={showModal} setShowModal={setShowModal} />

            {/* Features Section */}
            <Partners setShowModal={setShowModal} />
            {/* End Features Section */}



            {/* <div> */}

                {/* book a slot */}
                <AppointmentBookStep />

                {/* End book a slot Section */}


                {/* Services Section */}
                <WhyChooseUs />
                {/* End Services Section */}
                {/* <CenterApp /> */}


            {/* </div> */}

            <JoinUs />

            {/* Testimonials Section */}
            <Testimonials />
            {/* <Testimonial /> */}
            {/* End Testimonials Section */}


            {/* Contact Section */}
            <ContactForm />
            {/* End Contact Section */}

             {/* Blocgs Section */}
             <Blogs />
            {/* End Blocgs Section */}


            {/* End #main  */}

            {/* Footer */}

            {/* End Footer */}

        </Layout>
    )
}

export default Home
