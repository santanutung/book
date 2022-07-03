const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const patientsReports = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    review: {
        type: String,
        required: true
    },
    verify_status: { type: String, default: "pending" },
    status: { type: String, default: "active" }
}, { timestamps: true });
patientsReports.plugin(mongoosePaginate);
module.exports = mongoose.model('testimonial', patientsReports)
