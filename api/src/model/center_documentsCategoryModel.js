
var mongoose = require('mongoose');
//Set up default mongoose connection
const document_category = mongoose.Schema({
    title:{
        type:String,
    },
    isRemoved:{
        type:Boolean,
        default:true
    },
    // document:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: 'center_documents'
    // }],
},{ timestamps: true });


module.exports = mongoose.model('document_category',document_category)