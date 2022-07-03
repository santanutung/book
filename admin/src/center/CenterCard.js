import React from 'react'
import { Link } from 'react-router-dom'
import { env } from '../env'

function CenterCard(props) {
    const { request, data, id, classNameList } = props
    return (
        <div className={"card  b-success "+classNameList} key={id}>
                <div className="card-body card-timeline row">
                    <div className="col-md-5">
                        <img
                            alt="image"
                            width={150}
                            src={`${env.imageurl + data.primaryImage}`}/>
                    </div>
                    <div className="col-md-7">
                        <p className="mb-2">
                            <h4 className="mb-2 text-black">{data.name}</h4>
                        </p>
                        <p className="mb-2 text-primary">
                            <i className="fas fa-map-marker-alt" /> {data.address+" "+data.city+" "+data.state+" "+data.pincode}
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
                                <Link to={"/centerProfile/" + data._id} className="dropdown-item">
                                    View Profile
                                </Link>
                                <Link to={"/editCenter/" + data._id} className="dropdown-item">
                                    Edit
                                </Link>


                            </div>
                        </div>





                    </div>
                </div>
            </div>
    )
}

export default CenterCard
