const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const enquire = new mongoose.Schema({
  enquiry_no:{Number},
  name: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true, lowercase: true },
  date: {
    type: String,
    default: new Date().toISOString().slice(0, 10)
  },
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default:null
  },
  centerId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'centers',
    default:null
  },
  userType: {
    type:String,
    default:'user'
  },
  message: { type: String, lowercase: true, lowercase: true },
  // follow_up: { type: String, default:null},
  follow_up:
    [
      {
        userId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          default:null
        },
        centerId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'centers',
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


}, { timestamps: true });
enquire.plugin(AutoIncrement, {inc_field: 'enquiry_no'});

enquire.plugin(mongoosePaginate);

module.exports = mongoose.model('enquire', enquire)