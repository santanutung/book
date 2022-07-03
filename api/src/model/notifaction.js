
var mongoose = require('mongoose');
//Set up default mongoose connection
const notifations = mongoose.Schema({
    from_user:{type:String}, 
    to_user:{type:String},
    message:{type:String},
    type:{
        type:String
    },
})
