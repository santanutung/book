export default function LoginValidation(values) {
    let errors = {};
  
    if (!values.password.trim()) {
      errors.password = 'Password required';
    }
  
  
    if (!values.email) {
      errors.email = 'Email required';
    } 
    
    // else if (!/\S+@\S+\.\S+/.test(values.email)) {
    //   errors.email = 'Email address is invalid';
    // }
    
  
  
   
    return errors;
  }