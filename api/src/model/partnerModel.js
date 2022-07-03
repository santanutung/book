const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const partner = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    active:{type:Boolean,default:true}
},{ timestamps: true });
partner.plugin(mongoosePaginate);
module.exports = mongoose.model('partner',partner)