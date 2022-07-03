const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const notifications = new mongoose.Schema({
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    date: {
        type: String,
        // required:true
    },
    message:{type:String},
    isRead : {
        type:Boolean,
        default:false
    },
    type : {
        type : String,

    },
    module : {
        type : String,

    }
   
},{timestamps:true});
notifications.plugin(mongoosePaginate);


module.exports = mongoose.model('notifications',notifications)