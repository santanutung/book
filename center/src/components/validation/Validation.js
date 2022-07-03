import moment from "moment-timezone";

//slot validation
  function centerTimeValidation(values) {
    let errors = {};
  
    if (!values.day) {
      errors.day = 'Day is required';
    }

    if (!values.opening_time) {
      errors.opening_time = 'Opening Time is required';
    }

    if (!values.closing_time) {
      errors.closing_time = 'Closing Time is required';
    }

    if(values.closing_time && values.start_time && parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss')) < parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss'))) {
      errors.closing_time = 'Opening time should be less then closing time';
    }
    return errors;
  }


  //slot validation
  function centerSlotValidation(values) {
    let errors = {};
  
    // if (!values.day) {
    //   errors.day = 'Day is required';
    // }

    if (!values.start_time) {
      errors.start_time = 'Start Time is required';
    }

    if (!values.end_time) {
      errors.end_time = 'End Time is required';
    }
    return errors;
  }

  function centerDateSlotValidation(values) {
    let errors = {};
  
    // if (!values.date) {
    //   errors.date = 'Date is required';
    // }

    if (!values.start_time) {
      errors.start_time = 'Start Time is required';
    }

    if (!values.end_time) {
      errors.end_time = 'End Time is required';
    }
    if(values.end_time && values.start_time && parseInt(moment(values.end_time, 'h:mm a').format('Hmmss')) < parseInt(moment(values.start_time, 'h:mm a').format('Hmmss'))) {
      errors.end_time = 'Start time should be less then end time';
    }
    return errors;
  }

  function bookAppointmentValidation(values)
  {
    let errors = {};
  
    // if (!values.date) {
    //   errors.date = 'Date is required';
    // }

    // if (!values.slot) {
    //   errors.slot = 'Slot is required';
    // }


    // if (!values.mobile) {
    //   errors.mobile = 'Mobile number is required';
    // }

    if (!values.name) {
      errors.name = 'Name is required';
    }
    return errors;
  }

  const enquiryValidation = (values) => {
    let errors = {};
  
    
    // if (!values.subject) {
    //     errors.subject = 'Subject required';
    //   } 
    
  
      if (!values.message) {
        errors.message = 'Message required';
      } 
   
    return errors;
  }

  export {centerSlotValidation, bookAppointmentValidation, centerDateSlotValidation, enquiryValidation}
  export default centerTimeValidation