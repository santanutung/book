import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../Layout'
import ContactForm from './ContactForm'

function PrivacyPolicy() {
    const [policy, setPolicy] = useState()
    useEffect(() => {
        window.scroll(0,0);
       getTermCondition()
    }, [])
    function getTermCondition() {
        // alert("test")
        axiosBaseUrl.get(`setting/privacy-policy`)
            .then((res) => {
            
                setPolicy(res.data.data.description)
             


            }).catch(error => {
           
                if (error.response) {
                    alert(error.response.data.error)

                }
                else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            })

    }
    return (
        <Layout>
            ;<>
                {/* ======= Services Section ======= */}
                <section id="services" className="privacy-sec">
                    <div className="container">
                        <div className="section-title" data-aos="fade-up">
                            <h2>Privacy Policy</h2>
                        </div>
                        <div className="row">
                        <div dangerouslySetInnerHTML={{__html: policy}} />
                           
                        </div>
                    </div>
                </section>
                {/* End Services Section */}
            </>

            <ContactForm />
        </Layout>
    )
}

export default PrivacyPolicy
