const mongoose = require('mongoose');

const patients = mongoose.Schema({
    name: {
        type: String,
    },
    profile_photo_path: {
        type: String,
    },
    status: {
        type: Boolean
    },
    
    blood_group: {
        type: String
    },

    phone: {
        type: String
    },

    dob: {
        type: Date
    },
    gender: {
        type: String,
        // enum: ['male', 'female']
    },
    updated_at:{
       type:Date,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('patients',patients)