const patientsReportsModel = require('../model/patientsReportModel');
const { validationResult } = require('express-validator')
const { base64toImage } = require('../utilities/base64toImage');
const moment = require('moment');
const familyMemberModel = require('../model/familyMemberModel');
const { listPaginate } = require('../service/mongoServices');
const book_appointmentModel = require('../model/book_appointmentModel');

exports.addReports = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else {
            const payload = req.body;
            const userId = req.activeUser.userId;
            payload['userId'] = userId;
            let option = {
                userId,
                file: await base64toImage(payload.file, 'upload/image/', "patients_reports_" + moment().format('DDMMYYhhiiss')),
                title: payload.title,
                patientId: payload.patientId
            }
            const newData = new patientsReportsModel(option);
            await newData.save()
            return res.status(200).json({ message: "create" })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

exports.listReports = async (req, res) => {
    try {
        const userId = req.activeUser.userId

        var querys = {};
        const { page, limit } = req.query;
        const getQuery = req.query;
        delete getQuery.page;
        delete getQuery.limit;
        var getObject = Object.keys(getQuery);
        querys = getQuery
        querys['userId'] = userId


        if (!page && !limit) {
            console.log("report quert", getQuery)

            const allData = await patientsReportsModel.find(querys).populate('patientId userId')
            return res.status(200).json({ data: { doc: allData } })
        }

        var options = {
            // select: 'title icon parentId',
            page: parseInt(page),
            limit: parseInt(limit),
            populate: 'userId',
        };
        console.log(querys);
        var data = await listPaginate(patientsReportsModel, querys, options);


        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ error })
    }
}


exports.deleteReport = async (req, res) => {
    try {
        const _id = req.params.id;
        await patientsReportsModel.deleteOne({ _id });
        return res.status(200).json({ message: "delete" })
    } catch (error) {
        return res.status(500).json({ error })

    }
}
exports.updateReport = async (req, res) => {
    try {
        const _id = req.params.id;
        let payload = req.body;
        console.log(payload)
        if (payload['file']) {
            payload['file'] = await base64toImage(payload.file, 'upload/image/', "patients_reports_" + moment().format('DDMMYYhhiiss'))
        }
        await patientsReportsModel.updateOne({ _id }, payload);
        return res.status(200).json({ message: "update" })
    } catch (error) {
        return res.status(500).json({ error })

    }
}

exports.shareReport = async (req, res) => {
    try {
        const _id = req.params.id;
        let payload = req.body;

        await patientsReportsModel.updateOne({ _id }, { $set: { shareWith: [] } });


        await patientsReportsModel.updateOne({ _id }, { $set: { shareWith: payload } })
        return res.status(200).json({ message: "update" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })

    }


}


exports.shareMultipleReport = async (req, res) => {
    try {
        const _id = req.params.id;
        let payload = req.body;
        console.log(payload)

        for (var i = 0; i < payload.reports.length; i++) {

            console.log(payload)
            await patientsReportsModel.updateOne({ _id: payload.reports[i]['reportId'] }, { $set: { shareWith: [] } });
           

            await patientsReportsModel.updateOne({ _id:payload.reports[i]['reportId'] }, { $set: { shareWith: payload.centers } })
        }
        return res.status(200).json({ message: "update" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })

    }


}






exports.appoitmentUploadDocument = async (req, res) => {
    try {
        const payload = req.body;
        const files = req.body.files
        delete payload.files
        console.log(payload, '-------------------------------upload documents -----------------------------------')
        const userId = req.activeUser.userId;
        payload['userId'] = userId;

        var appointment = await book_appointmentModel.findOne({ _id: payload.appointmentId })
        // console.log(payload.appointmentId,"8888")
        var reports = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].image) {
                var option = {
                    userId,
                    file: await base64toImage(files[i].image, 'upload/image/', "patients_reports_" + moment().format('DDMMYYhhiiss') + i),
                    title: files[i].title,
                    patientId: appointment.patient_familyMemberId,
                    shareWith: [{ centerId: appointment.center_id }]
                }
                let newData = new patientsReportsModel(option);
                await newData.save()

                reports.push({ reportId: newData._id })
            }

        }

        if (payload.uploadedReport) {
            for (var i = 0; i < payload.uploadedReport.length; i++) {
                
    
                    reports.push({ reportId: payload.uploadedReport[i]['reportId'] })
    
            }
        }

        // cretenine:payload.cretenine, 
        var data = await book_appointmentModel.updateOne({ _id: payload.appointmentId }, { cretenine: payload.cretenine, $set: { reports: reports } }, { new: true });
        // var data = await book_appointmentModel.updateOne({_id: payload.appoitmentId},{});

        return res.status(200).json({ message: data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}


exports.appoitmentAttachments = async (req, res) => {
    try {
        const _id = req.params.id;
        let payload = req.body;

        // await book_appointmentModel.updateOne({ _id: req.params.appointment_id }, {$set:{reports:[]}});
        console.log(payload)

        await book_appointmentModel.updateOne({ _id: req.params.appointment_id }, { $set: { reports: payload } })
        return res.status(200).json({ message: "update" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })

    }
}