import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import blood_group, { relations } from '../../../rawData/DataSet';
import FamilyValidation from '../../../Validation/FamilyValidation';
import Add from './Add';

function AddModal(props) {
    const { familyModal, setFamilyModal, patientFamily, editMember } = props
    const [addData, setAddData] = useState({ name: '', blood_group: '', relation: '', dob: '', gender: '' });
    const [familyError, setFamilyError] = useState({});

    function editProfileHandler(e) {
        const newData = { ...addData }
        newData[e.target.name] = e.target.value
        setAddData(newData)
    }

    useEffect(() => {
     
      if(editMember._id) {
          setAddData({ name: editMember.name, blood_group: editMember.blood_group, relation: editMember.relation, dob: editMember.dob, gender: editMember.gender, insurance_no:editMember.insurance_no })
      }
      else {
          
          setAddData({ name: '', blood_group: '', relation: '', dob: '', gender: '' })
      }
    }, [familyModal]);
    

    function handleEditFile(e) {

        const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            setFamilyError({ 'image': 'Image size should be maximum 2 MB' });
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function () {
                const newData = { ...addData }
                newData['profile_photo_path'] = reader.result
                setAddData(newData)
                console.log(reader.result);//base64encoded string
            };
        }


    }

    const familyFormHandler = (e) => {

        if(editMember._id) {
            edit(e)
        }
        else {
            add(e)
        }


    }

    const add = (e) => {
        var error_data = FamilyValidation(addData);
        setFamilyError(error_data);
        console.log(error_data);
        if (Object.keys(error_data).length == 0) {

            axiosBaseUrl.post(`patients/api/add-family`, addData)
                .then((res) => {
                    // alert("estt")
                    console.log(res)
                    if (res.status == 200) {
                        patientFamily()
                        Swal.fire('', 'Details is successfully add', 'success')
                        setFamilyModal("")

                    }


                }).catch(error => {
                    console.log(error.response)
                    // alert("none done")
                    if (error.response) {
                        if (error.response.status == 422) {
                            const errorData = { ...familyError }
                            error.response.data.errors.map((value, index) => {
                                console.log(value);

                                errorData[value.param] = value.msg

                            })
                            setFamilyError(errorData)
                        }
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


    const edit = (e) => {

            var error_data = FamilyValidation(addData);
            setFamilyError(error_data);
            console.log(error_data);
            if (Object.keys(error_data).length === 0) {
    
                axiosBaseUrl.put(`patients/api/edit-family/${editMember._id}`, addData)
                    .then((res) => {
                        // alert("estt")
                        console.log(res)
                        if (res.status === 200) {
                            patientFamily()
                            Swal.fire('', 'Details is successfully updated', 'success')
                            setFamilyModal("")
    
                        }
    
    
                    }).catch(error => {
                        console.log(error.response)
                        // alert("none done")
                        if (error.response) {
                            if (error.response.status === 422) {
    
                                const errorData = {}
                                error.response.data.errors.errors.map((value, index) => {
                                    errorData[value.param] = value.msg
    
                                })
                                setFamilyError(errorData)
                            }
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

    function reset() {
        setFamilyModal(false);
         setFamilyError({})
         setAddData({ name: '', blood_group: '', relation: '', dob: '', gender: '' })
    }

    return (

        <>
            <Modal 
            
            dialogClassName="w-90"
            show={familyModal} onHide={() =>{ reset()}}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Add />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group log-f">


                                <label htmlFor="photo-upload1" className="custom-file-upload fas">
                                    <div className="img-wrap img-upload" >
                                        {
                                            addData.profile_photo_path ?
                                                <img for="photo-upload" src={addData.profile_photo_path} width="100%" height="100%" />
                                                :
                                                <img for="photo-upload" src={'img/file.png'} width="100%" height="100%" />
                                        }

                                    </div>
                                    <input id="photo-upload1" accept="image/*" type="file" onChange={(e) => handleEditFile(e)} />
                                </label>
                            </div>
                            <span className='text-danger'>{familyError.image}</span>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="name"
                                    placeholder="Full Name*"
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={addData.name}
                                />
                                <span className='text-danger'>{familyError.name}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <select

                                    className="form-control"
                                    name="relation"
                                    id="relation"
                                    placeholder="Relation"
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={addData.relation}
                                >
                                    <option>Select Relation</option>
                                    {
                                        relations.map((relation, index) => {
                                            return (
                                                <option value={relation}>{relation}</option>
                                            )
                                        })
                                    }
                                </select>
                                <span className='text-danger'>{familyError.relation}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <select
                                    type="text"
                                    className="form-control"
                                    name="blood_group"
                                    id="blood_group"
                                    placeholder="Blood Group*"
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={addData.blood_group}
                                >
                                    <option>Select Blood Group</option>
                                    {blood_group.map((x, index) => {
                                        return (
                                            <option value={x}>{x}</option>
                                        )
                                    })}
                                </select>
                                <span className='text-danger'>{familyError.blood_group}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="date"
                                    placeholder="MM | DD | YYY"
                                    className="form-control"
                                    name="dob"
                                    id="date"
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={addData.dob}
                                    max={moment().format('YYYY-MM-DD')}
                                />
                                <span className='text-danger'>{familyError.dob}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group log-f">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="insurance_no"
                                    id="insurance_no"
                                    placeholder="Insurance No."
                                    required
                                    onChange={(e) => editProfileHandler(e)}
                                    value={addData.insurance_no}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className={addData.gender == 'male' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="male" name="gender" onClick={(e) => editProfileHandler(e)}>Male</button>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className={addData.gender == 'female' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="female" name="gender" onClick={(e) => editProfileHandler(e)}>Female</button>
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-3 mt-1">
                            <div className={addData.gender == 'prefer not to say' ? "gender-k" : 'gender-g'}>
                                <button className="btn btn-g" type="button" value="prefer not to say" name="gender" onClick={(e) => editProfileHandler(e)}>Prefer not to say</button>
                            </div>
                        </div>
                        <span className='text-danger'>{familyError.gender}</span>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => {reset()}}
                    >
                        Cancel
                    </button>
                    <button type="button" onClick={familyFormHandler} className="btn btn-primary">
                        Save &amp; Proceed
                    </button>
                </Modal.Footer>
            </Modal>


        </>


    )
}

export default AddModal;
