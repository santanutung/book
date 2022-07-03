import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';
import Layout from '../Layout'

function ContactSetting() {
  
    const [data, setData] = useState({
        name: "",
        email: "",
        contact_no: "",
        password : ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getData()
    }, [])

    function getData() {
        axiosBaseUrl.get(`admin/setting/contact`)
        .then((res) => {
            console.log(res.data.data.description)
            setData(JSON.parse(res.data.data.description))
           
            
         
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
        const newData = { ...data }
        newData[e.target.name] = e.target.value
        setData(newData)
        console.log(e.target.value)
    }

    const formHandler = (e) => {
        e.preventDefault()



        console.log(data)
        axiosBaseUrl.post('admin/setting', {type:'contact', description:JSON.stringify(data)})
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    Swal.fire('', 'Contact details successfully updated', 'success')

                }


            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 422) {

                        console.log(error.response);
                        const errorData = { ...errors }
                        error.response.data.error.map((value, index) => {
                           
                            errorData[value.param] = value.msg

                        })
                        setErrors(errorData)
                    }

                }
                else if (error.request) {
                    console.log(error.request);
                } else {
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
                                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Manage Contact</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">


                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Address <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="address"
                                                onChange={(e) => handle(e)}
                                                value={data.address}
                                                className="form-control"
                                                placeholder="enter address here"
                                            />

                                            <span className="form-errors">{errors.address}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Phone No. <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="phone"
                                                onChange={(e) => handle(e)}
                                                value={data.phone}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter phone here"
                                            />
                                            <span className="form-errors">{errors.phone}</span>

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
                                                name="email"
                                                onChange={(e) => handle(e)}
                                                value={data.email}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter email here"
                                            />
                                            <span className="form-errors">{errors.email}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Description <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="description"
                                                onChange={(e) => handle(e)}
                                                value={data.description}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter description here"
                                            />
                                            <span className="form-errors">{errors.description}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Facebook <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="facebook"
                                                onChange={(e) => handle(e)}
                                                value={data.facebook}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter facebook here"
                                            />
                                            <span className="form-errors">{errors.facebook}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Twitter <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="twitter"
                                                onChange={(e) => handle(e)}
                                                value={data.twitter}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter twitter here"
                                            />
                                            <span className="form-errors">{errors.twitter}</span>

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Instagram <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="instagram"
                                                onChange={(e) => handle(e)}
                                                value={data.instagram}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter instagram here"
                                            />
                                            <span className="form-errors">{errors.instagram}</span>

                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-lg-3">
                                            <label className="col-form-label">
                                                Linkedin <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                        <div className="col-lg-8">
                                            <input
                                                name="linkedin"
                                                onChange={(e) => handle(e)}
                                                value={data.linkedin}
                                                className="form-control"
                                                type="text"
                                                placeholder="enter linkedin here"
                                            />
                                            <span className="form-errors">{errors.linkedin}</span>

                                        </div>
                                    </div>
                                    
                                   
                                   





                                    <div className="form-group row">
                                        <div className="col-lg-8 offset-lg-3 text-right">
                                            <button type="button" onClick={formHandler} className="btn btn-primary mr-2">
                                                Update
                                            </button>
                                        </div>
                                    </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default ContactSetting
