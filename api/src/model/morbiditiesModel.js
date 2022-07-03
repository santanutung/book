 var mongoose = require('mongoose');
//Set up default mongoose connection

const morbidities = mongoose.Schema({
    title:{
        type:String,
        required:[true,'This field is required']
    }
});


module.exports = mongoose.model('morbidities',morbidities)