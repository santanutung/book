import React from 'react'

function Chat(props) {
    const {messages} = props
    return (
        <div className="direct-chat-messages row">

<div className="messages chat-messages col-12">
                                            {
                                                
                                                messages.map((chat, index) => {
                                                    return (
                                                        chat.user_id ? <div className="chats chats-left" key={chat._id+"message"}><div>{chat.message}</div></div> :
                                                            <div className="chats chats-right"  key={chat._id+"message"}><div>{chat.message}</div></div>
                                                    )
                                                })
                                               
                                            }
                                            

                                        </div>




                            {/* {
                                messages.map((message, index) => {
                                    return (
                                            <div className='right-chat'>
                                            <p>
                                                <span>{message.message}
                                                </span>
                                                </p>
                                            </div>
                                    //     <div className="direct-chat-msg">
                                    //     <div className="direct-chat-info clearfix">
                                    //         <span className="direct-chat-name pull-left">
                                               
                                    //         </span>
                                    //         <span className="direct-chat-timestamp pull-right">
                                    //             {message.date_time}
                                    //         </span>
                                    //     </div>
                                      
                                    //     <div className="direct-chat-text">
                                    //         {message.message}
                                    //     </div>
                                    // </div>
                                    )
                                })
                            } */}
                          
                          </div>

    )
}

export default Chat
