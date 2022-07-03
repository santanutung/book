
const mongoose = require('mongoose');
// id, center_id, day, opening_time, closing_time, status, created_at, updated_at, deleted_at
const center_time   = mongoose.Schema({
    center_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    day:{
        type:String
    },
    opening_time:{
        type:String
    },
    closing_time:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
    create_at:{
     type:Date,
     default:Date.now()
    },
    updated_at:{
        type:Date
    },
    deleted_at:{
        type:Date
    }
});


module.exports = mongoose.model('center_times',center_time)