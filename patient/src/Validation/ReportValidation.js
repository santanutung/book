export default function ReportValidation(values) {
    let errors = {};
  
    if (!values.file) {
      errors.file = 'Report required';
    }

    if (!values.title) {
        errors.title = 'Title required';
      } 

    // if (!values.patientId) {
    //     errors.patientId = 'Patient required';
    //   } 

  
  
   
    return errors;
  }