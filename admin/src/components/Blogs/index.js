import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import Layout from '../../Layout';
import Pagination from '../../ReuseableComponent/Pagination';
import ProcessLoader from '../../ReuseableComponent/ProcessLoader';
import BlogCard from './BlogCard';

function Blogs() {

  const [blogs, setBlogs] = useState([])
  const [loader, setLoader] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getBlogs()
  }, [])


  function getBlogs(){
    setLoader(true)
    // var url = `admin/center?page=${page}&limit=6&verify_status=approved`;

    // if (filter.search != '') {
    //     url += `&${filter.search_by}=${filter.search}`
    // }

    axiosBaseUrl.get(`admin/blogs`)
        .then((res) => {
            console.log(res.data.data)
            // alert(res.data.page1)
            setBlogs(res.data.data)
            setLoader(false)
            // setTotalPages(res.data.page1)

        }).catch(error => {
            console.log(error.response)
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


  function changePage(page){

  }

  function deleteBlog(id) {

    Swal.fire({
        title: 'Are You Sure?',
        showCancelButton: true,
        confirmButtonText: `Delete`,
    }).then((result) => {
        if (result.isConfirmed) {

            axiosBaseUrl.delete(`admin/blog/${id}`)
                .then((res) => {

                    Swal.fire('', 'Blog is successfully deleted', 'success')
                    getBlogs()


                }).catch(error => {
                    console.log(error)

                })

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    });
}

  return (
    <Layout>


            <div className="main-panel">
                <div className="content-wrapper">




                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Manage Blogs</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-12 text-right">
                            <h6 className="card-title">
                                <Link className="btn custom-btn" to="/addBlog">
                                    Add Blog
                                </Link>

                            </h6>
                        </div>
                    </div>
                    {/* <div className="card mt-3">
                        <div className="card-body">
                            <form className="filter-form" onSubmit={formData}>
                                <input type="hidden" name="type" defaultValue="all" />
                                <div className="row">


                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label>Search</label>
                                            <input
                                                className="form-control search input-box"
                                                name="search"
                                                id="search"
                                                onChange={(e) => handle(e)}
                                                value={filter.search}

                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>Filter By</label>
                                            <select
                                                className="form-control search_by"
                                                name="search_by"
                                                id="search_by"
                                                onChange={(e) => handle(e)}
                                                value={filter.search_by}
                                            >
                                                <option value="all">Filter By</option>
                                                <option value="address">Address</option>
                                                <option value="city">City</option>
                                                <option value="state">State</option>
                                                <option value="name">Center Name</option>
                                                <option value="pincode">Pincode</option>
                                                <option value="email">Email</option>
                                                <option value="contact_no">Contact Number</option>
                                                <option value="status">Status</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-right">

                                        <button className="btn custom-btn btn-sm" type="submit">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div> */}

                    <div className="center_list" id="filter-data">
                        <div className="row">

                            {

                                loader ? <ProcessLoader /> :
                                blogs.length > 0 ?
                                    blogs.map((data, key) => {

                                            return (
                                                <BlogCard key={key} request="complete" data={data} deleteBlog={deleteBlog} />
                                            );
                                        })

                                        :
                                        <div className='col-md-12 text-center'>
                                            <h4 className='mt-5'>Result not found</h4>
                                        </div>

                            }

                        </div>

                     
                        {
                            totalPages > 1  ?
                        <Pagination callbackFunction={changePage}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                        }

                      
                    </div>

                </div>
            </div>

        </Layout>
    )
}

export default Blogs;
