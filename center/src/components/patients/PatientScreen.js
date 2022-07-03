import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import Pagination from '../../custom/Pagination'
import ProcessLoader from '../../custom/ProcessLoader'
import { env } from '../../env'
import Layout from '../../Layout'
import Footer from '../partials/Footer'

function PatientScreen() {

    const [patients, setPatients] = useState([])
    const [filterList, setFilterList] = useState([])
    const [loading, setLoading] = useState(false)

    const limit = 12;

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getPatients(1)
    }, [])

    function getPatients(page) {
        setLoading(true)
        axiosBaseUrl.get(`private/center/patients?limit=10&page=${page}`)
            .then((res) => {
                // console.log(res.data)
                setPatients(res.data.data)
                setFilterList(res.data.data)
                setLoading(false)
                setTotalPages(Math.ceil(res.data.data.length / limit))

            }).catch(error => {
                console.log(error)
                if (error.response) {
                    Swal.fire(error.response.data.error, '', 'error')


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

    function searchUser(e) {
        // setLoading(true)
        var search = e.target.value
        // console.log(search)
        const filterData = patients?.filter((x) => {
            if (search === "") return x;
            else if (
                (x.family[0]?.name && x.family[0]?.name
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
                x.family_user[0]?.phone
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
                return x;
        });
        setTotalPages(Math.ceil(filterData.length / limit))
        setFilterList(filterData)
        // console.log(filterList);
        //   setLoading(false)

    }

    return (
        <Layout>


            <div className="main-panel">
                <div className="content-wrapper">


                    <div className="row">
                        <div className="col-md-12 ">
                            <div className="row">
                                <div className="col-xl-12">


                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"
                                            ><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Patients List</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="row">
                        <div className="col-md-12 mb-3 search-tab">
                            <input type="text" placeholder="Search Patient" className="form-control search-input" onChange={(e) => searchUser(e)} />

                        </div>
                    </div>




                    <div className="row">

                        {
                            loading ?
                                <div className='col-md-12 mt-2 text-center'>
                                    <ProcessLoader />
                                </div>
                                :
                                filterList.length == 0 ?
                                <div className='col-md-12 text-center mt-5'>
                                    <h4>Patients not available</h4>
                                </div>
                                :
                                filterList.slice((currentPage - 1) * limit, currentPage * limit).map((x, index) => {

                                    return (
                                        <div className="col-md-4 mb-3 "
                                            key={index + "patient"} id={x.family[0]?._id}
                                        >
                                            <div className="card tale-bg">
                                            <Link to={`/patientProfile/${x.family[0]?._id}`} className='pointer'>
                                                <div className="card-body card-people mt-auto d-md-flex">
                                                    <center className="mb-3"><img
                                                        src={x.family[0]?.profile_photo_path ? env.imageurl + x.family[0]?.profile_photo_path : "centerassets/images/faces/user-icon.png"}

                                                        alt="profile" width="20" className="user-list-img" /></center>
                                                    <div className="ml-3 w-full">

                                                        <table className="tab-l mb-2" width="100%">
                                                            <tbody>
                                                                <tr key="name">
                                                                    <td className="table-title word-break">Name : </td>
                                                                    <td className='capitalize'>{x.family[0]?.name}</td>

                                                                </tr>

                                                                <tr key={index + "contact"}>
                                                                    <td className="table-title word-break">Contact : </td>
                                                                    <td>{x.family_user ? x.family_user[0]?.phone : ''}</td>
                                                                </tr>

                                                                <tr key={index + "blood_group"}>
                                                                    <td className="table-title word-break">Blood Group : </td>
                                                                    <td>{x.family[0].blood_group ? x.family[0].blood_group.toUpperCase() : ''}</td>
                                                                </tr>

                                                            </tbody>

                                                        </table>
                                                        <div className="text-center mt-3">
                                                            <Link className="btn btn-sm btn-info ml-2" to={`/patientProfile/${x.family[0]?._id}`}>Profile</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            </div>
                                        </div>


                                    )
                                })
                        }








                    </div>

                    {
                        totalPages > 1 ?
                            <Pagination callbackFunction={getPatients} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                            : ''
                    }

                </div>
                {/* content-wrapper ends */}
                {/* partial:partials/_footer.html */}
                <Footer />
                {/* partial */}
            </div>
            {/* main-panel ends */}


        </Layout>
    )
}

export default PatientScreen
