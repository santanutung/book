import React, {useState, useEffect} from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

function WebsiteSettingScreen() {
  

    const [introduction, setIntroduction] = useState("");


    useEffect(() => {
        getData()
    },[])

    
    function getData() {
        axiosBaseUrl.get(`admin/setting/term-condition`)
        .then((res) => {
            // console.log(res.data.data.description)
            setIntroduction(res.data.data.description)
           
            
         
        }).catch(error => {
            console.log(error.res)
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


    const formData = (e) => {


        e.preventDefault()

   
            Swal.fire({
                title: 'Do you want to save the changes?',
               showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                   
            
                    axiosBaseUrl.post(`admin/setting/`, {'type': "term-condition", 'description' : introduction})
                            .then((res) => {
                                console.log(res)
                                Swal.fire('', 'Description is successfylly updated', 'success')                
                            }).catch(error => {
                                console.log(error.response)
                                if (error.response) {
                                    // setErrors({'error' : error.response.data.error});
                                }
                                else if (error.request) {
                                    // The request was made but no response was received
                                    console.log(error.request);
                                } else {
                                    // Something happened in setting up the request that triggered an Error
                                    console.log('Error', error.message);
                                }
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
                                            <li className="breadcrumb-item active" aria-current="page">Term Condition</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>






                    <div className="container-fluid">
                    <div className="card">
                        <div className="card-body">

                            <form
                                className="multipart-submit-form"
                                onSubmit={formData}
                            >

                                
                                <div className="form-group row">
                                    <div className="col-lg-12">
                                        <label className="col-form-label">Description </label>
                                    </div>
                                    <div className="col-lg-12">
                                    <CKEditor
                                                editor={ClassicEditor}
                                                data={introduction}
                                                onReady={editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    console.log('Editor is ready to use!', editor);
                                                }}
                                                onChange={(event, editor) => {
                                                    setIntroduction(editor.getData())
                                                }}
                                              
                                            />
                                    </div>
                                </div>
                              
                                <div className="form-group row">
                                    <div className="col-lg-12 text-right">
                                        <button type="submit" className="btn btn-primary mr-2">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>








                </div>

            </div>










        </Layout>
    )
}

export default WebsiteSettingScreen
