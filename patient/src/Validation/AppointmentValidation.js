export default function AppointmentValidation(values) {
    let errors = {};
  
    if (!values.name.trim()) {
      errors.name = 'Name required';
    }
  
  
    if (!values.relation) {
      errors.relation = 'Relation required';
    } 
   
    
    if (!values.blood_group) {
        errors.blood_group = 'Blood Group required';
      } 
    
  
    
    return errors;
  }