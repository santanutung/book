import moment from 'moment'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../axiosBaseUrl'
import Layout from '../../Layout'
import Pagination from '../../ReuseableComponent/Pagination'
import ProcessLoader from '../../ReuseableComponent/ProcessLoader'
import ViewModal from './ViewModal'

function Testimonial() {
   
    const [data, setTestimonials] = useState([])
    
    const [loading, setLoading] = useState(true)

    const [pages, setPages] = useState([1])
    const [filterList, setFilterList] = useState([])
    const [filterItems, setFilterItems] = useState([])
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    

    const [view, setView] = useState({})
    useEffect(() => {
        getTestimonials(1)
    }, [])

 




    function getTestimonials(page) {

        setLoading(true)

        axiosBaseUrl.get(`admin/testimonials?limit=5&page=${page}`)
            .then((res) => {
                // alert(res.data.data.length)
                    setLoading(false)
                   setTestimonials(res.data.data)
               
                   setTotalPages(Math.ceil(res.data.data.length / limit))
                   setLoading(false)
                   setFilterList(res.data.data)
                   setFilterItems(res.data.data.slice((currentPage - 1) * limit, currentPage*limit))
                   
   
   



            }).catch(error => {
                setLoading(false)
                console.log(error.response)
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



    function updateStatus( value, id) {

        var options = value
        console.log(options);
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Update`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.post(`admin/testimonials/update-status/${id}`,options)
                    .then((res) => {

                        Swal.fire('', 'Testimonial is successfully updated', 'success')
                     
                        getTestimonials(currentPage)
                        setView({})

                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    function searchTestimonial(e) {
        var search = e.target.value
        // console.log(search)
        const filterData = data?.filter((x) => {
            if (search === "") return x;
            else if (
              x.userId.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                x.review  
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                x.verify_status  
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                x.status  
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                moment(x.createdAt).format('DD/MM/YYYY') 
                .toLowerCase()
                .includes(search.toLowerCase())
            )
              return x;
          });

          setFilterItems(filterData.slice((1 - 1) * limit, 1*limit))
          setFilterList(filterData)
          setTotalPages(Math.ceil(filterData.length / limit))
        //   alert(filterData.length )

        //   setFilterList(filterData)
        //   console.log(filterList);

          
    }


    function deleteTestimonial(id) {
        Swal.fire({
            title: 'Are You Sure?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
        }).then((result) => {
            if (result.isConfirmed) {

                axiosBaseUrl.delete(`admin/testimonials/${id}`)
                    .then((res) => {

                        Swal.fire('', 'Testimonial is successfully deleted', 'success')
                     
                        getTestimonials(1)

                    }).catch(error => {
                        console.log(error)

                    })

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });

    }


    function changePage(page) {

        setFilterItems(filterList.slice((page - 1) * limit, page * limit))


    }

    return (
        <Layout >
        <div className="main-panel">
           <div className="content-wrapper">


               <div className="row">
                   <div className="col-md-12 mb-3">
                       <div className="row">
                           <div className="col-xl-12">
                               <nav aria-label="breadcrumb">
                                   <ol className="breadcrumb">
                                       <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                       <li className="breadcrumb-item active" aria-current="page">Manage Testimonials</li>
                                   </ol>
                               </nav>

                           </div>
                       </div>
                   </div>
               </div>



               <div className="row">


                   <div className="col-lg-12 grid-margin stretch-card mt-5">
                       <div className="card">
                           <div className="card-body">
                               <h4 className="card-title">Manage Testimonials</h4>
                               <div>
                                   <input className='form-control w-20' onChange={(e) => searchTestimonial(e)}></input>
                               </div>
                               <div className="table-responsive">
                                   <table className="table table-hover">
                                       <thead>
                                           <tr>
                                               <th>Date</th>
                                               <th>Name</th>
                                               <th>Review</th>
                                               <th>Action</th>
                                               <th>Delete</th>
                                               <th>View</th>

                                           </tr>
                                       </thead>
                                       <tbody>

                                           {
                                           
                                           loading ?

                                                   <tr>
                                                       <th className="text-center" colSpan="9">
                                                       <ProcessLoader />  Loading ...
                                                       </th>
                                                   </tr>

                                                   :
                                                   filterItems.map((enq, index) => {
                                               return (
                                                   <tr key={index+"enquiry"}>
                                                       <td>{moment(enq.createdAt).format('DD/MM/YYYY')}</td>
                                                       <td className='capitalize'>{enq.userId?.name}</td>
                                                       <td className='word-break '>{enq.review.substr(0,20)} {enq.review.length > 20 ? '...' : ""}</td>
                                                       <td>
                                                           {
                                                           enq.verify_status == 'pending' ? 
                                                            <>
                                                             <button className='btn btn-sm btn-success' onClick={() => updateStatus({'verify_status': 'approved'}, enq._id)}>Approved</button>
                                                             <button className='btn btn-sm btn-danger ml-1'  onClick={() => updateStatus({'verify_status': 'reject'}, enq._id)}>Reject</button>
                                                            </>
                                                            :
                                                            (
                                                                enq.verify_status == 'approved' ? 
                                                                (
                                                                    enq.status == 'active' ?
                                                                    <button className='btn btn-sm btn-success' onClick={() => updateStatus({'status': 'inactive'}, enq._id)}>Enabled</button>
                                                                    :
                                                                    <button className='btn btn-sm btn-danger' onClick={() => updateStatus({'status': 'active'}, enq._id)}>Disabled</button>
                                                                )
                                                                :
                                                                ''
                                                                
                                                            )
                                                           
                                                           }
                                                          
                                                       </td>
                                                       <td>
                                                           <button className='btn btn-sm btn-danger' onClick={() => deleteTestimonial(enq._id)}>Delete</button>
                                                       </td>
                                                       <td>
                                                       <button className='btn btn-sm btn-primary' onClick={() => setView(enq)}>View</button>
                                                       
                                                       </td>
                                                   </tr>
                                               )
                                           })}

                                       </tbody>
                                   </table>
                               </div>
                           </div>
                           <div className='card-footer'>

{
    totalPages > 1 ?
        <Pagination callbackFunction={changePage} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
        : ''
}
</div>
                       </div>
                   </div>


               </div>


           </div>
       </div>
       {
           view._id ? <ViewModal view={view} setView={setView} updateStatus={updateStatus} /> : ''
       }

   </Layout>
    )
}

export default Testimonial
