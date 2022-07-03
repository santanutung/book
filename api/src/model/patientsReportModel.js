const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const patientsReports = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "familyMember",
        required: true
    },
    file: {
        type: String,
        required: true
    },
    title: { type: String, default: '' },
    shareWith: [{

        centerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "centers",
            required: true

        }

    }],
}, { timestamps: true });
patientsReports.plugin(mongoosePaginate);
module.exports = mongoose.model('patients_reports', patientsReports)


// user_id
// patient_id
// file
// title