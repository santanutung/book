const mongoose = require('mongoose');


const centerDocuments = mongoose.Schema({
    centerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'centers'
    },
    document_typeId:{
        type:String
        // type:mongoose.Schema.Types.ObjectId,
        // ref: 'document_category'
    },
    uploaded_type:{
        type:String
    },
    document:{
        type:String
    },
 
},{ timestamps: true });


module.exports = mongoose.model('center_documents',centerDocuments)