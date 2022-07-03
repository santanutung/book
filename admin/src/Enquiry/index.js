import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'
import useGlobalContexts from '../context/GlobalContext'
import Layout from '../Layout'
import Pagination from '../ReuseableComponent/Pagination'
import ChatBox from './ChatBox'
import EnquiryList from './EnquiryList'
import Filters from './Filter'


function Enquiry() {

    const { setLoadingState } = useGlobalContexts()
    const [enquiry, setEnquiry] = useState([])

    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [enquiryId, setEnquiryId] = useState('')
    const [search, setSearch] = useState({date : '', enquiry_no : ''})

    useEffect(() => {
        getEnquiries(1)
    }, [])



    function getEnquiries(page, type = null) {

        setLoading(true)

        var url = `admin/enquiry-list?limit=10&page=${page}&date=${search.date}&enquiry_no=${search.enquiry_no}`
        if(type == 'reset') {
            url = `admin/enquiry-list?limit=10&page=${page}`
        }
        axiosBaseUrl.get(url)
            .then((res) => {
                console.log(res)
                setEnquiry(res.data.data.docs)
                // alert(res.data.page)
                setTotalPages(res.data.page)
                // setTotalPages(res.data.data.total)
                // changePage(page)
                setLoading(false)

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

    function reset() {
        setSearch({date : '', enquiry_no : ''})
        getEnquiries(1, 'reset')
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
                                            <li className="breadcrumb-item active" aria-current="page">Manage Enquiry</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row">

                        <div className="col-lg-12 grid-margin mt-5">
                            
                                    <Filters search={search} setSearch={setSearch} getEnquiries={getEnquiries} reset={reset}/>
                               
                        </div>

                        <div className="col-lg-12 grid-margin mt-2">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Manage Enquiry</h4>

                                    <EnquiryList enquiry={enquiry} getEnquiries={getEnquiries} loading={loading} setLoading={setLoading} setEnquiryId={setEnquiryId} />

                                </div>
                                <div className='card-footer'>

                                    {
                                        totalPages > 1 ?
                                            <Pagination callbackFunction={getEnquiries} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                            :
                                            ''
                                    }


                                </div>

                            </div>
                        </div>


                    </div>


                </div>
            </div>
            {
                enquiryId ?
                    <ChatBox enquiryId={enquiryId} setEnquiryId={setEnquiryId} /> : ''
            }

        </Layout>
    )
}

export default Enquiry
