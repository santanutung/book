const mongoose = require('mongoose');
let user_permissions = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    permission_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'permissions'
    },
    created_at:{
        Type:Date,
        default:Date.now()
    },
    updated_at:{
        Type:Date,
        default:Date.now()
    },
});

module.exports = mongoose.model('user_permissions',user_permissions);
