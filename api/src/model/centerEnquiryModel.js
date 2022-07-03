
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const centerEnquiryScheam = new mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    message:{
        type:String
    },
    enquiryNumber:{
        type:Number
    },
    follow_up:
    [
      {
        userId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          default:null
        },
      
        message: {  
          type:String

        },
        date_time: {
          type:String
        },
      }
    ],
    status: { type: String, default :'Open' },

});
centerEnquiryScheam.plugin(AutoIncrement, {inc_field: 'enquiryNumber'});

centerEnquiryScheam.plugin(mongoosePaginate);
module.exports = mongoose.model('centerEnquirys',centerEnquiryScheam);
