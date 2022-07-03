import React, { useState, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import useGlobalContexts from '../../context/GlobalState';

import { useDropzone } from 'react-dropzone'


function EditProfileModal(props) {
    const { setLoaderState } = useGlobalContexts()
    const { profile, setShowEditModal, getCenter } = props

    const [editData, setEditData] = useState(profile)

    const [errors, setErrors] = useState({});
    const handleEditInput = (e) => {
        const newData = { ...editData }

        if (e.target.id === 'charges' || e.target.id === 'dialysis_per_month' || e.target.id === 'number_of_technician'  || e.target.id === 'total_beds') {
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


    useEffect(() => {
        // console.log(profile, "----------------------------")
        // const newData = [];
        // newData['center_manager'] = profile.center_manager
        // newData['total_beds'] = profile.total_beds

        // // if (profile.number_of_technician === '') {
        // //     profile.number_of_technician = 'No';
        // // }

        // newData['number_of_technician'] = profile.number_of_technician
        // newData['dialysis_per_month'] = profile.dialysis_per_month
        // newData['charges'] = profile.charges
        // // if (profile.doctor_availability === '') {
        // //     profile.doctor_availability = 'No';
        // // }
        // newData['doctor_availability'] = profile.doctor_availability
        // // if (profile.sitting_area === '') {
        // //     profile.sitting_area = 'No';
        // // }

        // newData['sitting_area'] = profile.sitting_area
        // // if (profile.availability_pharmancy === '') {
        // //     profile.availability_pharmancy = 'No';

        // // }

        // newData['availability_pharmancy'] = profile.availability_pharmancy
        // // if (profile.insurance_billing_facility === '') {
        // //     profile.insurance_billing_facility = 'No';
        // // }
        // newData['insurance_billing_facility'] = profile.insurance_billing_facility
        // // if (profile.life_saving_drug === '') {
        // //     profile.life_saving_drug = 'No';
        // // }
        // newData['life_saving_drug'] = profile.life_saving_drug
        // console.log(newData)
        // setEditData(newData)

    }, [])


    function handleFile(e) {

        // let file = e.target.files[0]
        // setFile(file)

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            const newData = { ...editData }
            newData['image'] = reader.result
            setEditData(newData)
            console.log(reader.result);//base64encoded string
        };


    }




    const updateCenterProfile = (e) => {
        e.preventDefault()
        // console.log(editData)
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

                setLoaderState(true)
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
                    'image': editData.image,
                    'introduction': editData.introduction

                };
                // console.log(data)

                axiosBaseUrl.post(`private/center/profile-update`, data)
                    .then((res) => {
                        // console.log(res)
                        setLoaderState(false)
                        Swal.fire('Centre is successfully update!', '', 'success')
                        getCenter()
                        setShowEditModal(false)

                    }).catch(error => {
                        // console.log(error.response)
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
                        setLoaderState(false)
                    })


            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
        // }


    }


    function handleIntroduction(intro) {
        const newData = { ...editData }
        newData['introduction'] = intro
        setEditData(newData)
    }


    const onDrop = useCallback(acceptedFiles => {
        // console.log(acceptedFiles[0])

        var reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);

        reader.onload = function () {
            const newData = { ...editData }
            newData['image'] = reader.result
            setEditData(newData)
            console.log(reader.result);//base64encoded string
        };


        // alert(acceptedFiles[0].name)
        // console.log("Now you can do anything with"+
        //             " this file as per your requirement")
    }, [])

    const { getInputProps, getRootProps } = useDropzone({ onDrop })


    return (
        <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
            <div className="modal-dialog modal-xl" role="document">
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

                                {/* <div className="col-lg-4">
                                    <div class="box"> */}
                                        {/* <div className='relative' style={{ display: 'block', padding: 30, height: '100%', backgroundImage: `url(${editData.image})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}>
                                            <div className='dropify' {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <h4>Upload Image</h4>

                                            </div>
                                        </div> */}

                                        {/* <div class="js--image-preview" style={{ backgroundImage: `url(${editData.image ? editData.image : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"})` }}>
                                            </div>
                                        <div class="upload-options">
                                            <label>
                                                <input type="file" class="image-upload"   name="image" accept="image/*" onChange={(e) => handleFile(e)} />
                                            </label>
                                        </div> */}
                                    {/* </div> */}
                                    {/* <input
                                                type="file"
                                                id="contact_no"
                                                onChange={(e) => handleFile(e)}
                                                name="image"
                                            /> */}
                                    {/* <span className="form-errors">{errors.image}</span>
                                </div> */}
                                <div className='col-lg-12'>
                                    <div className='row'>

                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <lable className="mb-2p">Centre managed by ( Name the Nephrologist)</lable>
                                                <input
                                                    className="form-control center_manager"
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
                                                    className="form-control total_beds"
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
                                                    className="form-control number_of_technician"
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
                                                    className="form-control dialysis_per_month"
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
                                                    className="form-control charges"
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
                                                    className="form-control doctor_availability"
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
                                                    className="form-control sitting_area"
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
                                                    className="form-control availability_pharmancy"
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
                                                    className="form-control insurance_billing_facility"
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
                                                    className="form-control life_saving_drug"
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
                                        <div className='col-md-12'>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editData.introduction}
                                    onChange={(event, editor) => {
                                        handleIntroduction(editor.getData())
                                    }}

                                />

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

export default EditProfileModal
