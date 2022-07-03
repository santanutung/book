import React, { useState, useEffect } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import useGlobalContexts from '../../context/GlobalContext'
import { Link } from 'react-router-dom'

function Footer() {
  const {
   
    setremoveNotification,
    removeNotification,
  } = useGlobalContexts();
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
  return (
    <>
      <footer id="footer"  onClick={() => setremoveNotification(false)}>
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-lg-4 text-center">
              <div className="copyright">
                <p>Follow Us</p>
                <ul className="follow-b">
                  {social.facebook ? <a href={social.facebook} target="blank">
                    <li>
                      <i className="fa fa-facebook" aria-hidden="true" />
                    </li>
                  </a>
                    : ''
                  }
                  {social.twitter ? <a href={social.twitter} target="blank">
                    <li>
                      <i className="fa fa-twitter" aria-hidden="true" />
                    </li>
                  </a> : ''
                  }

                  {social.instagram ? <a href={social.instagram} target="blank">
                    <li>
                      <i className="fa fa-instagram" aria-hidden="true" />
                    </li>
                  </a> : ''
                  }

                </ul>
              </div>
              <div className="credits">

              </div>
            </div>
            <div className="col-lg-8">
              <nav className="footer-links text-lg-right text-center pt-2 pt-lg-0">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/term-&-user">Terms of Use</Link>
                <a href="#contact">Contact Us</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
      {/* End Footer */}
    </>

    // <footer id="footer">
    //         <div className="container">
    //             <div className="row d-flex align-items-center">
    //                 <div className="col-lg-6 text-lg-left text-center">
    //                     <div className="copyright">

    //                         <p>Copyright 2021 Dialysis All Rights Reserved Designed By <a href="http://arramton.com/" target="_blank">Arramton Infotech Pvt. Ltd.</a></p>
    //                     </div>
    //                     <div className="credits">

    //                     </div>
    //                 </div>
    //                 <div className="col-lg-6">
    //                     <nav className="footer-links text-lg-right text-center pt-2 pt-lg-0">
    //                         <Link to="/" className="scrollto">Home</Link>
    //                         <a href="/about-us" className="scrollto">About</a>
    //                         <Link to="/privacy-policy">Privacy Policy</Link>
    //                         <Link to="/term-&-user">Terms of Use</Link>
    //                         <a href="#contact">Contact Us</a>
    //                     </nav>
    //                 </div>
    //             </div>
    //         </div>
    //     </footer>
  )
}

export default Footer
