import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Layout from '../Layout'
// import { centerData } from '../rawData/CenterData'
import CenterCardCompoment from './CenterCardCompoment';
import axiosBaseUrl from '../axiosBaseUrl'
import ProcessLoader from '../ReuseableComponent/ProcessLoader';
import Pagination from '../ReuseableComponent/Pagination';

function ManageCenter() {

    const [centerData, setCenterData] = useState([])


    const [filter, setFilter] = useState({ search_by: 'all', search: '' });

    const [loader, setLoader] = useState(false)

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getCenters(1)
    }, [])


    function getCenters(page) {
        setLoader(true)
    var url = `admin/center?page=${page}&limit=6&verify_status=approved`;

    if (filter.search != '') {
        url += `&${filter.search_by}=${filter.search.toLowerCase()}`
    }

        axiosBaseUrl.get(url)
            .then((res) => {
                console.log(res.data)
                setCenterData(res.data.data)
                setLoader(false)
                setTotalPages(res.data.page1)

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


    function handle(e) {
        const newData = { ...filter }
        newData[e.target.id] = e.target.value
        setFilter(newData)
       
    }

    const formData = (e) => {
        e.preventDefault()
        getCenters(1)
        
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
                                            <li className="breadcrumb-item active" aria-current="page">Manage Centre</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-12 text-right">
                            <h6 className="card-title">
                                <Link className="btn custom-btn" to="/addCentre">
                                    Add Centre
                                </Link>

                            </h6>
                        </div>
                    </div>
                    <div className="card mt-3">
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
                                                <option value="name">Centre Name</option>
                                                <option value="pincode">Pincode</option>
                                                <option value="email">Email</option>
                                                <option value="contact_no">Contact Number</option>
                                                {/* <option value="status">Status</option> */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-right">
                                        <button type="button" className="btn btn-sm btn-secondary mr-1"  onClick={() => {filter({ search_by: 'all', search: '' })}}>Reset</button>
                                        {/* <div className="form-group text-right"> */}
                                        <button className="btn custom-btn btn-sm" type="submit">
                                            Search
                                        </button>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="center_list" id="filter-data">
                        <div className="row">

                            {

                                loader ? <ProcessLoader /> :
                                    centerData.length > 0 ?
                                        centerData.map((data, key) => {

                                            return (
                                                <CenterCardCompoment key={key} request="complete" data={data} />
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
                        <Pagination callbackFunction={getCenters}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                        }

                      
                    </div>

                </div>
            </div>

        </Layout>
    )
}

export default ManageCenter
