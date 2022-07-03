
var mongoose = require('mongoose');
//Set up default mongoose connection

const activeLog = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    action_time:{
        type:Date
    },
    model_name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:['users','centers','user_permissions']
    },
    model_colum:{
        type:String
    },
    old_action:{
        type:String,

    },
    change_action:{
       type:String
    }

})