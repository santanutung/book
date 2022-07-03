import moment from 'moment-timezone';
 function RegisterValidation(values) {
    let errors = {};
  
    if (!values.password.trim()) {
      errors.password = 'Password is required';
    }
    else if(values.password.length < 6 || values.password.length >50) {
      errors.password = 'Password must be contain atleast 6 character';
    }
  
  
    if (!values.email) {
      errors.email = 'Email is required';
    } 
    
    else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.name) {
        errors.name = 'Name is required';
      } 

    if (!values.phone) {
        errors.phone = 'Phone is required';
      } 
      else if(values.phone.length != 10) {
        errors.phone = 'Phone Number is invalid';
      }

    if (!values.dob) {
        errors.dob = 'DOB is required';
      } 
      else if(moment(values.dob, 'YYYY-MM-DD') > moment()){
        errors.dob = 'Invalid DOB';
      }
    

    if (!values.confirm_password) {
        errors.confirm_password = 'Confirm Password  isrequired';
      } 

      else if(values.confirm_password != values.password) {
        errors.confirm_password = 'Password are not matched';
      }
      if (!values.tc || values.tc == false) {
        errors.tc = 'Please Approve Term and conditions';
      } 
      
  
  
   
    return errors;
  }

  function RegisterOTPValidation(values) {
    let errors = {};
    if (!values.otp.trim()) {
      errors.otp = 'OTP is required';
    }
    if (!values.password.trim()) {
      errors.password = 'Password is required';
    }
  
  
    if (!values.email) {
      errors.email = 'Email is required';
    } 
    
    else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.name) {
        errors.name = 'Name is required';
      } 

    if (!values.phone) {
        errors.phone = 'Phone is required';
      } 
      else if(values.phone.length != 10) {
        errors.phone = 'Phone Number is invalid';
      }

    if (!values.dob) {
        errors.dob = 'DOB is required';
      } 
      else if(moment(values.dob, 'YYYY-MM-DD') > moment()){
        errors.dob = 'Invalid DOB';
      }
    

    if (!values.confirm_password) {
        errors.confirm_password = 'Confirm Password  isrequired';
      } 

      else if(values.confirm_password != values.password) {
        errors.confirm_password = 'Password are not matched';
      }
      if (!values.tc || values.tc == false) {
        errors.tc = 'Please Approve Term and conditions';
      } 
      
  
  
   
    return errors;
  }
export {RegisterOTPValidation}
  export default RegisterValidation