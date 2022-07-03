import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';
import ContactForm from '../Home/ContactForm';
import Layout from '../Layout';

function Blog() {

    const [blogs, setBlogs] = useState([])
    useEffect(() => {
      blogList()
      window.scrollTo(0,0);
    }, []);
    
    function blogList() {
        axiosBaseUrl.get(`patients/api/blogs`)
        .then((res) => {
          
            setBlogs(res.data.data)
            

        }).catch(error => {
        

        })
    }


  return (
    <Layout>
    <>
        <section id="services" className="about-sec">
            <div className="container">
                <div className="section-title" data-aos="fade-up">
                    <h2>Blogs</h2>
                </div>
                <div className="row text-center">
                
                <div className="row">
                    {
                        blogs.map((blog, index) => {
                            return (
                                <div className="col-md-6 col-lg-4 d-flex align-items-stretch mb-3 blog-items" >
                                <Link to={'blog/'+blog._id} className="card blog-card w-100" data-aos="fade-up" data-aos-delay={100}>
                                    <div className="card-hero">
                                        <img src={env.imageurl+blog.image} className="img-fluid" />
                                    </div>
                                    <div className="card-header">
                                        <h3>{blog.title}</h3>
                                    </div>
                                    <div className="card-body blog-c">
                                        <p className="p-blog">
                                           {blog.short_description}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            )
                        })
                    }
                    </div>
                    
                </div>
            </div>
        </section>
        {/* End Services Section */}
    </>

    <ContactForm />
</Layout>
)
}

export default Blog;
