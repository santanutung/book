import React, { useState, useEffect } from 'react'
import axiosBaseUrl from '../axiosBaseUrl';
import { appointment_status } from '../rawData/AppointmentStatus';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';

function Filters(props) {
    const { search, setSearch, filterData, type } = props
    const [centerData, setCenterData] = useState([])
    const handleChangeInput = (e) => {
        const newData = { ...search }
        newData[e.target.name] = e.target.value
        setSearch(newData)
    }

    useEffect(() => {
        getCenters()
    }, [])

    function getCenters() {
        axiosBaseUrl.get(`admin/center?verify_status=approved`)
            .then((res) => {
                console.log(res.data)
                setCenterData(res.data.data)


            }).catch(error => {

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


    function resetFilter() {
        setSearch({ from_date: "", to_date: "", appointment_status: "", center_id: "" }); 
        filterData('reset') 
    }

    return (
        <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        {/* <p className="card-title">Filters</p> */}
                        <div className="row">
                            {
                                type !== 'today' ? 
                                <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3">
                                    <label className='mb-1'>From Date - To Date</label>

                                    <div className='relative filter'>
                                        <input className='form-control' value={search.from_date ? moment(search.from_date, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' - ' + moment(search.to_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'DD/MM/YYYY - DD/MM/YYYY'} />
                                        <i class="fa fa-calendar" aria-hidden="true"></i>

                                        <DateRangePickerComponent
                                            placeholder="From Date - To Date"
                                            min={type == 'upcoming' ? new Date() : ''}
                                            max={type == 'history' ? new Date() : ''}
                                            onChange={(e) => {

                                                const newData = { ...search }
                                                newData['from_date'] = e.target.value !== null ? moment(e.target.value[0]).format('YYYY-MM-DD') : ''
                                                newData['to_date'] = e.target.value !== null ? moment(e.target.value[1]).format('YYYY-MM-DD') : ''
                                                setSearch(newData)
                                            }}

                                            format="dd-MMM-yy"
                                        />

                                    </div>

                                </div>
                            </div>
                                : 
                                ''
                            }
                            

                             {
                                 type !== 'cancelled' ?    <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                 <div className="ml-xl-4 mt-3">
 
                                     <label className='mb-1'>Appointment Status</label>
 
                                     <select
                                         className="form-control"
                                         name="appointment_status"
                                         onChange={(e) => handleChangeInput(e)}
                                         value={search.appointment_status}
                                     >
                                         <option>Select Appointment status</option>
 
                                         {
                                             appointment_status.map((x, index) => {
 
                                                 return (
                                                     <option key={index} value={x.status.toLowerCase()}>{x.status}</option>
 
                                                 )
                                             })
                                         }
                                     </select>
                                 </div>
                             </div> : ''
                             }               
                          

                            <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3">

                                    <label className='mb-1'>Centre</label>

                                    <select
                                        className="form-control"
                                        name="center_id"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={search.center_id}
                                    >
                                        <option>Select Centre</option>

                                        {
                                            centerData.map((x, index) => {

                                                return (
                                                    <option key={index} value={x._id}>{x.name}</option>

                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>


                            {/* <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                            <div className="ml-xl-4 mt-3">
                                <label>Appointment Id, Patient Name, Contact No.</label>
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search By Patient Name and Contact No." />
                            </div>
                        </div> */}


                            <div className="col-12 d-flex flex-column justify-content-start">
                                <div className="ml-xl-4 mt-3 text-right">
                                    <button type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => { resetFilter()}}>Reset</button>

                                    <button className="btn btn-sm custom-btn" onClick={filterData}>Search</button>
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
