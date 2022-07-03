import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'

import Swal from "sweetalert2";
import { env } from '../env'
import CenterTimeList from './CenterTimeList'
import DocumentList from './DocumentList'
import Gallery from './Gallery'
import useGlobalContexts from '../context/GlobalContext'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import UploadGallery from './Gallery/UploadGallery'
import ImagePreview from './Gallery/ImagePreview'
import EditModal from './EditModal'

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 10
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

function CenterProfile() {



    const { setLoadingState } = useGlobalContexts();


    const [images, setImages] = useState([])
    const [preview, setPreview] = useState({})
    const [convertedFiles, setConvertedfiles] = useState([])

    const [galleryModal, setGalleryModal] = useState(false)

    const [data, setData] = useState({
        name: "",
        center_manager: "",
        email: "",
        contact_no: "",
        total_beds: "",
        introduction: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
        status: "",
        charges: "",
        primaryImage: "",
        verify_status: "",
        status: ""
    });
    const [documents, setDocuments] = useState([])
    const [statsData, setStatsData] = useState([])
    const { id } = useParams();


    const [showEditModal, setShowEditModal] = useState(false);






    const HandleClick = (passedValue) => {
        // console.log(statusKey)
        // var status = {statusKey : passedValue}
        console.log(passedValue)
        Swal.fire({
            title: 'Do you want to save the changes?',
            // showDenyButton: true, 
            showCancelButton: true,
            confirmButtonText: `Update`,
            // denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.put(`admin/center-verify/${id}`, passedValue)
                    .then((res) => {

                        Swal.fire('', 'Status is successfully updated', 'success')
                        getCenter()

                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }


    useEffect(() => {
        getCenter()
        getStatsData()
        setLoadingState(true)
    }, [])

    function getCenter() {
        axiosBaseUrl.get(`admin/center/${id}`)
            .then((res) => {

                setData(res.data.data)
                setDocuments(res.data.documents)
                setImages(res.data.data.images)
                setLoadingState(false)

            }).catch(error => {
                console.log(error)

            })

    }

    function getStatsData() {
        axiosBaseUrl.get(`admin/center/stats/${id}`)
            .then((res) => {
                console.log(res.data)
                setStatsData(res.data.data)

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



    function getBase64(file) {

        setConvertedfiles([])
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log("Success", reader.result.substring(0, 50));
            setConvertedfiles((prevFiles) => [...prevFiles, { image: reader.result, is_primary: 0 }])

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    const browseImage = (e) => {

        console.log(e.target.files.length)
        //  var file = document.querySelector('#files > input[type="file"]').files[0];
        //  getBase64(e.target.files[1]);
        for (var i = 0; i < e.target.files.length; i++) {
            console.log("FILE ", i, " ", e.target.files[i])
            getBase64(e.target.files[i]);
        }
        console.log(convertedFiles)

        setGalleryModal(true)
        e.target.value = null
    }



    function submit(e) {
        axiosBaseUrl.post(`admin/upload-gallery/${id}`, { 'images': convertedFiles })
            .then((res) => {
                console.log(res)
                Swal.fire('Upload!', 'Image is successfully uploaded', 'success')

                setConvertedfiles([])
                gallery()
                setGalleryModal(false)

            }).catch(error => {
                console.log(error.response)
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



    function gallery() {
        axiosBaseUrl.get(`admin/gallery/${id}`)
            .then((res) => {
                console.log(res.data.data.images)
                setImages(res.data.data.images)

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


    function deleteImage(imageId) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`admin/upload-gallery/${id}/${imageId}`)
                    .then((res) => {

                        Swal.fire('Delete!', 'Image is successfully deleted', 'success')
                        gallery()
                        setPreview({})


                    }).catch(error => {
                        console.log(error)

                    })




            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function makePrimary(imageId) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                axiosBaseUrl.post(`admin/make-primary-gallery/${id}/?key=${imageId}`)
                    .then((res) => {

                        Swal.fire('Update!', 'Image is successfully update', 'success')
                        gallery()
                        setPreview({})


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
                                            <li className="breadcrumb-item"><Link to="/manageCentre">Manage Centre</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Centre Profile</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="container-fluid">
                        <div
                            className="page-header min-height-230 border-radius-xl mt-4"
                            style={{
                                backgroundImage: 'url("../assets/img/curved-images/curved0.jpg")',
                                backgroundPositionY: "50%"
                            }}
                        >
                            <span className="mask bg-gradient-primary opacity-6" />
                        </div>
                        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden center-profile">
                            <div className="row gx-4">
                                <div className="col-md-12">

                                    <Carousel responsive={responsive}>
                                        {

                                            images.map((image, index) => {
                                                return (
                                                    <div className="item">
                                                        <img
                                                            onClick={() => setPreview(image)}
                                                            src={`${env.imageurl + image.image}`}
                                                            alt="profile_image"
                                                            className={image.is_primary == 1 ? `b-solid border-radius-lg shadow-sm mr-2 pointer m-1` : 'border-radius-lg shadow-sm mr-2 pointer m-1'}
                                                            width="100"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Carousel>


                                </div>
                                <div className="col-lg-4">
                                    <div className="h-100">
                                        <h5 className="mb-1 capitalize"><strong>{data.name}</strong></h5>
                                        <p className="mb-0 font-weight-bold text-sm">Email : {data.email}</p>

                                    </div>
                                </div>



                                {/* 
                                <div className="col-auto">
                                    <div className="avatar avatar-xl position-relative">
                                        <img
                                            src={`${env.imageurl + data.primaryImage}`}
                                            width="100"
                                            alt="profile_image"
                                            className="border-radius-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="col-auto my-auto">
                                    <div className="h-100">
                                        <h5 className="mb-1 center-name">{data.name}</h5>
                                        <p className="mb-0 font-weight-bold text-sm">{data.email}</p>
                                    </div>
                                </div> */}

                                <div className="col-lg-8  my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                                    <div>
                                    <div className="text-right">
                                        {data.verify_status == 'pending' ?
                                            <>
                                                <button
                                                    className=" btn btn-sm btn-success  mr-1"
                                                    onClick={() => HandleClick({ 'verify_status': 'approved' })}
                                                >
                                                    <i className="fa fa-check"> </i>
                                                    <span className="ms-1">Accept</span>
                                                </button>
                                                <button
                                                    className=" btn btn-sm btn-danger mr-1 "
                                                    onClick={() => HandleClick({ 'verify_status': 'rejected' })}

                                                >
                                                    <i className="fa fa-times"> </i>
                                                    <span className="ms-1">Reject</span>
                                                </button>
                                                
                                            </>

                                            :
                                            data.verify_status == 'approved' ?
                                                data.status == 'active' ?
                                                    <>
                                                        <button
                                                            className=" btn btn-sm btn-danger mr-1 "
                                                            onClick={() => HandleClick({ 'status': 'inactive' })}

                                                        >
                                                            <i className="fa fa-times"> </i>
                                                            <span className="ms-1">Deactivate</span>
                                                        </button>
                                                    </>
                                                    :
                                                    <button
                                                        className=" btn btn-sm btn-success mr-1 "
                                                        onClick={() => HandleClick({ 'status': 'active' })}

                                                    >
                                                        <i className="fa fa-times"> </i>
                                                        <span className="ms-1">Activate</span>
                                                    </button>

                                                :
                                                ""
                            }
                                                <>
                                                    <Link
                                                        className=" btn btn-sm btn-primary mr-1 "
                                                        to={"/centre/" + id + "/slots"}

                                                    >
                                                        <i className="fa fa-calendar"> </i>
                                                        <span className="ms-1">Slots</span>
                                                    </Link>
                                                    <span className='p-relative mr-1'>
                                                        <button className='btn btn-secondary btn-sm pointer' >Upload Images</button>
                                                        <input type="file" className="upload-image pointer" multiple="true" accept="image/*" onChange={(e) => browseImage(e)} />
                                                    </span>
                                                    <Link
                                                        className=" btn btn-sm btn-primary "
                                                        to={"/editCentre/" + id}

                                                    >
                                                        <i className="fa fa-edit"> </i>
                                                        <span className="ms-1">Edit</span>
                                                    </Link>
                                                </>

                                                </div>
                                        
                                       
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>






                    <div className="container-fluid mt-n-80 ">
                        <div className="row dashabord-card-list">


                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-gray">
                                    <div className="card-body">
                                        <p className="statistics-title">Online Appointments</p>
                                        <h3 className="rate-percentage">{statsData['onlineAppointments']}</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-purple">
                                    <div className="card-body">
                                        <p className="statistics-title">Offline Appointments</p>
                                        <h3 className="rate-percentage">{statsData['offlineAppointments']}</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-primary ">
                                    <div className="card-body">
                                        <p className="statistics-title">Today Appointments</p>
                                        <h3 className="rate-percentage">{statsData['todayAppointments']}</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-yellow ">
                                    <div className="card-body">
                                        <p className="statistics-title">Cancel Appointments</p>
                                        <h3 className="rate-percentage">{statsData['cancelAppointments']}</h3>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 mb-3">
                                <div className="card bl-danger ">
                                    <div className="card-body">
                                        <p className="statistics-title">Total Earning</p>
                                        <h3 className="rate-percentage">{statsData['offlineEarning'] + statsData['onlineEarning']}</h3>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-12 col-xl-4 mt-4">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">

                                    <div className="row">
                                            <div className="col-8 d-flex align-items-center">
                                                <h6 className="mb-0">Centre Information</h6>
                                            </div>
                                            <div className="col-4 text-right">
                                                <button className="btn custom-btn btn-sm" onClick={e => { setShowEditModal(true) }}>

                                                    Edit
                                                </button>
                                            </div>
                                        </div>


                                        {/* <div className="row">
                                            <div className="col-md-8 d-flex align-items-center">
                                                <h6 className="mb-0"><strong>Centre Information</strong></h6>
                                            </div>
                                            <div className="col-md-4 text-end">
                                               
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">

                                        {/* <hr className="horizontal gray-light my-4" /> */}
                                        <ul className="list-group">
                                            <li className="list-group-item border-0 ps-0 pt-0 text-sm capitalize">
                                                <strong className="text-dark">Centre Name:</strong> &nbsp; {data.name}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Email Address:</strong> &nbsp; {data.email}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Contact:</strong> &nbsp; {data.contact_no}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Address:</strong> &nbsp; {data.address + " " + data.city + " " + data.state + " " + data.pincode}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Number of beds:</strong> &nbsp; {data.total_beds}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Number of Technician:</strong> &nbsp; {data.number_of_technician}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm capitalize">
                                                <strong className="text-dark">Centre managed by:</strong> &nbsp; {data.center_manager}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Charge per dialysis:</strong> &nbsp; {data.charges}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Commission:</strong> &nbsp; {data.commission? data.commission +'%' : ''}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Doctor Availability:</strong> &nbsp; {data.doctor_availability}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of sitting area for family members:</strong> &nbsp; {data.sitting_area}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of Pharmacy nearby:</strong> &nbsp; {data.availability_pharmancy}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Whether the centre has an insurance billing facility or not.:</strong> &nbsp; {data.insurance_billing_facility}
                                            </li>

                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Availability of life-saving drugs:</strong> &nbsp; {data.life_saving_drug}
                                            </li>
                                            <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark"> Number of dialysis performed in a month:</strong> &nbsp; {data.dialysis_per_month}
                                            </li>



                                        </ul>
                                    </div>
                                </div>
                            </div>



                            <CenterTimeList id={id} />
                            <DocumentList documents={documents} />





                        </div>


                        <div className="row mt-4">

                            <div className="col-12 col-xl-12">
                                <div className="card h-100">
                                    <div className="card-header pb-0 p-3">
                                        <h6 className="mb-0">Description</h6>
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">
                                        <div dangerouslySetInnerHTML={{ __html: data.introduction }} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* <Gallery /> */}



                    </div>





                </div>

            </div>


            {
                    showEditModal === true ? <EditModal profile={data} showEditModal={showEditModal} setShowEditModal={setShowEditModal} getCenter={getCenter} centerId={id}/> : null
                }

            {
                galleryModal ?
                    <UploadGallery convertedFiles={convertedFiles} setConvertedfiles={setConvertedfiles} submit={submit} setGalleryModal={setGalleryModal} browseImage={browseImage} />
                    :
                    ''
            }

            {
                preview._id ? <ImagePreview preview={preview} setPreview={setPreview} deleteImage={deleteImage} makePrimary={makePrimary} /> : ''
            }



        </Layout>

    )
}

export default CenterProfile
