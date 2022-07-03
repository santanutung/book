var mongoose = require('mongoose');

const centerChat = mongoose.Schema({
    message: {
        type: String,
        lowercase: true,
        default: null
    },
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    sender  : {
        type:String,
        default:"admin"
    },
    isRead : {
        type:Boolean,
        default:false
    },

}, { timestamps: true });

module.exports = mongoose.model('centerChats', centerChat)