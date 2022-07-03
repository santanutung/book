const mongoose = require('mongoose');

let logger = mongoose.Schema({
    userId:{
        type:String
    },
    active:{
        type:String
    },
    old_data:{
        type:String
    },
    new_data:{
        type:String
    },
    create_at:{
        type:String,
        default:Date.now()
    },

});

module.exports = mongoose.model('loggers',logger)
