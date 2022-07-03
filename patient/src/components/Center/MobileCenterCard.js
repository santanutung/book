import React from 'react'
import { Link } from 'react-router-dom'
import { env } from '../../env'
import numberFormat from '../../functions';

function MobileCenterCard(props) {
    const { centerListData } = props
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    return (
        <div className='row'>
            {
                centerListData.map((x, index) => {
                    let formattedName = x.name
                    formattedName = formattedName.replaceAll(" ", "_")


                    return (

                        <Link
                            to={{
                                pathname: `/centre/${x._id}`,
                                state: {
                                    name: x.name,
                                    details: x,
                                    id: x._id,
                                }
                            }}
                            className="mb-3"

                            key={index}>

                           
                            <div className="col-md-8 offset-md-2">
                                <div className="service-bx service-l">
                                    <div className="col-md-12">
                                        <div className="row service-pd">
                                            <div className='col-md-12'>
                                                <img src={env.imageurl + x.primaryImage} width="100%" />

                                            </div>

                                            <div className="col-md-6">
                                                <div className="service">
                                                    <h3>{x.name}</h3>
                                                    <h3> {x.address + " " + x.city + " " + x.state + " " + x.pincode}</h3>

                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="service-i">
                                                    <i className="fa fa-heart-o" aria-hidden="true"></i><br /><br />


                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="service">
                                                    <p>No. of beds available <span className="bed-l">{x.total_beds}</span></p>
                                                    <p className="sp-se"><span className="sp-price">{numberFormat(x.charges).replace('.00', '')}</span> <span>Per Dialysis</span></p>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="service-i center-timing">
                                                    <p ><strong>Timings </strong>
                                                        <br />
                                                        <ul  >
                                                            {
                                                                x.times.map((time, t_index) => {
                                                                    return <li>{time.day + "(" + time.opening_time + " - " + time.closing_time + ")"}</li>
                                                                })
                                                            }
                                                        </ul>
                                                    </p>

                                                    <p className="monthly-subscription"><Link to={'/appointment/' + x._id} type="button" className="btn-service">Book a slot</Link></p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </Link>


                    )

                })
            }
        </div>
    )
}

export default MobileCenterCard
