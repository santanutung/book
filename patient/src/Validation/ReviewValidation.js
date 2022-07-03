export default function ReviewValidation(values) {
    let errors = {};
  
    if (!values.review) {
      errors.review = 'Review is required required';
    }

    if (!values.cleanliness_rating) {
        errors.cleanliness_rating = 'Cleanliness rating required';
      } 
      if (!values.service_rating) {
        errors.service_rating = 'Service rating required';
      } 
      if (!values.hygiene_rating) {
        errors.hygiene_rating = 'Hygiene rating required';
      } 
  
  
   
    return errors;
  }