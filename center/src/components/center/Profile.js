import React, { useState, useEffect } from "react";
import Layout from "../../Layout";
import axiosBaseUrl from '../../axiosBaseUrl';
import { env } from "../../env";
import DocumentList from "./DocumentList";
import CenterTimeList from "./CenterTimeList";
import EditProfileModal from "./EditProfileModal";
import UploadGallery from "./Gallery/UploadGallery";
import Swal from "sweetalert2";
import ImagePreview from './ImagePreview'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 10
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 8
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
const Profile = () => {


    const [showEditModal, setShowEditModal] = useState(false);



    const [data, setData] = useState({});


    const [images, setImages] = useState([])
    const [preview, setPreview] = useState({})
    const [convertedFiles, setConvertedfiles] = useState([])

    const [galleryModal, setGalleryModal] = useState(false)

    useEffect(() => {
        getCenter()
        // gallery()
    }, [])

    function getCenter() {
        axiosBaseUrl.get(`private/center/profile`)
            .then((res) => {

                // console.log(res.data)
                setData(res.data.data)
                setImages(res.data.data.images)
                console.log(res.data.data.images)

            }).catch(error => {
                console.log(error)

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
        axiosBaseUrl.post('private/upload-gallery', { 'images': convertedFiles })
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
        axiosBaseUrl.get('private/gallery')
            .then((res) => {
                // console.log(res.data.data.images)
                setImages(res.data.data.images)

            }).catch(error => {
                // console.log(error)
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

    
    function deleteImage(id) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
    
                axiosBaseUrl.delete(`private/upload-gallery/${id}`)
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

      function makePrimary(id) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
    
                axiosBaseUrl.post(`private/make-primary-gallery?key=${id}`)
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
        <>
            <Layout>
                <div className="main-panel">
                    <div className="container-fluid">
                        <div
                            className="border-radius-xl mt-4 profile-background"
                            style={{
                                backgroundImage:
                                    'url("https://demos.creative-tim.com/soft-ui-dashboard/assets/img/curved-images/curved0.jpg")',
                                backgroundPositionY: "50%",
                            }}
                        >
                            <div />
                        </div>
                        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                            <div className="row gx-4 d-flex">
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
                                <div className="col-md-10">
                                    <div className="h-100">
                                        <h5 className="mb-1 capitalize">{data.name}</h5>
                                        <p className="mb-0 font-weight-bold text-sm">Email : {data.email}</p>
                                       
                                    </div>
                                </div>
                                <div className="col-md-2 text-right">
                                    <div className='p-relative'>
                                        <button className='btn btn-secondary pointer' >Upload Images</button>
                                        <input type="file" className="upload-image pointer" multiple="true" accept="image/*" onChange={(e) => browseImage(e)} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="container-fluid py-4">
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
                                    </div>
                                    <div className="card-body center-profile-card-body p-3">

                                        {/* <hr className="horizontal gray-light my-4" /> */}
                                        <ul className="list-group">
                                            <li className="list-group-item border-0 ps-0 pt-0 text-sm capitalize">
                                                <strong className="text-dark ">Centre Name:</strong> &nbsp; {data.name}
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
                                            {/* <li className="list-group-item border-0 ps-0 text-sm">
                                                <strong className="text-dark">Number of beds:</strong> &nbsp; {data.total_beds}
                                            </li> */}
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

                            <DocumentList />


                            <CenterTimeList />

                            {
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
                            }

                        </div>
                    </div>
                </div>

                {
                    showEditModal === true ? <EditProfileModal profile={data} showEditModal={showEditModal} setShowEditModal={setShowEditModal} getCenter={getCenter} /> : null
                }


                {
                    galleryModal?
                        <UploadGallery convertedFiles={convertedFiles} setConvertedfiles={setConvertedfiles} submit={submit} setGalleryModal={setGalleryModal} browseImage={browseImage} />
                        :
                        ''
                }

                {
                    preview._id ? <ImagePreview preview={preview} setPreview={setPreview} deleteImage={deleteImage} makePrimary={makePrimary}/> : ''
                }

            </Layout>
        </>
    );
};

export default Profile;