import React, { useState, useEffect } from 'react'
import { appointment_status } from '../rawData/AppointmentStatus';
function Filters(props) {
    const { search, setSearch, getEnquiries, reset } = props
    const handleChangeInput = (e) => {
        const newData = { ...search }
        newData[e.target.name] = e.target.value
        setSearch(newData)
    }

  

    return (
        <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        {/* <p className="card-title">Filters</p> */}
                        <div className="row">

                            <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3">
                                    <label className='mb-1'>Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={search.date}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3">
                                    <label className='mb-1'>Enquiry No.</label>
                                    <input
                                        className="form-control"
                                        name="enquiry_no"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={search.enquiry_no}
                                    />
                                </div>
                            </div>


                         


                            <div className="col-12 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3 text-right">
                                <button className="btn btn-sm btn-primary mr-1" onClick={()=> reset()} >Reset</button>

                                    <button className="btn btn-sm btn-primary" onClick={()=> getEnquiries(1)} >Search</button>
                                </div>
                            </div>



                        </div>


                    </div>
                </div>
            </div>
        </div>

    )
}

export default Filters
