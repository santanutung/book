import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'
import PatientCard from '../patients/PatientCard';
import moment from 'moment';


function DashboardDemographies() {

    const [filter, setFilter] = useState({});

    const [patientList, setPatientList] = useState([]);

    const [searchName, setSearchName] = useState('')
    const [searchByAge, setSearchByAge] = useState('')
    const [searchByArea, setSearchByArea] = useState('')


    useEffect(() => {
        getPatients()
    }, [])


    function getPatients() {
        axiosBaseUrl.get(`admin/patient-list?page=1&limit=10&${filter.search_by}=${filter.search}`)
            .then((res) => {
                console.log("MANAGE PATIENT ", res.data.data.data)
                // setIntroduction(res.data.data.description)
                setPatientList(res.data.data.data)


            }).catch(error => {
                console.log(error)
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




    const filteredPatients = patientList?.filter(patient => {

        console.log("HEAH ", moment().diff(patient?.dob, 'years'))

        // console.log(patient?.age)
        
        // let ageParameter = true;
        
        // if(searchByAge != ""){
        //     ageParameter = moment().diff(patient?.dob, 'years') == searchByAge
        // }
        // console.log("Patients ", ageParameter)

        return patient?.name?.toLowerCase().includes(searchName.toLowerCase()) ||  patient?.address?.toLowerCase().includes(searchByArea.toLowerCase()) 
    })






    return (
        // <div className="main-panel">
        <div className="content-wrapper">


            {/* 

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashbard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Manage Patient</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div> */}



            <div className="card mt-3">
                <div className="card-body">
                    <form className="filter-form" onSubmit={formData}>
                        <input type="hidden" name="type" defaultValue="all" />
                        <div className="row">

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Search By Name</label>
                                    <input
                                        className="form-control search input-box"
                                        name="search"
                                        id="search"
                                        onChange={(e) => {
                                            handle(e)
                                            setSearchName(e.target.value)
                                        }}
                                        value={searchName}
                                        placeholder="Patient's Name"
                                    />
                                </div>
                            </div>


                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Search By Age</label>
                                    <input
                                        className="form-control search input-box"
                                        name="search"
                                        id="search"
                                        onChange={(e) => {
                                            handle(e)
                                            setSearchByAge(e.target.value)
                                        }}
                                        value={searchByAge}
                                        placeholder="Patient's Age"
                                    />
                                </div>
                            </div>


                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Search By Area</label>
                                    <input
                                        className="form-control search input-box"
                                        name="search"
                                        id="search"
                                        onChange={(e) => {
                                            handle(e)
                                            setSearchByArea(e.target.value)
                                        }}
                                        value={searchByArea}
                                        placeholder="Area"

                                    />
                                </div>
                            </div>

                            {/* <div className="col-md-2">
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
                                    </div> */}
                            {/* <div className="col-md-12 text-right">

                                        <button className="btn custom-btn" type="submit">
                                            Filter
                                        </button>
                                    </div> */}
                        </div>
                    </form>
                </div>
            </div>

            <div className="center_list" id="filter-data">
                <div className="row">
                    {filteredPatients.map((data, key) => {

                        return (
                            <PatientCard key={key} data={data} />
                        );
                    })}



                </div>
            </div>

        </div>
        // </div>

    )
}

export default DashboardDemographies
