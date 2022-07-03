const mongoose = require('mongoose');

let permissions = mongoose.Schema({
    // id, name, guard_name, menu_id, created_at, updated_at
    title:{
        type:String
        
    },
    model_name:{type:String},
    method:{
        type:String
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated:{
        type:Date
    }
});
// title:"view_"+name[i].name,
// model_name:name[i].name,
// method:'GET',

module.exports = mongoose.model('permissions',permissions)