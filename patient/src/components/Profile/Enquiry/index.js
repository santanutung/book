import React, { useEffect, useState } from 'react';
import axiosBaseUrl from '../../../axiosBaseUrl';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
import Chat from './Chat';
// import Chat from './Chat'

function Enquiry() {
    const [enquiries, setEnquiries] = useState([])
    const [enquiryId, setEnquiryId] = useState('')
    const [loading, setLoading] = useState(false)
    const [viewEnquiryId, setViewEnquiryId] = useState('')
    // const [viewData, setViewData] = useState({})
    useEffect(() => {
        getEnquiries()
    }, [])

    function getEnquiries() {
        setLoading(true)
        axiosBaseUrl.get('patients/api/enquiry?page=1&limit=10')
            .then((res) => {

                setEnquiries(res.data.data)
                setLoading(false)

            }).catch(error => {
                // console.log(error.response)
                if (error.response) {

                }
                else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                setLoading(false)

            })
    }
    return (

        <div

            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
        >
            {
                loading ?
                <div className='text-center'>
                    <ProcessLoader />
                </div>
                :
                enquiries.length == 0 ?

                    <div className='text-center mt-5'>
                        <h5 className='text-center text-theme-color'>Enquiry are not available</h5>
                    </div>


                    :
                enquiries.map((x, index) => {
                    return (
                        <>
                            <div className="card shadow sp_csg" key={x._id}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 col-3 patient">
                                            <div className="user-Css text-center">

                                                <div className='mt-3 mb-3'> <span className="patn-css ">
                                                    <div>
                                                        Query No.
                                                    </div>
                                                    <div className='mt-1-5'>
                                                        <h3>{x.enquiry_no}</h3>
                                                    </div>

                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7 col-9">
                                            <div className='text-left '>
                                                <p className='text-theme-color text-justify'><strong>{x.subject}</strong></p>
                                                <p className='text-theme-color text-justify mt-2 pointer' onClick={() => enquiryId === x._id ? setEnquiryId('') :  setEnquiryId(x._id)}>
                                              

                                                    {
                                                       enquiryId === x._id ?
                                                            <>
                                                                {x.message}
                                                                <i onClick={() => setEnquiryId()} classname="fas fa-minus ml-1 pointer"></i>
                                                            </>

                                                            :
                                                            <>
                                                                {x.message.slice(0, 100)}
                                                                {
                                                                    x.message.length > 100 ? <>...<i onClick={() => setEnquiryId(x._id)} classname="fas fa-plus ml-1 pointer"></i></> : ''
                                                                }

                                                            </>
                                                    }
                                                </p>
                                                
                                               
                                            </div>
                                        </div>
                                            <div className='col-md-2'>
                                            <p className='text-right'>
                                                    <button className='message-btn' onClick={() => setViewEnquiryId(x._id)}>Message</button>
                                                </p>

                                            </div>
                                    </div>

                                </div>
                            </div>
                            <br />
                        </>
                    )
                })
            }
            {/* {
                    totalPages > 1  ?
                <Pagination callbackFunction={changePage}  totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
:''
                } */}

{
            viewEnquiryId ? 
            <Chat enquiryId={viewEnquiryId} setEnquiryId={setViewEnquiryId} /> : ''
        }
        </div>
    );
}

export default Enquiry;
