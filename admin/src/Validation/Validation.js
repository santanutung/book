import moment from "moment";

function Validation(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'Name required';
  }

  
  // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
  //   errors.name = 'Enter a valid name';
  // }

  if (!values.email) {
    errors.email = 'Email required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.contact_no) {
    errors.contact_no = 'Contact Number is required';
  }
  else if (values.contact_no.length != 10) {
    errors.contact_no = 'Contact Number is invalid';
  }

  if (!values.total_beds) {
    errors.total_beds = 'Total beds is required';
  }
  // else if(Number.isInteger(values.total_beds) == false) {
  //   errors.total_beds = 'Total beds should be number';

  // }
  else if (values.total_beds < 1) {
    errors.total_beds = 'Total beds should be atleast 1';
  }
  if (!values.address) {
    errors.address = 'Address is required';
  }

  if (!values.area) {
    errors.area = 'Area is required';
  }

  if (!values.city) {
    errors.city = 'City is required';
  }
  if (!values.state) {
    errors.state = 'State is required';
  }
  if (!values.pincode) {
    errors.pincode = 'Pincode is required';
  }
  else if (values.pincode && (values.pincode).length !== 6) {
    errors.pincode = 'Pincode is invalid';
}
  if (!values.latitude) {
    errors.latitude = 'Latitude is required';
  }
  else {
    let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
    if (!pattern.test(values.latitude)) {
      errors.latitude = 'Latitude is invalid';
    }
    // return pattern.test(lat) && pattern.test(lng);
  }
  if (!values.longitude) {
    errors.longitude = 'Longitude is required';
  }
  else {
    let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
    if (!pattern.test(values.longitude)) {
      errors.longitude = 'Longitude is invalid';
    }
  }
  if (!values.commission) {
    errors.commission = 'Commission is required';
  }
  else if (values.commission < 0 || values.commission > 100) {
    errors.commission = 'Commission should be between 0 to 100';
  }

  // if (!values.opening_time) {
  //   errors.opening_time = 'Opening Time is required';
  // }

  // if (!values.closing_time) {
  //   errors.closing_time = 'Closing Time is required';
  // }
  // if(values.closing_time && values.opening_time && parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss')) < parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss'))) {
  //   errors.closing_time = 'Opening time should be less then closing time';
  // }

  // else if (!/^\d*\.?\d*$/.test(values.email)) {
  //   errors.email = 'Email address is invalid';
  // }
  // else if(typeof parseInt(values.commission) == 'number') {
  //   errors.commission = 'Commission should be number';

  // }
  // errors.commission = 'Commission should be number'+typeof  parseInt(values.commission);

  // if (!values.status) {
  //     errors.status = 'Status is required';
  // } 

  return errors;
}

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
  if(values.closing_time && values.opening_time && parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss')) < parseInt(moment(values.opening_time, 'h:mm a').format('Hmmss'))) {
    errors.closing_time = 'Opening time should be less then closing time';
  }
  return errors;
}


//add employee validation
function employeeValidation(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  }

  if (!values.contact_no) {
    errors.contact_no = 'Contact No. is required';
  }
  return errors;
}

//slot validation
function centerSlotValidation(values) {
  let errors = {};

  if (!values.total_beds) {
    errors.total_beds = 'Total Beds is required';
  }

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

  if (!values.date) {
    errors.date = 'Date is required';
  }

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


function addBlogValidation(values) {
  let errors = {};
  console.log(">>>>>",values);
  if (!values.title) {
    errors.title = 'Tile is required';
  }

  if (!values.short_description) {
    errors.short_description = 'Short Description is required';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  }

  return errors;
}

export { centerTimeValidation, employeeValidation, centerSlotValidation, centerDateSlotValidation ,addBlogValidation}
export default Validation