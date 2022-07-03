import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';
import Layout from '../../../Layout'
import ImageList from './ImageList';

function Gallery() {

   
    const [images, setImages] = useState([])
    const [convertedFiles, setConvertedfiles] = useState([])

    useEffect(() => {
      gallery()
    }, []);
    

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log("Success", reader.result.substring(0, 50));
            setConvertedfiles((prevFiles) => [...prevFiles, { image: reader.result, is_primary :0 }])

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
    }



    function submit(e) {
        axiosBaseUrl.post('private/upload-gallery', { 'images': convertedFiles })
            .then((res) => {
                console.log(res)
                Swal.fire('Upload!', 'Image is successfully uploaded', 'success')

                setConvertedfiles([])
                gallery()

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
                                            <li className="breadcrumb-item"
                                            ><a href="/dashboard">Dashbard</a></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Gallery</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-right'>
                        <div className='p-relative'>
                            <button className='btn btn-secondary pointer'>Upload Images</button>
                            <input type="file" className="upload-image" multiple="true" accept="image/*" onChange={(e) => browseImage(e)} />
                        </div>
                        {/* <button className='btn btn-secondary' onClick={(e) => submit(e)}>Upload</button> */}
                    </div>

                    <div className='table-responsive'>
                        <table className='table'>
                            <thead></thead>
                        </table>

                    </div>

                    <ImageList images={images} setImages={setImages} gallery={gallery} />

                </div>
            </div>


            {
                convertedFiles.length > 0 ?

                    <div
                        className="modal fade show"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    // style={{ display: 'none' }}
                    >
                        <div className="modal-dialog login-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <a
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setConvertedfiles([])}
                                    >
                                        <i className='fa fa-times-circle'></i>
                                        </a>
                                </div>
                                <div className="modal-body">
                                    <form id="Login">
                                        <div className="row">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                                Upload Image
                                            </h5>

                                        </div>
                                        <div className='row'>
                                            {
                                                convertedFiles.map((image, index) => {
                                                    console.log(image);
                                                    return (
                                                        <div className="col-md-4">
                                                            <img src={image.image} style={{width:"100%"}} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>



                                    </form>
                                </div>
                                <div className="modal-footer text-center">

                                    <button onClick={(e) => submit(e)} type="button" className="btn btn-primary">
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
            }
        </Layout>
    )
}

export default Gallery
