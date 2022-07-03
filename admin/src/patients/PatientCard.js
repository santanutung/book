import React from 'react'
import { Link } from 'react-router-dom'
import { env } from '../env'

function PatientCard(props) {
    const { request, data } = props
    return (
        <div className="col-lg-6 col-xl-4 mt-3">
            <Link to={`patientProfile/${data._id}`}  className='center-card-a'>
            <div className="card card-rounded">
                <div className="card-body card-timeline">

                    <div className="row w-100">
                        <div className="col-sm-4">
                            <img 
                                src={data.profile_photo_path ? env.imageurl + data.profile_photo_path: "assets/images/faces/user-icon.png"}
                            className="w-100" alt="profile" />
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
                                    <Link className="dropdown-item" to={`patientProfile/${data._id}`}>
                                        Profile
                                    </Link>
                                  


                                </div>
                            </div>

                        </div>
                        <div className="col-sm-8">
                            <div className="media-body">
                                <p className="mb-2">
                                    <h4 className="mb-2 text-black capitalize">{data.name}</h4>
                                </p>
                                <p className="mb-2 text-primary">
                                    <i className="fas fa-map-marker-alt"></i> {((data.house_no ? data.house_no : '')+ " "+(data.street ? data.street : '')+" "+(data.area ? data.area : '')+" "+(data.city ? data.city : '')+" "+(data.state ? data.state : '')+" "+(data.pincode ? data.pincode : '')).trim()}
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
            </Link>
        </div>
    )
}

export default PatientCard
