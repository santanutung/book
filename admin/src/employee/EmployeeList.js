import React from 'react'
import { Link } from 'react-router-dom'
import {env} from '../env'

function EmployeeList(props) {
    const { request, data, id } = props
    return (
        <div className="col-lg-6 col-xl-4 mt-3">
        <div className="card card-rounded">
            <div className="card-body card-timeline">

                <div className="row w-100">
                    <div className="col-sm-4">
                        <img src={env.imageurl+data.profile_photo_path} className="w-100" />
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
                                <Link className="dropdown-item" to={`editEmployee/${data._id}`}>
                                    Edit Profile
                                </Link>
                                <Link className="dropdown-item" to={`employeePermission/${data._id}`}>
                                    Permissions
                                </Link>


                            </div>
                        </div>

                    </div>
                    <div className="col-sm-8">
                        <div className="media-body">
                            <p className="mb-2">
                                <h4 className="mb-2 text-black">{data.name}</h4>
                            </p>
                         
                            <p className="mb-2 text-primary"><span><i className="fas fa-phone-alt"></i> {data.phone}</span>
                            </p>
                            <p className="mb-2 text-primary"><span><i className="fas fa-envelope"></i> {data.email}</span>
                            </p>
                            <p>

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default EmployeeList
