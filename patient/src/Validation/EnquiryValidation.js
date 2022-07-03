const EnquiryValidation =(values) => {
    let errors = {};
  
    if (!values.name.trim()) {
      errors.name = 'Name required';
    }
  
  
    if (!values.email) {
      errors.email = 'Email required';
    } 
    else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!values.subject) {
        errors.subject = 'Subject required';
      } 
    
  
      if (!values.message) {
        errors.message = 'Message required';
      } 
   
    return errors;
  }

  const authEnquiryValidation = (values) => {
    let errors = {};
  
   if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!values.subject) {
        errors.subject = 'Subject required';
      } 
    
  
      if (!values.message) {
        errors.message = 'Message required';
      } 
   
    return errors;
  }

  const CenterEnquiryValidation =(values) => {
    let errors = {};
  
    if (!values.name.trim()) {
      errors.name = 'Name required';
    }
  
  
    if (!values.email) {
      errors.email = 'Email required';
    } 
    else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!values.phone) {
      errors.phone = 'Phone required';
    } 
    if (!values.address) {
        errors.address = 'Address required';
      } 
    
  
      if (!values.message) {
        errors.message = 'Message required';
      } 
   
    return errors;
  }
  export {authEnquiryValidation, CenterEnquiryValidation}
  export default EnquiryValidation