import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { socket } from '../../context/sokcet';
import Loader from '../../ReusableComponents/Loader';
import EnquiryValidation, { authEnquiryValidation } from '../../Validation/EnquiryValidation';

function ContactForm() {

  const [enquiryData, setEnquiryData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
  });

  const [enquiryErrors, setEnquiryErrors] = useState({});

  const [loader, setLoader] = useState(false);
  const [social, setSocial] = useState({});

  useEffect(() => {
    getSocial()
  }, [])

  function getSocial() {
    axiosBaseUrl.get(`setting/contact`)
      .then((res) => {
        setSocial(JSON.parse(res.data.data.description))



      }).catch(error => {
      
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


  function enquiryHandle(e) {
    const newData = { ...enquiryData }
    newData[e.target.name] = e.target.value
    setEnquiryData(newData)
  }

  const enquiryHandler = (e) => {
    // socket.emit("notification", 'admin', {message : "hello"});

    e.preventDefault()
    setLoader(true)
    if (!localStorage.getItem('activeUser')) {

      var error_data = EnquiryValidation(enquiryData);
    }
    else {
      var error_data = authEnquiryValidation(enquiryData);
    }
    setEnquiryErrors(error_data);
    if (Object.keys(error_data).length == 0) {



      axiosBaseUrl.post('patients/api/enquiry', enquiryData)
        .then((res) => {
      
          if (res.status == 200) {
            socket.emit("notification", 'admin', res.data.data);
            Swal.fire("", "Thank you, we will contact you soon!", "success")
            setEnquiryData({
              email: "",
              name: "",
              subject: "",
              message: "",
            })
          }
          setLoader(false)


        }).catch(error => {
         
          if (error.response) {
            if (error.response.status == 422) {

              const errorData = { ...enquiryErrors }
              error.response.data.errors.map((value, index) => {
                errorData[value.param] = value.msg

              })
              setEnquiryErrors(errorData)
            }
          }
          else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          setLoader(false)

        })
    }
    else {
      setLoader(false)
    }


  }



  return (
    <>
      {loader ? <Loader /> : ''}

      <section id="contact" className="contact">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2 className="heading-h">
              We'd love to
              <br />
              hear from you.
            </h2>
          </div>
          <div className="row">
            <div
              className="col-lg-5 col-md-12"
              data-aos="fade-up"
              data-aos-delay={300}
            >
              <form
                method="post"
                role="form"
                className="php-email-form1"
                onSubmit={enquiryHandler}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Full Name*"
                        required
                        onChange={(e) => enquiryHandle(e)}
                        value={enquiryData.name}
                      />
                      <span className='text-danger'>{enquiryErrors.name}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="Email address*"
                        required
                        onChange={(e) => enquiryHandle(e)}
                        value={enquiryData.email}
                      />
                      <span className='text-danger'>{enquiryErrors.email}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-10">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        id="subject"
                        placeholder="Subject*"
                        required
                        onChange={(e) => enquiryHandle(e)}
                        value={enquiryData.subject}
                      />
                      <span className='text-danger'>{enquiryErrors.subject}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-10">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="message"
                        rows={6}
                        placeholder="Your Message"
                        style={{ resize: "none" }}
                        required
                        defaultValue={""}
                        onChange={(e) => enquiryHandle(e)}
                        value={enquiryData.message}
                      />
                      <span className='text-danger'>{enquiryErrors.message}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <button type="submit" className='contact-btn'>Save &amp; Proceed</button>
                </div>
              </form>
            </div>
            <div
              className="col-lg-6 col-md-6"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <div className="form-img">
                <img src="img/contact-img.png" className="img-fluid contact-us-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default ContactForm
