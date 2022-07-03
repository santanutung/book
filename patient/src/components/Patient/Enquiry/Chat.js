import React, { useEffect, useState } from 'react'
import axiosBaseUrl from '../../../axiosBaseUrl'
import jwt_decode from "jwt-decode";
import { socket } from '../../../context/sokcet'
import Swal from 'sweetalert2';
import useGlobalContexts from '../../../context/GlobalContext';
function Chat(props) {
  const { enquiryId, setEnquiryId } = props
  const [chats, setChats] = useState([])
  const [userId, setUserId] = useState('')
  const [followUp, setFollowUp] = useState('')
  const { setLoaderState } = useGlobalContexts()
  useEffect(() => {

    var decoded = jwt_decode(localStorage.getItem("activeUser"));

    setUserId(decoded.userId)

    getEnquiry()
    socket.on(enquiryId + 'enquiry-chat', (data) => {
      getEnquiry()
    });


  }, [])

  function getEnquiry() {
    setLoaderState(true)
    axiosBaseUrl.get(`patients/api/enquiry/${enquiryId}`)
      .then((res) => {
       
        setLoaderState(false)
        setChats(res.data.data.follow_up)

      }).catch(error => {
     
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


  const [errors, setErrors] = useState({});
  function updateEnquiry(e) {
    e.preventDefault()
    setLoaderState(true)
    setErrors({})
    if (followUp == "") {
      setErrors({ 'follow_up': "Message is required" })
      setLoaderState(false)
    }
    else {


      axiosBaseUrl.put(`patients/api/enquiry/${enquiryId}`, { message: followUp })
        .then((res) => {
          socket.emit("notification", 'admin', res.data.notification);
          Swal.fire("", 'Enquiry is updated', 'success')
          // setShowModal(false)
          socket.emit("enquiry-chat", enquiryId);
          getEnquiry()
          setFollowUp('')
          setLoaderState(false)
        }).catch(error => {
          console.log(error.response)
          setLoaderState(false)
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



  return (
    <div className="floating-chat">
      <div className="chat">
        <div className="header text-right">
          <a  onClick={() => setEnquiryId('')}>
              <i className="fa fa-times-circle" aria-hidden="true" />
            </a>
        </div>
        <ul className="messages">
          {
            chats.map((x, index) => {
              return (
                userId == x.userId ? <p className="self"><span>{x.message}</span></p> : <p className="other"><span>{x.message}</span></p>

              )
            })}
         
        </ul>
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

export default Chat
