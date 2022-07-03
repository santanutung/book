import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import Layout from '../../Layout';
import { addBlogValidation } from '../../Validation/Validation';

function AddBlog() {
    const history = useHistory()
    const { setLoadingState } = useGlobalContexts()
    const [data, setData] = useState({
        title: "",
        short_description: "",
        description: "",
        image: "",
        status: "enabled",
    });

    const [errors, setErrors] = useState({});

    function handle(e) {
        const newData = { ...data }
        // alert(e.target.maxLength)


        if (e.target.value === '' || e.target.value.length <= e.target.maxLength) {
            newData[e.target.name] = e.target.value
            setData(newData)
            console.log(e.target.value)
        }







    }

    function handleIntroduction(intro) {
        const newData = { ...data }
        newData['description'] = intro
        setData(newData)
    }

    function handleFile(e) {

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...data }
            newData['image'] = reader.result
            setData(newData)
            console.log(reader.result);//base64encoded string
        };





    }




    const formData = (e) => {


        e.preventDefault()

        var error_data = addBlogValidation(data);
        setErrors(error_data);


        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: `Save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    setLoadingState(true)


                    axiosBaseUrl.post('admin/add-blog', data)
                        .then((res) => {
                            console.log(res)
                            setLoadingState(false)
                            Swal.fire('Blog is successfully added!', '', 'success')
                            history.replace('/blogs')

                        }).catch(error => {
                            setLoadingState(false)
                            // console.log(error.response.data.errors)
                            if (error.response) {
                                if (error.response.status == 422) {
                                    const newData = { ...errors }
                                    error.response.data.errors.map((x) => {
                                        newData[x.param] = x.msg

                                    })
                                    setErrors(newData)
                                    window.scroll(0, document.getElementById(Object.keys(newData)[0]).offsetTop - 50);
                                }

                            }
                            else if (error.request) {
                                // The request was made but no response was received
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                        })


                    // Swal.fire('Saved!', '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }
        else {

            setLoadingState(false)
            window.scroll(0, document.getElementById(Object.keys(error_data)[0]).offsetTop - 50);
        }




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
                                            <li className="breadcrumb-item"><Link to="/Blogs">Manage Blogs</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Add Blog</li>
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
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Title <span className="text-danger">*</span>
                                                <br />
                                                <span className='max-length'>maximum 100 characters allow 
                                                {/* ({100 - data.title.length}) */}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="title"
                                                id="title"
                                                onChange={(e) => handle(e)}
                                                value={data.title}
                                                className="form-control"
                                                placeholder="enter title here"
                                                maxLength="100"
                                            />

                                            <span className="form-errors">{errors.title}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Short Description <span className="text-danger">*</span>
                                                <br />
                                                <span className='max-length'>maximum 200 characters allow 
                                                {/* ({200 - data.short_description.length}) */}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <textarea
                                                id='short_description'
                                                onChange={(e) => handle(e)}
                                                className="form-control"
                                                name="short_description"
                                                placeholder="enter short description here"
                                                maxLength="200"
                                            >{data.short_description}</textarea>
                                            <span className="form-errors">{errors.short_description}</span>

                                        </div>
                                    </div>




                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Image</label>
                                        </div>
                                        <div className="col-lg-4">
                                            {/* <DropzoneComponent /> */}
                                            <div class="box">
                                                <div class="js--image-preview" style={{ backgroundImage: `url(${data.image ? data.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"})` }}>
                                                    {/* <img src={data.image? data.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"} /> */}
                                                </div>
                                                <div class="upload-options">
                                                    <label>
                                                        <input type="file" class="image-upload" name="image" accept="image/*" onChange={(e) => handleFile(e)} />
                                                    </label>
                                                </div>
                                            </div>
                                            {/* <input
                                        type="file"
                                        id="contact_no"
                                        onChange={(e) => handleFile(e)}
                                        name="image"
                                    /> */}
                                            <span className="form-errors" id="image">{errors.image}</span>
                                        </div>
                                        {
                                            data.image ? <img src={data.imgae} /> : ""
                                        }
                                    </div>



                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Description </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={data.description}
                                                onChange={(event, editor) => {
                                                    handleIntroduction(editor.getData())
                                                }}

                                            />


                                            <span className="form-errors" id="description">{errors.descritpion}</span>
                                        </div>
                                    </div>
                                    <hr />


                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Status <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <select
                                                name="status"
                                                onChange={(e) => handle(e)}
                                                value={data.status}
                                                className="form-control"
                                            >
                                                <option value="enabled" >Enabled</option>
                                                <option value="disabled">Disabled</option>

                                            </select>
                                            <span className="form-errors">{errors.status}</span>
                                        </div>

                                    </div>




                                    <span className="form-errors">{errors.error}</span>
                                    <div className="form-group row">
                                        <div className="col-lg-8 offset-lg-3 text-right">
                                            <button type="submit" className="btn btn-primary mr-2">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div >


        </Layout >
    );
}

export default AddBlog;
