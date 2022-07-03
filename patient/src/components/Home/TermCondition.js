import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../Layout'
import ContactForm from './ContactForm'

function TermCondition() {

    const [tc, setTC] = useState()
    useEffect(() => {
        window.scroll(0,0);
       getTermCondition()
    }, [])
    function getTermCondition() {
        axiosBaseUrl.get(`setting/term-condition`)
            .then((res) => {
            
                setTC(res.data.data.description)
            


            }).catch(error => {
                console.log(error)
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
                            <h2>Terms &amp; Conditions</h2>
                        </div>
                        <div className="row">
                        <div dangerouslySetInnerHTML={{__html: tc}} />
                            
                            
                        </div>
                    </div>
                </section>
                {/* End Services Section */}
            </>

            <ContactForm />
        </Layout>
    )
}

export default TermCondition
