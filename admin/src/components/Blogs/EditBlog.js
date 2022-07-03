import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import Layout from '../../Layout';
import { addBlogValidation } from '../../Validation/Validation';

function EditBlog() {
  const history = useHistory()
    const {setLoadingState} = useGlobalContexts()
    const [description, setDescription] = useState("");
    const [data, setData] = useState({
        // title: "",
        // short_description: "",
        // description: "",
        // image: "",
        // status: "",
    });

    const [editData, setEditData] = useState({
        //   title: "",
        // short_description: "",
        // description: "",
        // image: "",
        // status: "",
    });

    const [errors, setErrors] = useState({});
    const { blogId } = useParams();

    useEffect(() => {
      getBlog()
    }, []);
    

  function getBlog(){
  

    axiosBaseUrl.get(`admin/blog/${blogId}`)
        .then((res) => {
          // delete res.data.data.image
          // delete res.data.data._id
          console.log("Res",res.data.data)
        //   setData({...res.data.data})
            // var new_data = {...editData}
            // console.log(new_data)
            // new_data
        //   setEditData(res.data.data)
          setEditData({
            title:res.data.data.title,
            short_description:res.data.data.short_description,
            description:res.data.data.description,
            status:res.data.data.status
          })
          setDescription(res.data.data.description)
          console.log(data)
         

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
  console.log("After api".data);        

    function handle(e) {
        const newData = { ...editData }
        // alert(e.target.value)
        // newData[e.target.name] = e.target.value
        // setEditData(newData)
        // console.log(e.target.value, "value", e.target.name)
       

        if (e.target.value === '' || e.target.value.length <= e.target.maxLength) {
            newData[e.target.name] = e.target.value
            setEditData(newData)
            // console.log(e.target.value, "1")
        }
        // newData[e.target.name] = e.target.value
        // setData(newData)
        // console.log(e.target.value)




    }

    function handleIntroduction(intro) {
        const newData = { ...editData }
        // alert("test")
        newData['description'] = intro
        setEditData(newData)
        setDescription(intro)
        // alert("test")
        // console.log(newData, "-----------------");
    }

    function handleFile(e) {

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...editData }
            newData['image'] = reader.result
            setEditData(newData)
            console.log(reader.result);//base64encoded string
        };





    }




    const formData = (e) => {


        e.preventDefault()
        console.log("DATA",editData)
        var error_data = addBlogValidation(editData);
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


                    axiosBaseUrl.put(`admin/edit-blog/${blogId}`, editData)
                        .then((res) => {
                            console.log(res)
                            setLoadingState(false)
                            Swal.fire('Blog is successfully updated!', '', 'success')
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
                                    window.scroll(0,document.getElementById(Object.keys(newData)[0]).offsetTop-50);
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
            window.scroll(0,document.getElementById(Object.keys(error_data)[0]).offsetTop-50);
        }




    }



  return(
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
                                    <li className="breadcrumb-item active" aria-current="page">Edit Blog</li>
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
                                        <br/>
                                        <span className='max-length'>maximum 100 characters allow ({100-(editData.title? editData.title.length :0) })
                                      
                                        </span>
                                    </label>
                                </div>
                                <div className="col-lg-8">
                                    <input
                                        name="title"
                                        id="title"
                                        onChange={(e) => handle(e)}
                                        value={editData.title}
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
                                        <br/>
                                        <span className='max-length'>maximum 200 characters allow 
                                         ({ editData.short_description ? 200-editData.short_description.length : 200})
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
                                        value={editData.short_description}
                                        maxLength="200"
                                    ></textarea>
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
                                        <div class="js--image-preview" style={{ backgroundImage: `url(${editData.image ? editData.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"})` }}>
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
                                        data={description}
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
                                       
                                        className="form-control"
                                        value={editData.status}
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
                                        Edit
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

export default EditBlog;
