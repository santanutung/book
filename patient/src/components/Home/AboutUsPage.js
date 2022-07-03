import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../Layout'
import ContactForm from './ContactForm'

function AboutUsPage() {
    const [about, setAbout] = useState({})
    useEffect(() => {
        window.scroll(0,0);
        getTermCondition()
     }, [])
     function getTermCondition() {
         axiosBaseUrl.get(`setting/about-us`)
             .then((res) => {
             
                setAbout(res.data.data.description)
             
 
 
             }).catch(error => {
            
                 if (error.response) {
                     alert(error.response.data.error)
 
                 }
                 else if (error.request) {
                     // The request was made but no response was received
                 
                 } else {
                     // Something happened in setting up the request that triggered an Error
                     console.log('Error', error.message);
                 }
             })
 
     }
    return (
        <Layout>
            <>
                <section id="services" className="about-sec">
                    <div className="container">
                        <div className="section-title" data-aos="fade-up">
                            <h2>About Us</h2>
                        </div>
                        <div className="row text-center">
                        <div dangerouslySetInnerHTML={{__html: about}} />
                            
                        </div>
                    </div>
                </section>
                {/* End Services Section */}
            </>

            <ContactForm />
        </Layout>
    )
}

export default AboutUsPage
