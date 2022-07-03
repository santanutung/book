const mongoose = require('mongoose');
const center_image = mongoose.Schema({
    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
    },
    image: {
        type:String
    },
    is_primary: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
    },

});

module.exports = mongoose.model('center_images', center_image)
