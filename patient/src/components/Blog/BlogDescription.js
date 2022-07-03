import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';
import ContactForm from '../Home/ContactForm';
import Layout from '../Layout';

function BlogDescription() {
    const [blog, setBlog] = useState([])

    const {blogId} = useParams()
    useEffect(() => {
        getBlog()
      window.scrollTo(0,0);
    }, []);
    
    function getBlog() {
        axiosBaseUrl.get(`patients/api/blog/${blogId}`)
        .then((res) => {
     
            setBlog(res.data.data)
            

        }).catch(error => {
         

        })
    }
return (
<Layout>
    <>
        <section id="services" className="about-sec blog-description-desc">
            <div className="container mt-3">
                <h1 className='blog-title'>{blog.title}</h1>
            <div className="card max-lab blog-images" style={{ backgroundImage: "url(" + env.imageurl + blog.image + ")" }}>
                                                {/* <div className="container-fliud">
                                                    <div className="wrapper row">
                                                        <div className="preview col-lg-12 blogi-image" style={{ backgroundImage: "url(" + env.imageurl + blog.image + ")" }}>
                                                          
                                                        </div>
                                                      
                                                    </div>
                                                </div> */}
                                            </div>
            {/* <div className='row'>
                <div className='col-md-10 offset-md-1'>
                <img src={env.imageurl + blog.image} />
                </div>
            </div> */}
            <p>{blog.short_description}</p>

<div dangerouslySetInnerHTML={{ __html: blog.description }} />
                
            </div>
        </section>
        {/* End Services Section */}
    </>

    <ContactForm />
</Layout>
)
}

export default BlogDescription;
