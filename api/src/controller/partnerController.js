const partnerModel = require('../model/partnerModel');
const { validationResult } = require('express-validator')
const { base64toImage } = require('../utilities/base64toImage')
const moment = require('moment');
const { listPaginate } = require('../service/mongoServices')

exports.AdminaddPartner = async (req, res) => {
    try {
        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error.errors
            });
        }
        else {
            const payload = req.body;
            let options = {
                name: payload.name,
                image: await base64toImage(payload.image, 'upload/image/', moment().format('DDMMYYhhiiss') + "image"),
            }
            var newData = new partnerModel(options);
            await newData.save();
            return res.status(200).json({ message: "create" })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}


exports.AdminupdatePartner = async (req, res) => {
    try {
        
            var _id = req.params.id;
            const payload = req.body;
            console.log(_id);
            // var newData = new Date.now()
            if (payload.image) {
                payload['image'] =  await base64toImage(payload.image, 'upload/image/', moment().format('DDMMYYhhiiss') + "image")
            }
            

            await partnerModel.updateOne({ _id }, payload);
            return res.status(200).json({ message: "update" })
        
    } catch (error) {
        return res.status(500).json({ error })
    }
}

exports.AdmindeletePartner = async (req, res) => {
    try {
        const _id = req.params.id;
        await partnerModel.deleteOne({ _id });
        return res.status(200).json({ message: "delete" })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

exports.AdminListPartner = async (req, res) => {
    try {
        var querys = {};

        const { page, limit } = req.query;
        var date = req.query.date;
        const alldata = await partnerModel.find()
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : alldata.length,
        };
        var data = await listPaginate(partnerModel, querys, options);
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ error })
    }
}



exports.ListPartner = async (req, res) => {
    try {
        var querys = { active: true };

        const { page, limit } = req.query;
        var date = req.query.date;
        const alldata = await partnerModel.find()
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : alldata.length,
        };
        var data = await listPaginate(partnerModel, querys, options);
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

