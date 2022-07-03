import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { env } from '../../env'
import numberFormat from '../../functions'

function CenterCard(props) {
    const { center, searchData } = props
    const [todayTime, setTodayTime] = useState("Today Closed")
    useEffect(() => {
        todayTiming(center.times)
    }, []);

    function todayTiming(times) {
        var time = times.filter((time, index) => {
            if (time.day.toLowerCase() === moment().format('dddd').toLowerCase()) {
                return time
            }
        })
        if (time.length > 0) {
            var today_time = time[0].opening_time + " - " + time[0].closing_time;
            setTodayTime(today_time)
        }
    }

    return (
        <>
            <Link
                to={{
                    pathname: `/centre/${center._id}`,
                    state: {
                        name: center.name,
                        details: center,
                        id: center._id,
                        searchData : searchData
                    }
                }}
                // className="col-md-6 mb-3"

                key={center._id}>
                <div className="row mb-4">
                    <div className="col-md-12 col-lg-10 offset-lg-1">
                        <div className="row">
                            <div className="card card-services">
                                <div className="card-body card-p">
                                    <div className="row">
                                        <div className={`col-md-4 pding-l center-profile-image ${!center.primaryImage ? "center-profile-bg" : ''}`} style={{ backgroundImage: "url(" + env.imageurl + center.primaryImage + ")" }}>
                                        {/* <div className="col-md-4 pding-l "> */}
                                            
                                            <div className="service-bx service-l">
                                                {
                                                    center.distance ? <a href="#" className="btn btn-info btn-t mobile-distance">

                                                        {center.distance.toFixed(2)} KM Away
                                                    </a> : ""
                                                }
                                                {/* <img src={env.imageurl + center.primaryImage} alt={center.name} width="100%" height="250px" /> */}
                                            </div>
                                        </div>
                                        <div className='col-md-8 row'>

                                            <div className='col-md-12 row'>
                                                <div className='col-md-10 heading-service'>
                                                    <p>
                                                        <strong className='capitalize'>{center.name}</strong>
                                                    </p>
                                                    <p>{(center.area != null ? center.area : '') + " " + center.city + " " + center.state}</p>
                                                    <br />
                                                </div>
                                                {/* <div className='col-md-2'>
                                                    <div className="service-i">
                                                        <i className="fa fa-heart-o" aria-hidden="true" />
                                                        <br />
                                                        <br />
                                                    </div>
                                                </div> */}
                                            </div>

                                            <div className="col-md-12 max-pd">
                                                <div className="heading-service">

                                                    <p className="beds-l">No. of beds available <span className='mr-5'>{center.date_slots_temp}</span></p>
                                                 
                                                    <br />


                                                </div>
                                            </div>
                                          
                                            <div className='row'>
                                                <div className='col-6 timing-l timing-left'>
                                                    <p className='text-left'> Timings <span>{todayTime}</span> </p>
                                                </div>
                                                <div className='col-6 timing-l'>
                                                    <p className='text-right'>
                                                        <strong className='price'>{numberFormat(center.charges).replace('.00', '')}</strong>
                                                        <span>Per Dialysis</span>
                                                        <span ><i
                                                            className="fa fa-exclamation-circle"
                                                            aria-hidden="true"
                                                        />
                                                        </span>
                                                    </p>

                                                </div>
                                            </div>
                                            <div className='col-md-12 row'>

                                                <div className='col-lg-3'>
                                                    {
                                                        center.distance ? <a href="#" className="btn btn-info btn-t desktop-distance">

                                                            {center.distance.toFixed(2)} KM Away
                                                        </a> : ""
                                                    }
                                                </div>
                                                <div className='col-lg-9 text-right'>
                                                <a href="#" className="btn btn-info book-btn mr-1">
                                                            Book a slot
                                                        </a>
                                                        <a href="#" className="btn btn-info know-btn">
                                                            Know more
                                                        </a>

                                                    {/* <ul className='book-btn'>
                                                        <li><a href="#" className="btn btn-info book-btn">
                                                            Book a slot
                                                        </a></li>
                                                    
                                                       <li> <a href="#" className="btn btn-info know-btn">
                                                            Know more
                                                        </a></li>
                                                    </ul> */}
                                                    {/* <div className="col-6 col-md-6 text-right">
                                                        <a href="#" className="btn btn-info book-btn">
                                                            Book a slot
                                                        </a>
                                                    </div>
                                                    <div className="col-6 col-md-6">
                                                        <a href="#" className="btn btn-info know-btn">
                                                            Know more
                                                        </a>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link >
            <br />

        </>
       
    )
}

export default CenterCard
