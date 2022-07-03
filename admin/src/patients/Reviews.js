import React from 'react'
import { Link } from 'react-router-dom'

function Reviews(props) {
    const { reviews } = props
    return (
        <div
            className="tab-pane fade active show"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
        >
            <div className="table-responsive">
                <table className="table table-hover" >
                    <thead>
                        <tr>
                            <th>Centre Name</th>
                            <th>Review</th>
                            <th>Cleanliness</th>
                            <th>Hygiene</th>
                            <th>Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reviews.map((x, index) => {

                                    return (


                                        <tr>
                                            <td><Link to={`/centreProfile/${x.center_id._id}`}>{x.center_id?.name}</Link></td>
                                            <td className='word-break'>{x.review}</td>
                                            <td>{x.cleanliness_rating}</td>
                                            <td>{x.hygiene_rating}</td>
                                            <td>{x.service_rating}</td>


                                        </tr>
                                    )
                            })
                        }

                    </tbody>
                </table>

            </div>


        </div>
    )
}

export default Reviews
