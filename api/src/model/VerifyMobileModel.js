const mongoose = require('mongoose');
const verify_mobiles = mongoose.Schema({
   

    phone: {
        type: String,
        lowercase: true,
        default: null
    },

    userType: {
        type: String,
        lowercase: true,
        default: null
    },
   
    otp: {
        type: String,
        lowercase: true,
        default : null
    },
  
})

module.exports = mongoose.model('verify_mobiles', verify_mobiles)