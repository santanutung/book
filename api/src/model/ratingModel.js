const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const rating = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    center_id: { type: mongoose.Schema.Types.ObjectId, ref: "centers" },
    review: { type: String },
    cleanliness_rating: { type: String },
    hygiene_rating: { type: String },
    service_rating: { type: String },
    rating: { type: Number },
    date_time : {type:String}
});
rating.plugin(mongoosePaginate);
module.exports = mongoose.model('ratings', rating)