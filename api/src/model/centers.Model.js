var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const center = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        default: null


    },
    email: {
        type: String,
        lowercase: true,
        default: null
    },
    contact_no: {
        type: String,
        lowercase: true,
        default: null

    },
    addition_contact_no: {
        type: String,
        lowercase: true,
        default: null

    },
    center_manager: {
        type: String,
        lowercase: true,
    },
    address: {
        type: String,
        lowercase: true,
        default: null

    },
    area:{ type: String,default: null},
    contact_no: {
        type: String,
        lowercase: true,
        default: null
    },
    state: {
        type: String,
        lowercase: true,
        default: null

    },
    city: {
        type: String,
        lowercase: true,
        default: null
    },
    pincode: {
        type: String,
        lowercase: true,
        default: null
    },
    latitude: {
        type: String,
        lowercase: true,
        default: null
    },
    longitude: {
        type: String,
        lowercase: true,
        default: null
    },
    location: {
        type: { type: String ,default:"Point"},
        coordinates: [Number],
      },
    total_beds: {
        type: String,
        lowercase: true,
        default: null

    },
    opening_time: {
        type: String,
        default: null

    },
    closing_time: {
        type: String,
        default: null

    },
    commission: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
    },
    introduction: {
        type: String,
        // lowercase: true,
        default: null
    },
    login_id: {
        type: String,
    },
    charges: {
        type: Number,
        // lowercase: true,
        default: null
    },
    verify_status: {
        type: String,
        lowercase: true,
        default: null,
        default: 'pending'
    },
    primaryImage: {
        type: String
    },
    status: {
        type: String,
        lowercase: true,
        default: null,
        default: 'active'
    },
    times: [
        {
            day: {
                type: String,

            },
            opening_time: {
                type: String,

            },
            closing_time: {
                type: String,

            },
            status: {
                type: Number,
                default: 0
            },
        }
    ],
    images: [
        {
            image: {
                type: String
            },
            is_primary: {
                type: Number
            },

        },
       
    ],
    number_of_technician: {
        type: String,
        default: ''
    },
    doctor_availability: {
        type: String,
        default: ''
    },
    sitting_area: {
        type: String,
        default: ''
    },
    availability_pharmancy: {
        type: String,
        default: ''

    },
    life_saving_drug: {
        type: String,
        default: ''
    },
    dialysis_per_month: {
        type: String,
        default: ''
    },
    insurance_billing_facility: {
        type: String,
        default: ''
    },
    cleanliness_rating: { type: String,default:"0" },
    hygiene_rating: { type: String,default:"0" },
    service_rating: { type: String ,default:"0"},
    rating: { type: String ,default:"0"},
   

});

center.index({location: '2dsphere' })
// center.()
center.index({name:'text',center_manager:'text',address:'text',area:'text',city:'text'})
center.plugin(aggregatePaginate);

module.exports = mongoose.model('centers', center)