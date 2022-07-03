import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import { socket } from '../../context/socket';
import Layout from '../../Layout';
import ProcessLoader from '../../ReuseableComponent/ProcessLoader';
import $ from "jquery";
function Chat() {
    const [centerData, setCenterData] = useState([])
    const [chats, setChats] = useState([])
    const [centerId, setCenterId] = useState('')
    const [message, setMessage] = useState([])
    const [loader, setLoader] = useState(false)
    const { id } = useParams();
    const { setLoadingState, chatCenter, setChatCenter } = useGlobalContexts()
    const adminCenterChatLength = socket?._callbacks?.['$admin-center-chat']?.length || 0;

    useEffect(() => {

        // alert("test")
        getCenters()
        setCenterId(id);

        if (id) {
            if (typeof (adminCenterChatLength) !== 'undefined' && adminCenterChatLength < 1) {
                socket.on(`admin-center-chat`, (data) => {
                    // alert("id")
                    let cID = window.location.href?.split('chats/')?.[1] || id;
                    getChat(cID)
                });
            }
        }

        setChatCenter(id)
        setLoadingState(true)

    }, [id]);

    function getCenters() {

        var url = `admin/center?verify_status=approved`;
        setLoader(true)
        axiosBaseUrl.get(url)
            .then((res) => {

                setCenterData(res.data.data)
                // setLoader(true)

                if (id) {
                    setChatCenter(id)
                    getChat(id)
                    // alert("test")
                    // socket.on(`admin-center-chat`, (data) => {

                    //     getChat(id)
                    // });
                }
                else {

                    setChatCenter(res.data.data[0]._id)
                    // getChat(res.data.data[0]._id)

                    // socket.on(`admin-center-chat`, (data) => {

                    //     getChat(res.data.data[0]._id)
                    // });

                }
                setLoadingState(false)

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
            }).finally(()=>{
                setLoader(false)
            })

    }

    function scroll() {
        $("#card-body").animate({
            scrollTop: $('#card-body')[0].scrollHeight - $('#card-body')[0].clientHeight
        }, 1000);
    }


    function getChat(centerKey) {


        // alert(centerKey+ "----get-message")
        // setChatCenter(centerKey)
        // alert(centerKey)    
        var url = `admin/center-chat/${centerKey?centerKey:chatCenter}`;
        setLoader(true)
        axiosBaseUrl.get(url)
            .then((res) => {
                console.log(res.data.data)
                setChats(res.data.data)
                setMessage('')
                
                scroll()

            }).catch(error => {
                // alert("test")
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
            }).finally(()=>{
                setLoader(false)
            })

    }

    function sendMessage(e) {

        // alert(chatCenter+ "----send-message")
        var url = `admin/center-chat/${chatCenter}`;
        axiosBaseUrl.post(url, {
            message: message
        })
            .then((res) => {
                // console.log(res.data)
                // alert(centerId)
                // alert(centerId)
                // alert(centerId)
                // getChat(chatCenter)
                // socket.emit("center-chat", chatCenter, res.data.data);
                socket.emit("center-chat", "admin", { module: 'chat', message: message });



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
                                            <li className="breadcrumb-item active" aria-current="page">Chat</li>
                                        </ol>
                                    </nav>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className='card'>
                                <div className='card-body'>
                                    <ul>
                                        {
                                            centerData.map((center, index) => {
                                                return (
                                                    <div className={centerId === center._id ? 'chat-center active' : 'chat-center'} ><Link
                                                        // onClick={()=> setChatCenter(center._id)} 
                                                        to={"/chats/" + center._id}
                                                    >{center.name}</Link></div>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className='card chat-message-card'>
                                <div className='card-body' id='card-body'>


                                    <div className="chat-messages" id='message'>
                                        {
                                            loader ? <ProcessLoader /> :
                                                chats.map((chat, index) => {
                                                    return (
                                                        chat.user_id ? <div className="chats chats-right"><div>{chat.message}</div></div> :
                                                            <div className="chats chats-left"><div>{chat.message}</div></div>
                                                    )
                                                })
                                        }

                                    </div>

                                </div>
                                <div className='card-footer d-flex'>
                                    <textarea className='form-control' onChange={(e) => { setMessage(e.target.value) }} value={message}></textarea>
                                    <button className='btn btn-sm btn-primary' disabled={message === '' ? true : false} onClick={(e) => sendMessage(e)}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Chat;
