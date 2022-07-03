const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const user = mongoose.Schema({
    name: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
    },
    email_verified_at: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        lowercase: true,
    },
    insurance_no: {
        type: String,
        default: null
    },
    profile_photo_path: {
        type: String,
        lowercase: true,
    },
    status: {
        type: String,
        lowercase: true,
        default: "active"
    },

    blood_group: {
        type: String,
        uppercase: true,
        default: null
    },

    phone: {
        type: String,
        lowercase: true,
        default: null
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

    dob: {
        type: Date,
        default: null
    },
    wallet_amount: {
        type: String,
        default: '0'
    },
    gender: {
        type: String,
        lowercase: true,
        default: null
        // enum: ['male', 'female']
    },
    center_id: {
        type: String,

    },
    tc: {
        type: Boolean,
        default: false

    },

    user_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',

    },
    UserType: {
        type: String,
        // enum:['center','employee','patients','superAdmin'],
        default: 'superAdmin',
        lowercase: true,
    },
    testimonialExist: {
        type: Boolean,
        default: false,
    },
    updated_at: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    otp: {
        type: String,
        lowercase: true,
        default: null
    },
    fcm_token: [{

        token: {

            type: String,
            default: null
        }
    }],

    registeration_no: Number,
})

user.plugin(AutoIncrement, { inc_field: 'registeration_no' });
module.exports = mongoose.model('users', user)