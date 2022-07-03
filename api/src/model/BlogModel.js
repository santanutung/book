
var mongoose = require('mongoose');
//Set up default mongoose connection

const blogs = mongoose.Schema({
    title:{
        type:String,
    },
    image:{
        type:String
    },
   
    short_description:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        default:'disabled'
    },
   
   

})


module.exports = mongoose.model('blogs',blogs)