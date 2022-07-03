

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import useGlobalContexts from '../../context/GlobalContext';
import Layout from '../Layout';
import Appointment from './Appointment/Index';
import Enquiry from './Enquiry';
import Family from './Family/Index';
import Report from './Report';
import Review from './Review';

function MobileProfile() {

  const { userName, setUserName } = useGlobalContexts()
  const [tab, setTab] = useState('appointment');
  const {pathParam} = useParams()

  useEffect(() => {
    if(pathParam) {
      setTab(pathParam)
    }
   
}, [pathParam])



  return (
    <Layout>

      <section id="portfolio-details" className="portfolio-details mobile-portfolio-details d-xl-none ">
        <div className="container">
          <div className="row profile-section">
            <div className="card ri__us">
              <div className="card-body d-flex">
                <div className="col-9 col-md-9">

                  <div>
                    <h3 className="he-doe capitalize">Hello {userName}</h3>
                    {/* <br/> */}
                    <span className="edit-pr">
                      <Link to="/editProfile" className="edit__css"> Edit Proﬁle</Link>
                    </span>
                  </div>


                </div>

                <div className='col-3 col-md-3'>
                  <div className="profile-icons"><Link className="" href="/Profile">   {userName?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</Link></div>
                </div>
              </div>
            </div>
          </div>




        </div>
        <div className="">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  onClick={() => tab === 'appointment' ? setTab('') : setTab('appointment')}
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Appointments
                  {
                    tab === 'appointment' ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>
                  }

                </button>
              </h2>
              <div
                id="collapseOne"
                className={tab === 'appointment' ? "accordion-collapse collapse show": "accordion-collapse collapse"}
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Appointment />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  onClick={() => tab === 'family' ? setTab('') : setTab('family')}
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Family Members
                  {
                    tab === 'family' ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>
                  }
                </button>
              </h2>
              <div

                id="collapseTwo"
                className={tab === 'family' ? "accordion-collapse collapse show": "accordion-collapse collapse"}
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Family />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  onClick={() => tab === 'report' ? setTab('') : setTab('report')}
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Reports
                  {
                    tab === 'report' ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>
                  }
                </button>
              </h2>
              <div
                id="collapseThree"
                className={tab === 'report' ? "accordion-collapse collapse show": "accordion-collapse collapse"}
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Report />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfour">
                <button
                  onClick={() => tab === 'review' ? setTab('') : setTab('review')}
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefour"
                  aria-expanded="false"
                  aria-controls="collapsefour"
                >
                  Review
                  {
                    tab === 'review' ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>
                  }
                </button>
              </h2>
              <div
                id="collapsefour"
                className={tab === 'review' ? "accordion-collapse collapse show": "accordion-collapse collapse"}
                aria-labelledby="headingfour"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Review />
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSix">
                <button
                  onClick={() => tab === 'enquiry' ? setTab('') : setTab('enquiry')}
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSix"
                  aria-expanded="false"
                  aria-controls="collapseSix"
                >
                  Enquiry
                  {
                    tab === 'enquiry' ? <i class="fas fa-chevron-down"></i> : <i class="fas fa-chevron-up"></i>
                  }
                </button>
              </h2>
              <div
                id="collapseSix"
                className={tab === 'enquiry' ? "accordion-collapse collapse show": "accordion-collapse collapse"}
                aria-labelledby="headingSix"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Enquiry />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}

export default MobileProfile;
