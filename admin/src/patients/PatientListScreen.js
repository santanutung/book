import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'
import PatientCard from './PatientCard';
import ProcessLoader from '../ReuseableComponent/ProcessLoader';
import Pagination from '../ReuseableComponent/Pagination';


function PatientListScreen() {

    const [filter, setFilter] = useState({search_by : 'all', search : ''});
    const [loader, setLoader] = useState(false)
    const [patientList, setPatientList] = useState([]);
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        getPatients()
    }, [])


    function getPatients() {
        setLoader(true)
        var url = `admin/patient-list?page=1&limit=12`;
        

        if(filter.search !== '') {
            url += `&${filter.search_by}=${filter.search}`
        }

        // axiosBaseUrl.get(`admin/patient-list?page=1&limit=10000&${filter.search_by}=${filter.search}`)
        axiosBaseUrl.get(url)
            .then((res) => {
                // console.log("MANAGE PATIENT ", res.data)
                // alert(res.data.page1)
                // setIntroduction(res.data.data.description)
                setPatientList(res.data.data)
                setLoader(false)
                setTotalPages(res.data.page1)

            }).catch(error => {
                // console.log(error)
                if (error.response) {
                    alert(error.response.data)

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
        console.log(e.target.value)
    }


    const formData = (e) => {
        e.preventDefault()
        getPatients()

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
                                            <li className="breadcrumb-item active" aria-current="page">Manage Patient</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
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
                                                <option value value="all">Filter By</option>
                                                <option value="name">Name</option>
                                                <option value="email">Email</option>
                                                <option value="phone">Contact Number</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-right">
                                    <button type="button" className="btn btn-sm btn-secondary mr-1"  onClick={() => {filter({ search_by: 'all', search: '' })}}>Reset</button>
                                       
                                        {/* <div className="form-group text-right"> */}
                                        <button className="btn btn-sm custom-btn" type="submit">
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
                            loader ?  <ProcessLoader /> :

                            patientList.length > 0 ?
                            patientList.map((data, key) => {

                                return (
                                    <PatientCard key={key} data={data} />
                                );
                            }) :

                            <div className='col-md-12 text-center'>
                                <h4 className='mt-5'>Result not found</h4>
                            </div>
                        
                        
                        }



                        </div>
                        {
                            totalPages > 1  ?
                        <Pagination callbackFunction={getPatients}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                        }
                    </div>

                </div>
            </div>

        </Layout>
    )
}

export default PatientListScreen
