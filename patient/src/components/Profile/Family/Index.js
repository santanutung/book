import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosBaseUrl from '../../../axiosBaseUrl';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';
import AddModal from './AddModal';

function Family() {

  const [addFamilyModal, setAddFamilyModal] = useState(false)
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState({});
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    patientFamily()
  }, [])

  function patientFamily() {
    setLoading(true)
    axiosBaseUrl.get(`patients/api/family-member-list`)
      .then((res) => {
        console.log(res.data.data)
        setMembers(res.data.data)
        setLoading(false)


      }).catch(error => {
        console.log(error)

      })
  }

  return (
    <div
      className="tab-pane fade show active family-tab"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
    >
      <div className="row">

        {

          loading ?
            <div className='text-center'>
              <ProcessLoader />
            </div>
            :
            members.length == 0 ?

              <div className='text-center mt-5'>
                <h5 className='text-center text-theme-color'>Family Members are not available</h5>
              </div>


              :


              members.map((x, index) => {
                if (x.relation != 'self') {

                  return (
                    <div className="col-md-4 mb-3 col-6" >
                      <Link className="pposcs  mb-3"
                        to={{
                          pathname: `/editFamily`,
                          state: {
                            family: x,
                          }
                        }} >
                        <div className="card booking-l" o>
                          <div className="card-body">


                            <div className="booking-box">
                              <h3>{x.name?.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</h3>
                            </div>
                            <p className="booking-p capitalize">{x.name}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                }
              })
        }


<div className="col-md-4 mb-3 col-6" >
                      <Link className="pposcs  mb-3" to="AddFamily">
                        <div className="card1 booking-l" >
                          <div className="card-body">


                            <div className="booking-box add-more-family-icon">
                              <h3><i className="fa fa-plus" aria-hidden="true" /></h3>
                            </div>
                            <p className="booking-p capitalize">Other Patient</p>
                          </div>
                        </div>
                      </Link>
                    </div>

{/* 
        <div className="col-md-4 mb-3 col-6" >

          <Link to="/AddFamily">
            <div className="  ">
              <div className="card-body circle-sv" onClick={() => { setAddFamilyModal(true); setEditMember({}) }}>
                <div className="add-more-family">
                  <h3> <i className="fa fa-plus" aria-hidden="true" /></h3>
                </div>

                <p className="booking-p">Other Patient</p>
              </div>
            </div>
          </Link>
        </div> */}


      </div>

      <AddModal familyModal={addFamilyModal} setFamilyModal={setAddFamilyModal} patientFamily={patientFamily} editMember={editMember} />
    </div>

  );
}

export default Family;
