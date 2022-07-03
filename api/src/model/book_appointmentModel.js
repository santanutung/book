
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const book_appointment = new mongoose.Schema({
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    slot_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'date_slots',
    },
    bookBy:{
       type:String
    },
    apt_date : {
        type : Number
    },
    date: {
        type: String,
    },
    appointment_start_time: {
        type: String,
    },
    appointment_end_time: {
        type: String,
    },
    apt_start_time: {
        type: Number,
    },
    apt_end_time: {
        type: Number,
    },

    charges: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    patient_familyMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'familyMember',
    },
    booked_by:{type:String},
    appointment_id:{type:Number},
    appointment_key:{type:Number},
    payment_status: {
        type: String,
        default: "pending"
    },
    payment_type: {
        type: String,
        default: "cash" // cod, online
    },
    appointment_status: {
        type: String,
        default: "pending"
    },
    commission: {
        type: String,
        default: "0"
    },
    before_weight: {
        type: String
    },
    after_weight: {
        type: String
    },

    cretenine: {
        type: String
    },

    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: Date,
    },
    reports:[
        {
            reportId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'patients_reports',
            }
        }
    ]
});


book_appointment.plugin(AutoIncrement, {inc_field: 'appointment_key'});
book_appointment.plugin(mongoosePaginate)
module.exports = mongoose.model('book_appointment',book_appointment)
