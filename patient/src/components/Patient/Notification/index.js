import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../../axiosBaseUrl'
import ProcessLoader from '../../../ReusableComponents/ProcessLoader'
import Pagination from '../../../ReusableComponents/Pagination'
function Notification() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getNotifications(1)
    }, [])

    function getNotifications(page) {
        setLoading(true)
        axiosBaseUrl.get(`patients/api/notifications?page=${page}&limit=10`)
          .then((res) => {
            setLoading(false)
            setNotifications(res.data.data.docs)
            console.log(res.data.data, "notif")
            setTotalPages(res.data.data.pages)
            // setCurrentNotification((res.data.unreadNotification).length)
    
    
          }).catch(error => {
            console.log(error)
    
          })
      }
    
    

      
    return (
        <div className="col-lg-12 grid-margin stretch-card mt-5">
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Notifications</h4>
                
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.no.</th>
                                <th>Date</th>
                                <th>Message</th>

                            </tr>
                        </thead>
                        <tbody>

                            {

                                loading ?

                                    <tr>
                                        <th className="text-center" colSpan="2">
                                            <ProcessLoader/>
                                        </th>
                                    </tr>

                                    :
                                    notifications.map((enq, index) => {
                                        return (
                                            <tr key={index + "enquiry"}>
                                                <td>{index+1}</td>
                                                <td>{enq.date}</td>
                                                <td>{enq.message}</td>
                                               
                                            </tr>
                                        )
                                    })}

                        </tbody>
                    </table>
                </div>
            </div>
            <div className='card-footer'>
            {
                            totalPages > 1  ?
                        <Pagination callbackFunction={getNotifications}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
 :''
                        } 
            </div>
         
        </div>
    </div>


    )
}

export default Notification
