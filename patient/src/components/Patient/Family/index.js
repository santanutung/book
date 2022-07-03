import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react'
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';
import AddModal from './AddModal';
import EditModal from './EditModal';

function Family() {

    const [familyModal, setFamilyModal] = useState('')
    const [addFamilyModal, setAddFamilyModal] = useState(false)
    const [editFamilyModal, setEditFamilyModal] = useState(false)
    const [members, setMembers] = useState([]);
    const [editMember, setEditMember] = useState({});
    const [loading, setLoading] = useState(false)
    const [addData, setAddData] = useState({ name: '', blood_group: '', relation: '', dob: '', gender: '' });

    useEffect(() => {
        patientFamily()
    }, [])

    function patientFamily() {
        setLoading(true)
        axiosBaseUrl.get(`patients/api/family-member-list`)
            .then((res) => {
                console.log(res.data.data)
                setMembers(res.data.data)
                

            }).catch(error => {
                console.log(error)

            })
    }

    return (
        <>
            <div className="row">

              
                <div className="col-lg-12 grid-margin stretch-card mt-5">
                    <div className="card">
                    <div className='text-right card-header'>
                <button className='btn btn-sm btn-primary' onClick={() => { setAddFamilyModal(true); setEditMember({})}}>Add Family Member</button>

                                              
                </div>
                        <div className="card-body">
                            <div className='text-center'>

                            </div>
                            <div className='table-responsive'>
                                <table className="table table-hover table-striped" >
                                    <thead>
                                        <tr>
                                            <th>Profile Image</th>
                                            <th>Name</th>
                                            <th>Dob</th>
                                            <th>Gender</th>
                                            <th>Blood Group</th>
                                            <th>Relation</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            members.map((x, index) => {
                                                if (x.relation != 'self') {

                                                    return (


                                                        <tr>
                                                            <td>{x.profile_photo_path ? <img src={env.imageurl+x.profile_photo_path} className='table-image' /> : ''}</td>
                                                            <td className='capitalize'> {x.name}</td>
                                                            <td>{x.dob ? moment(x.dob).format('DD/MM/YYYY') : ''}</td>
                                                            <td className='capitalize'>{x.gender}</td>
                                                            <td>{x.blood_group}</td>
                                                            <td className='capitalize'>{x.relation}</td>
                                                            <td><a onClick={() => { setAddFamilyModal(true); setEditMember(x) }}><i className='fa fa-edit' /></a></td>

                                                        </tr>
                                                    )
                                                }
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddModal familyModal={addFamilyModal} setFamilyModal={setAddFamilyModal} patientFamily={patientFamily} editMember={editMember}/>
           </>
    )
}

export default Family
