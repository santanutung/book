import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'
import EmployeeList from './EmployeeList'

function ManageEmployeeScreen() {

    const [employeeData, setEmployeeData] = useState([])


    const [filter, setFilter] = useState({});


    useEffect(() => {
        getEmployee()
    }, [])


    function getEmployee() {
        axiosBaseUrl.get(`admin/employee?page=1&limit=10&${filter.search_by}=${filter.search}`)
            .then((res) => {
                console.log(res.data)
                setEmployeeData(res.data.data.data)


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
    function handle(e) {
        const newData = { ...filter }
        newData[e.target.id] = e.target.value
        setFilter(newData)
        console.log(e.target.value)
    }


    const formData = (e) => {
        e.preventDefault()
        getEmployee()

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
                                            <li className="breadcrumb-item active" aria-current="page">Manage Employee</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 text-right">
                            <h6 className="card-title">
                                <Link className="btn custom-btn" to="/addEmployee">
                                    Add Employee
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
                                                <option value>Filter By</option>
                                                <option value="name">Employee Name</option>
                                                <option value="email">Email</option>
                                                <option value="contact_no">Contact Number</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-right">

                                        {/* <div className="form-group text-right"> */}
                                        <button className="btn custom-btn" type="submit">
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


                            {employeeData.map((data, key) => {

                                return (
                                    <EmployeeList key={key} data={data} />
                                );
                            })}

                        </div>
                    </div>

                </div>
            </div>

        </Layout>
    )
}

export default ManageEmployeeScreen
