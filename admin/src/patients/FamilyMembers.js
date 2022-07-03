import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { env } from '../env'
// import moment from 'moment-timezone';

function FamilyMembers(props) {
    const {members} = props
    console.log(members)
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
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Dob</th>
                        <th>Gender</th>
                        <th>Blood Group</th>
                        <th>Relation</th>
                    </tr>
                </thead>
                <tbody>
                {
                            members.map((x, index) => {

                                return (
                                    x.relation !== 'self' ? 
                    <tr>
                        <td> {x.profile_photo_path ?<img src={env.imageurl + x.profile_photo_path} /> : ''}</td>
                        <td className='capitalize'>{x.name}</td>
                        <td>{x.dob ? moment(x.dob).format('DD/MM/YYYY') : ''}</td>
                        <td className='capitalize'>{x.gender}</td>
                        <td>{x.blood_group}</td>
                        <td className='capitalize'>{x.relation}</td>

                    </tr> : ''
                                )
                            })
                        }
                   
                </tbody>
            </table>

        </div>


    </div>
    )
}

export default FamilyMembers
