const mongoose = require('mongoose');

const familyMamber = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    relation:{
        type:String,
        default:null
    },
    insurance_no:{
        type:String,
        default:null
     },
    name: {
        type: String,
        default:null
    },
    profile_photo_path: {
        type: String,
    },
    status: {
        type: Boolean,
        default:true
    },
    
    blood_group: {
        type: String,
        default:null,
        uppercase: true,
    },
    email: {
        type: String,
        default:null
    },


    phone: {
        type: String,
        default:null
    },

    dob: {
        type: Date,
        default:null
    },
    gender: {
        type: String,
        // enum: ['male', 'female']
    },
    dialysis_suhedule:{
        type:String,
        default:null
    },
    dis:{
        type:String,
        default:null
    },
    updated_at:{
       type:Date,
       default:null
    },

    house_no: {
        type: String,
        lowercase: true,
        default: null
    },
    street: {
        type: String,
        lowercase: true,
        default: null
    },
    area: {
        type: String,
        lowercase: true,
        default: null
    },
    city: {
        type: String,
        lowercase: true,
        default: null
    },
    state: {
        type: String,
        lowercase: true,
        default: null
    },
    pincode: {
        type: String,
        lowercase: true,
        default: null
    },

    created_at: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('familyMember',familyMamber)