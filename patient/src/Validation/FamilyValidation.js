import moment from 'moment-timezone';
export default function FamilyValidation(values) {
  let errors = {};

  if (!values.relation) {
    errors.relation = 'Relation required';
  }

  if (!values.gender) {
    errors.gender = 'Gender required';
  }


  if (!values.name) {
    errors.name = 'Name required';
  }

  if (!values.blood_group) {
    errors.blood_group = 'Blood Group required';
  }
  

  // if (!values.dob) {
  //   errors.dob = 'DOB required';
  // }
  // else if (moment(values.dob, 'YYYY-MM-DD') > moment()) {
  //   errors.dob = 'Invalid DOB';
  // }

  if (!values.phone) {
    errors.phone = 'Phone is required';
  } 
  else if(values.phone.length != 10) {
    errors.phone = 'Phone Number is invalid';
  }


  if (!values.email) {
    errors.email = 'Email is required';
  } 
  
  else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }



  return errors;
}