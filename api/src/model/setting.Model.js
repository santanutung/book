
var mongoose = require('mongoose');

const setting = mongoose.Schema({
    type:{
        type:String,
    },
     description:{
        type:String
    }

});

module.exports = mongoose.model('setting',setting);
