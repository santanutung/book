import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosBaseUrl from '../../axiosBaseUrl';
import { socket } from '../../context/socket';
import ProcessLoader from '../../custom/ProcessLoader';
import Layout from '../../Layout';
import { selectCenterId } from '../../Redux/userSlice';
import AddModal from './AddModal';
import EnquiryModal from './EnquiryModal';
import $ from "jquery";
function Enquiry() {
    const [loading, setLoading] = useState(true)
    const [enquiries, setEnquiries] = useState([])
    const centerId = useSelector(selectCenterId)
    const [message, setMessage] = useState([])
    const messagesEndRef = React.createRef();

    useEffect(() => {
        getEnquiries()

        socket.on(`${centerId}-center-chat`, (data) => {
            getEnquiries()
            setTimeout( scroll, 500)
        });
        setTimeout( scroll, 500)

        socket.on(`admin-center-chat`, (data) => {
            if(data){
                getEnquiries();
                setTimeout( scroll, 500)
            }
        });

    }, []);

    function scroll() {
        $("#card-body").animate({
            scrollTop: $('#card-body')[0].scrollHeight - $('#card-body')[0].clientHeight
          }, 1000);
    }

    function getEnquiries() {
        // alert(document.getElementById('card-body').offsetBottom)
        axiosBaseUrl.get('private/chats')
            .then((res) => {

                setEnquiries(res.data.data)
                setLoading(false)
        // window.scroll(0,document.getElementById('card-body').offsetBottom);

        // $("#card-body").animate({
        //     scrollTop: $('#card-body')[0].scrollHeight - $('#card-body')[0].clientHeight
        //   }, 1000);



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
                // setLoader(false)

            })
    }

    function sendMessage() {

        // alert(id)
        var url = `private/send-message`;
        axiosBaseUrl.post(url, {
            message: message
        })
            .then((res) => {
                console.log(res.data.data)
                // getEnquiries()
                setMessage('')
                socket.emit("center-chat", "admin", res.data.data);

                socket.emit("center-chat", centerId, res.data.data);
                // scrollToBottom()
                // scroll()

            }).catch(error => {
                console.log(error.response)
                if (error.response) {
                    alert(error.response.data.error)

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
                                            <li className="breadcrumb-item"
                                            ><a href="/dashboard">Dashboard</a></li>
                                            <li className="breadcrumb-item active"
                                                aria-current="page">Enquiry</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card" style={{height: 'calc(100vh - 200px)'}}>
                            <div className="card chat-message-card"  >
                                <div className="card-body" id="card-body" ref={messagesEndRef} >
                                    <p className="card-title">Manage Enquiry</p>
                                    <div className="row">


                                        <div className="messages chat-messages col-12">
                                            {
                                                
                                                enquiries.map((chat, index) => {
                                                    return (
                                                        chat.user_id ? <div className="chats chats-left" key={chat._id+"message"}><div>{chat.message}</div></div> :
                                                            <div className="chats chats-right"  key={chat._id+"message"}><div>{chat.message}</div></div>
                                                    )
                                                })
                                               
                                            }
                                            

                                        </div>



                                    </div>
                                    {/* <div ref={messagesEndRef}>
                                        hello rachna
                                    </div> */}
                                </div>
                                
                                <div className='card-footer d-flex'>
                                    <textarea className='form-control' onChange={(e) => { setMessage(e.target.value) }} value={message}></textarea>
                                    <button className='btn btn-sm btn-primary h-100' disabled={message === '' ? true : false} onClick={() => sendMessage()}>Send</button>
                                </div>

                            </div>
                        </div>
                    </div>



                </div>
            </div>

        </Layout>
    )
}

export default Enquiry;
