import React from 'react';
import { env } from '../../env';

function ViewAppointment(props) {
    const { viewData, setViewData } = props
    return (
        <div className="modal fade show modal-show" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-md" role="document">
                <form>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Reports</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setViewData({})}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body table-repsonsive">

                            <table className='table'>
                                <thead>

                                    <th>Title</th>
                                    <th>Report</th>
                                </thead>
                                <tbody>

                                    {



                                        viewData.reports.map((x, index) => {
                                            return (
                                                <tr key={x.reportId._id + "report"}>

                                                    <td>{x.reportId?.title}</td>
                                                    <td><a href={env.imageurl + x.reportId.file} target="blank">View Report</a></td>

                                                </tr>
                                            )
                                        })}


                                </tbody>

                            </table>


                        </div>
                        <div className="modal-footer">


                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setViewData({})}>Close</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>);
}

export default ViewAppointment;
