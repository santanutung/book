import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../axiosBaseUrl';
import useGlobalContexts from '../context/GlobalContext';

function EditModal(props) {
  const { setLoadingState } = useGlobalContexts()
  const { profile, setShowEditModal, getCenter, centerId } = props

  const [editData, setEditData] = useState(profile)

  const [errors, setErrors] = useState({});
  const handleEditInput = (e) => {
      const newData = { ...editData }
    //   newData[e.target.id] = e.target.value
    //   setEditData(newData)


      if (e.target.id === 'charges' || e.target.id === 'dialysis_per_month' || e.target.id === 'number_of_technician' || e.target.id === 'total_beds') {
        if (e.target.value === '' || ((/^[0-9\b]+$/.test(e.target.value)) && e.target.value.length <= 10)) {
            newData[e.target.id] = e.target.value
            setEditData(newData)
        }
    }
    else {

        newData[e.target.id] = e.target.value
        setEditData(newData)
    }



  }







  const updateCenterProfile = (e) => {
      e.preventDefault()
      console.log(editData)
      // var error_data = centerTimeValidation(slot);
      // setErrors(error_data);

      // if (Object.keys(error_data).length == 0) {
      // console.log(editData)


      Swal.fire({
          title: 'Do you want to save the changes?',
          showCancelButton: true,
          confirmButtonText: `Save`,
      }).then((result) => {
          if (result.isConfirmed) {

            setLoadingState(true)
              // alert(editData.charges)
              var data = {
                  'center_manager': editData.center_manager,
                  'total_beds': editData.total_beds,
                  'number_of_technician': editData.number_of_technician,
                  'dialysis_per_month': editData.dialysis_per_month,
                  'charges': editData.charges,
                  'doctor_availability': editData.doctor_availability,
                  'sitting_area': editData.sitting_area,
                  'availability_pharmancy': editData.availability_pharmancy,
                  'insurance_billing_facility': editData.insurance_billing_facility,
                  'life_saving_drug': editData.life_saving_drug,
               

              };
              // console.log(data)

              axiosBaseUrl.put(`admin/center-detail/${centerId}`, data)
                  .then((res) => {
                      console.log(res)
                      setLoadingState(false)
                      Swal.fire('Centre is successfully update!', '', 'success')
                      getCenter()
                      setShowEditModal(false)

                  }).catch(error => {
                      console.log(error.response)
                      if (error.response) {

                          if (error.response.status == 422) {
                              const errorData = { ...errors }
                              if (error.response.data.errors) {

                                  error.response.data.errors.map((value, index) => {
                                      console.log(error.response.data.errors)

                                      errorData[value.param] = value.msg

                                  })
                              }
                              else {
                                  errorData['error'] = error.response.data.error
                              }
                              setErrors(errorData)
                          }


                          // Swal.fire(error.response.data.errors, '', 'error')
                          // setShowEditModal(false)

                      }
                      else if (error.request) {
                          // The request was made but no response was received
                          console.log(error.request);
                      } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', error.message);
                      }
                      setLoadingState(false)
                  })


          } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
          }
      });
      // }


  }





  return (
      <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
          <div className="modal-dialog modal-lg" role="document">
              <form onSubmit={updateCenterProfile}>
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Update Profile</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">

                          <div className="form-group row">

                            
                              <div className='col-lg-12'>
                                  <div className='row'>

                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Centre managed by ( Name the Nephrologist)</lable>
                                              <input
                                                  className="form-control center_manager mt-2"
                                                  name="center_manager"
                                                  id="center_manager"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.center_manager}
                                              />
                                              <span className="form-errors">{errors.center_manager}</span>
                                          </div>

                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Number of beds in the centre</lable>
                                              <input
                                                  className="form-control total_beds mt-2"
                                                  name="total_beds"
                                                  id="total_beds"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.total_beds}
                                              />
                                              <span className="form-errors">{errors.total_beds}</span>
                                          </div>

                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Number of Technician in centre</lable>
                                              <input
                                                  className="form-control number_of_technician mt-2"
                                                  name="number_of_technician"
                                                  id="number_of_technician"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.number_of_technician}
                                              />
                                              <span className="form-errors">{errors.number_of_technician}</span>
                                          </div>
                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Number of dialysis performed in a month</lable>
                                              <input
                                                  className="form-control dialysis_per_month mt-2"
                                                  name="dialysis_per_month"
                                                  id="dialysis_per_month"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.dialysis_per_month}
                                              />
                                              <span className="form-errors">{errors.dialysis_per_month}</span>
                                          </div>
                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Charge per dialysis</lable>
                                              <input
                                                  className="form-control charges mt-2"
                                                  name="charges"
                                                  id="charges"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.charges}
                                              />
                                              <span className="form-errors">{errors.charges}</span>
                                          </div>
                                      </div>
                                      
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Doctor Availability</lable>
                                              <select
                                                  className="form-control doctor_availability mt-2"
                                                  name="doctor_availability"
                                                  id="doctor_availability"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.doctor_availability}
                                              >
                                                  <option value="No">No</option>
                                                  <option value="Yes">Yes</option>
                                              </select>
                                              <span className="form-errors">{errors.doctor_availability}</span>
                                          </div>

                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Availability of sitting area for family members.</lable>
                                              <select
                                                  className="form-control sitting_area mt-2"
                                                  name="sitting_area"
                                                  id="sitting_area"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.sitting_area}
                                              >
                                                  <option value="No">No</option>
                                                  <option value="Yes">Yes</option>
                                              </select>
                                              <span className="form-errors">{errors.sitting_area}</span>
                                          </div>


                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Availability of Pharmacy nearby.</lable>
                                              <select
                                                  className="form-control availability_pharmancy mt-2"
                                                  name="availability_pharmancy"
                                                  id="availability_pharmancy"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.availability_pharmancy}
                                              >
                                                  <option value="No">No</option>
                                                  <option value="Yes">Yes</option>
                                              </select>
                                              <span className="form-errors">{errors.availability_pharmancy}</span>
                                          </div>
                                      </div>
                                      <div className='col-lg-4'>
                                          <div className="form-group">
                                              <lable className="mb-2p">Whether the centre has an insurance billing facility or not.</lable>
                                              <select
                                                  className="form-control insurance_billing_facility mt-2"
                                                  name="insurance_billing_facility"
                                                  id="insurance_billing_facility"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.insurance_billing_facility}
                                              >
                                                  <option value="No">No</option>
                                                  <option value="Yes">Yes</option>
                                              </select>
                                              <span className="form-errors">{errors.insurance_billing_facility}</span>
                                          </div>
                                      </div>
                                      <div className='col-lg-4'>


                                          <div className="form-group">
                                              <lable className="mb-2p">Availability of life-saving drugs.</lable>
                                              <select
                                                  className="form-control life_saving_drug mt-2"
                                                  name="life_saving_drug"
                                                  id="life_saving_drug"
                                                  onChange={(e) => handleEditInput(e)}
                                                  value={editData.life_saving_drug}
                                              >
                                                  <option value="No">No</option>
                                                  <option value="Yes">Yes</option>
                                              </select>
                                              <span className="form-errors">{errors.life_saving_drug}</span>
                                          </div>

                                      </div>
                                     



                                  </div>
                              </div>

                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowEditModal(false)}>Close</button>
                          <button type="submit" className="btn btn-primary">Save changes</button>
                      </div>

                  </div>
              </form>
          </div>
      </div>
  )
}

export default EditModal;
