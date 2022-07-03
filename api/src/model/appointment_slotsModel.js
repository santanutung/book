const mongoose = require('mongoose');

const appointment_slots = mongoose.Schema({
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    day: {
        type: String,
        required:true
    },
    total_beds:{type:String},
    start_time: {
        type: String,
        required:true
    },
    end_time: {
        type: String,
        required:true
    },
    created_at: {
        type: String,
        default: Date.now()
    },
    updated_at: {
        type: Date,
    },

});
module.exports = mongoose.model('center_appointment_slots', appointment_slots);