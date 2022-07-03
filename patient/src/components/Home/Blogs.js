import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from '../../env';

function Blogs() {

    const [blogs, setBlogs] = useState([])
    useEffect(() => {
      blogList()
    }, []);
    
    function blogList() {
        axiosBaseUrl.get(`patients/api/blogs`)
        .then((res) => {
        
            setBlogs(res.data.data)
            

        }).catch(error => {
            console.log(error)

        })
    }
    return <>
        <section id="blog" className="services mt-5">
            <div className="container">
                <div className="section-title" data-aos="fade-up">
                    <h2>Blogs</h2>
                </div>
                <div className="row">
                    {
                        blogs.slice(0,3).map((blog, index) => {
                            return (
                                <div className="col-md-6 col-lg-4 d-flex align-items-stretch mb-5 mb-lg-0" key={index}>
                                <Link to={'blog/'+blog._id} className="card blog-card" data-aos="fade-up" data-aos-delay={100}>
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
                <br />
                <br />
                <div className="row">
                    <div className="blog-btn" data-aos="fade-up" data-aos-delay={800}>
                        <Link to="/blogs" className="btn-get-started book-btn scrollto view-d">
                            View More...
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    </>;
}

export default Blogs;
