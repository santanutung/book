import moment from 'moment-timezone';
export default function EditProfileValidation(values) {
    let errors = {};
    if (!values.name) {
        errors.name = 'Name is required';
    }

    if (!values.email) {
        errors.email = 'Email is required';
    }
    else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }


    if (!values.gender) {
        errors.gender = 'Gender is required';
    }
    if (!values.phone) {
        errors.phone = 'Phone No. is required';
    }
    if ((values.phone).length  !== 10) {
        errors.phone = 'Phone No. is invalid';
    }




    if (!values.blood_group) {
        errors.blood_group = 'Blood Group is required';
    }

    // if (!values.pincode) {
    //     errors.pincode = 'Pincode is required';
    // }
    if (values.pincode && (values.pincode).length !== 6) {
        errors.pincode = 'Pincode is invalid';
    }

    // if (!values.dob) {
    //     errors.dob = 'DOB  isrequired';
    // }
    // else if(moment(values.dob, 'YYYY-MM-DD') > moment()){
    //     errors.dob = 'Invalid DOB';
    //   }
    

    // if (!values.house_no) {
    //     errors.house_no = 'House No. is required';
    // }

    // if (!values.area) {
    //     errors.area = 'Area is required';
    // }

    // if (!values.state) {
    //     errors.state = 'State is required';
    // }
    // if (!values.city) {
    //     errors.city = 'City is required';
    // }



    return errors;
}