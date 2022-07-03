import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../Layout'
import axiosBaseUrl from '../../axiosBaseUrl'
import AddPartner from './AddPartner';
import Swal from 'sweetalert2';
import { env } from '../../env';
import EditPartner from './EditPartner';

function Partner() {

    const [showModal, setShowModal] = useState("")
    const [partners, setPartners] = useState([])
    const [editData, setEditData] = useState({})
    useEffect(() => {
        getPartners()
    }, [])

    function getPartners() {

        // setLoading(true)

        axiosBaseUrl.get(`admin/partner`)
            .then((res) => {
                // console.log(res.data.data.docs)
                setPartners(res.data.data.docs)


                // setLoading(false)

            }).catch(error => {

                console.log(error)
                if (error.response) {
                    Swal.fire(error.response.data.error, '', 'error')


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

    function deletePartner(id) {

        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`admin/partner/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Partner is successfully deleted', 'success')
                        getPartners()


                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    return (
        <Layout>
            <div className="main-panel">
                <div className="content-wrapper">


                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">

                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Manage Partner</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row">
                        <div className='col-md-12 text-right'>
                            <button className='btn btn-sm btn-primary' onClick={() => setShowModal('add')}>Add Partner</button>
                        </div>


                        <div className="col-lg-12 grid-margin stretch-card mt-2">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Manage Partner</h4>

                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Name</th>
                                                    <th>Image</th>
                                                    <th>Status</th>
                                                    <th>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {partners.map((partner, index) => {
                                                    return (
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{partner.name}</td>
                                                            <td><img src={env.imageurl + partner.image} /></td>
                                                            <td>{partner.active ? "Active" : 'Inactive'}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-danger" onClick={() => deletePartner(partner._id)}><i className='fa fa-trash'></i></button>
                                                                <button className="btn btn-sm btn-primary ml-1" onClick={() => { setShowModal('edit'); setEditData({ id: partner._id, name: partner.name, active: partner.active }) }}><i className='fa fa-edit'></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>


                </div>
            </div>

            {showModal == 'add' ?
                <AddPartner setShowModal={setShowModal} getPartners={getPartners} />
                :
                showModal == 'edit' ?
                    <EditPartner setShowModal={setShowModal} getPartners={getPartners} editData={editData} />
                    :
                    ''
            }


        </Layout>
    )
}

export default Partner
