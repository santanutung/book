

const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const moment = require('moment')
const transaction = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'book_appointments',
    
    },
    type:{
        type:String
    },
    amount:{
        type:String
    },
    operation:{
        type:String
    },
    order_id:{
        type:String,

    },
    transaction_id:{
       type:String
    },
    dateTime:{
        type:String
     },

    updated_at:{
       type:Date,
    },
    created_at: {
        type: String,
        default: moment().format('DD-MM-YYYY h:mm a')
    },
})
transaction.plugin(mongoosePaginate)
module.exports = mongoose.model('transactions',transaction)
