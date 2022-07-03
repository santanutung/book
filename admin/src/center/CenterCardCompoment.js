import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { env } from '../env'


function CenterCardCompoment(props) {
    const { request, data, id } = props

    // console.log(env)

    return (
        <div className=" col-lg-6 col-md-6  col-xl-6  mt-3" key={id}>
            <Link to={`/centreProfile/${data._id}`} className='center-card-a'>
            <div className="card h-full  b-success ">
                <div className="card-body card-timeline row">
                    <div className="col-xl-4  col-md-6">
                        <img
                            alt="image"
                            width="100%"
                            src={`${env.imageurl + data.primaryImage}`}
                        />
                    </div>
                    <div className="col-xl-8 col-md-6">
                        {/* <p className="mb-2"> */}
                            <h4 className="mb-2 text-black center-name">{data.name}</h4>
                        {/* </p> */}
                        <p className="mb-2 text-primary">
                            <i className="fas fa-map-marker-alt" />  {data.address + " " + data.city + " " + data.state + " " + data.pincode}
                        </p>
                        <p className="mb-2 text-primary">
                            <span>
                                <i className="fas fa-phone-alt" /> {data.contact_no}
                            </span>{" "}
                        
                        </p>
                        <p className="mb-2 text-primary">
                         
                            <span>
                                <i className="fas fa-envelope" /> {data.email}
                            </span>{" "}
                        </p>

                        <div className="star-review">


                            {/* <span className={`badge ${request == 'pending' ? (data.verify_status == 1 ? 'badge-warning' : 'badge-danger') : (data.status == 1 ? 'badge-success' : 'badge-danger')}``>{request == 'pending' ? (data.verify_status == 1 ? 'pending' : 'Decline') : (data.status == 1 ? 'Active' : 'Inactive')}</span> */}

                            <span className={`
                                ${request == "pending" ? (data.verify_status == 'pending' ? 'badge-warning' : 'badge-danger') : (data.status == 'active' ? 'badge-success' : 'badge-danger')}
                            `}>
                                {request == "pending" ? (data.verify_status == 'pending' ? 'Pending' : 'Decline') : (data.status == 'active' ? 'Active' : 'Inactive')}
                            </span>

                        </div>
                    </div>
                    <div className="social-media">
                        <div className="dropdown profile-menu">
                            <a
                                className=""
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="fas fa-ellipsis-v"></i>
                            </a>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuIconButton1"
                                style={{}}
                            >
                                <Link to={`/centreProfile/${data._id}`}>

                                    <div className="dropdown-item">
                                        View Profile
                                    </div>
                                </Link>
                                <Link to={"/editCentre/" + data._id} className="dropdown-item">
                                    Edit
                                </Link>
                                <Link to={"/centre/" + data._id+"/slots"} className="dropdown-item">
                                    Slots
                                </Link>

                            </div>
                        </div>




                        {/* <Link to={"/centerProfile/"+data._id}>
                            <div 
                            className="btn btn-outline-primary btn-rounded btn-sm"
                            >
                                <i className="fa fa-eye" data-feather="view" />
                            </div>

                        </Link>

                        <Link to={"/editCenter/"+data._id}>
                            <div 
                            className="btn btn-outline-primary btn-rounded btn-sm"
                            >
                            <i className="fa fa-edit" data-feather="edit" />
                            </div>

                        </Link> */}

                    </div>
                </div>
            </div>
            </Link>
        </div>
    )
}

export default CenterCardCompoment
