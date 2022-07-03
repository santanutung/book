const mongoose = require('mongoose');
const date_slots = new mongoose.Schema({
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    date: {
        type: String,
        required:true
    },
    slot_date:{type:Date},
    slot_date_n:{type:Number},
    slot_start_time:{type:Number},
    slot_end_time:{type:Number},
    start_time: {
        type: String,
        required:true
    },
    end_time: {
        type: String,
        required:true
    },
    book_slots:{type:Number,default:0},
    total_bed:{
        type:Number
    },
    left_bed:{
        type:Number
    },
    repeat: {
        type: String,
        default:null
    },
    

   
},{timestamps:true});



module.exports = mongoose.model('date_slots',date_slots)