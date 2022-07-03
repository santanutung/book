import React from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'

import { permissions } from '../rawData/PermissionData'

function EmployeePermissionScreen() {


     

    function handle(e) {
       
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
                                            <li className="breadcrumb-item"><Link to="/manageEmployee">Manage Employee</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Employee Permissions</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-body">

                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr><th>Module</th><th>Permissions</th></tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((data, key) => {

                                            return (
                                                <tr key="key">
                                                    <td>{data.module}</td>
                                                    <td>
                                                        <ul className="permission-list">
                                                            {data.actions.map((action, actionKey) => {

                                                                return (
                                                                    <li for={actionKey}> <input value="action" type="checkbox" id={actionKey} /> {action}</li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default EmployeePermissionScreen
