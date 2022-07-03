import React, {useState, useEffect} from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import {employeeValidation} from '../Validation/Validation';
import { useParams } from 'react-router-dom'
import axiosBaseUrl from '../axiosBaseUrl'

function EditEmployeeScreen() {
    const [data, setData] = useState({
        name: "",
        email: "",
        contact_no: "",
        status : "",
        profile_photo_path : ""
    });

    const { id } = useParams();

    const [errors, setErrors] = useState({});

    const [file, setFile] = useState({})
   

    function handle(e) {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
        // console.log(e.target.value)

        console.log(newData)
    }

    function handleFile(e) {

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...data }
            newData['profile_photo_path'] = reader.result
            setData(newData)
            console.log(reader.result);//base64encoded string
        };

    }

    useEffect(() => {
        getEmployee()
    }, [])

    function getEmployee() {
        axiosBaseUrl.get(`admin/employee/details/${id}`)
            .then((res) => {
                console.log(res.data.data)
                const newData = { ...data }
                newData['name'] = res.data.data.name
                newData['email'] = res.data.data.email
                newData['contact_no'] = res.data.data.phone
                newData['status'] = res.data.data.status
                setData(newData)


            }).catch(error => {
                console.log(error)
               
            })

    }

   


    const formData = (e) => {


        e.preventDefault()

        var error_data = employeeValidation(data);
        setErrors(error_data);
        console.log(data.status)
     
        if (Object.keys(error_data).length == 0) {

            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true, showCancelButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {

                    // let formData = new FormData();
                    // if(file['name']) {
                    //     formData.append('profile_photo_path',file)
                    // }
                    // // formData.append('password',data.passowrd)
                    // formData.append('name',data.name)
                    // formData.append('email',data.email)
                    // formData.append('contact_no',data.contact_no)
                    // formData.append('status',data.status)
                    
        
                    axiosBaseUrl.put(`admin/employee/${id}`, data)
                            .then((res) => {
                                console.log(res)
                                    Swal.fire('Employee is successfylly updated!', '', 'success')
        
                            }).catch(error => {
                                console.log(error)
                                if (error.response) {
                                    if (error.response.status == 422) {
                                        const newData = { ...errors }
                                        error.response.data.errors.map((x) => {
                                            newData[x.param] = x.msg
    
                                        })
                                        setErrors(newData)
                                    }
                                    //    Swal.fire(error.response.data.error, '', 'error')
                                    
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
                                            <li className="breadcrumb-item"><Link to="/manageEmployee">Manage Emplyee</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Employee</li>
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
                                                Name <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="name"
                                                onChange={(e) => handle(e)}
                                                value={data.name}
                                                className="form-control"
                                                placeholder="enter name here"
                                            />

                                            <span className="form-errors">{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="email"
                                                onChange={(e) => handle(e)}
                                                value={data.email}
                                                className="form-control"
                                                type="email"
                                                placeholder="enter email here"
                                            />
                                            <span className="form-errors">{errors.email}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Contact No.</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                id="contact_no"
                                                onChange={(e) => handle(e)}
                                                value={data.contact_no}
                                                className="form-control"
                                                placeholder="enter contact no. here"
                                            />
                                            <span className="form-errors">{errors.contact_no}</span>
                                        </div>
                                    </div>
                                  

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Image</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                type="file"
                                                id="contact_no"
                                                onChange={(e) => handleFile(e)}
                                                name="image"
                                            />
                                            <span className="form-errors">{errors.image}</span>
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">Status</label>
                                        </div>
                                        <div className="col-lg-8">
                                            <select
                                                id="status"
                                                onChange={(e) => handle(e)}
                                                name="status"
                                                className="form-control"
                                                value={data.status}
                                            >
                                                <option value="0">Active</option>
                                                <option value="1">Inactive</option>
                                                </select>
                                            <span className="form-errors">{errors.image}</span>
                                        </div>
                                    </div>

                               
                                
                                   
                                 
                                    <div className="form-group row">
                                        <div className="col-lg-8 offset-lg-3 text-right">
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

export default EditEmployeeScreen
