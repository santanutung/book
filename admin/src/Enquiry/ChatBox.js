import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../axiosBaseUrl'
import useGlobalContexts from '../context/GlobalContext'
import { socket } from '../context/socket'
import jwt_decode from "jwt-decode";
import { selectUserId } from '../Redux/userSlice'
import { useSelector } from 'react-redux'

function ChatBox(props) {
  const { enquiryId, setEnquiryId } = props
  const [chats, setChats] = useState([])
  const [followUp, setFollowUp] = useState('')
  const { setLoadingState } = useGlobalContexts()

  const userId = useSelector(selectUserId)

  useEffect(() => {

    getEnquiry()
    socket.on(enquiryId + 'enquiry-chat', (data) => {
      getEnquiry()
    });
  }, [])
  const [errors, setErrors] = useState({});
  function updateEnquiry(e) {
    e.preventDefault()
    setLoadingState(true)
    setErrors({})
    if (followUp == "") {
      setErrors({ 'follow_up': "Message is required" })
      setLoadingState(false)
    }
    else {


      axiosBaseUrl.post(`admin/enquiry/${enquiryId}`, { message: followUp })
        .then((res) => {
          Swal.fire("", 'Enquiry is updated', 'success')
          // setShowModal(false)
          // socket.emit("enquiry -chat", enquiryId);
          getEnquiry()
          setFollowUp('')
          setLoadingState(false)
          socket.emit("notification", res.data.user_id + "user", res.data.notification);
        }).catch(error => {
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


  }



  function getEnquiry() {
    axiosBaseUrl.get(`admin/enquiry/${enquiryId}`)
      .then((res) => {
        console.log(res.data.data.follow_up)
        setChats(res.data.data.follow_up)

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

      })
  }

  return (
    <div className="floating-chat">
      <div className="chat">
        <div className="header text-right">
          <a onClick={() => setEnquiryId('')}>
            <i className="fa fa-times-circle" aria-hidden="true" />
          </a>
        </div>

        <div className="messages chat-messages col-12">
                                            {
                                                
                                                chats.map((chat, index) => {
                                                    return (
                                                        chat.user_id ? <div className="chats chats-left" key={chat._id+"message"}><div>{chat.message}</div></div> :
                                                            <div className="chats chats-right"  key={chat._id+"message"}><div>{chat.message}</div></div>
                                                    )
                                                })
                                               
                                            }
                                            

                                        </div>


        {/* <ul className="messages">

          {
            chats.map((x, index) => {

              return (
                userId == x.userId ? <p className="self"><span>{x.message}</span></p> : <p className="other"><span>{x.message}</span></p>

              )
            })}

        </ul> */}
        <form onSubmit={updateEnquiry}>
          <div className="footer d-flex mt-5">
            <input className='form-control w-80'
              onChange={(e) => setFollowUp(e.target.value)}
              value={followUp}
            />
            <button id="sendMessage" className='btn btn-sm btn-primary w-20'>send</button>
          </div>
          <span className="form-errors">{errors.follow_up}</span>

        </form>
      </div>
    </div>
  )
}

export default ChatBox
