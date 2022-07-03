const userModel = require('../model/userModel');
const verifyMobileModel = require('../model/VerifyMobileModel');
const bcrypt = require('../utilities/bcrypt');
const { find, add, getAllList, filterAndSerachList, getListFilter, listPaginate, aggregatePaginate } = require('../service/mongoServices');
const { response } = require('../utilities/responseStructure');
const familyMemberModel = require('../model/familyMemberModel');
const { validationResult } = require('express-validator');
const centerModel = require('../model/centers.Model');
var passwordHash = require('password-hash');
const { base64toImage } = require('../utilities/base64toImage')
const RatingModel = require('../model/ratingModel');

const { aggregate } = require('../service/mongoServices');
const patientsReportsModel = require('../model/patientsReportModel')
const patientsModel = require('../model/patientsModel');
const book_appointmentModel = require('../model/book_appointmentModel');
const mongoose = require('mongoose');
const appointment_slotsModel = require('../model/appointment_slotsModel');
const date_slotsModel = require('../model/date_slotsModel');
const moment = require("moment");
const enquiryModel = require('../model/enquiryModel')
const { parseInt } = require('lodash');
const { uploadBase64Image } = require('../utilities/base64toString');
const { email_send, randomNumber, userEnquiryMail, pushNotification } = require('../service/helper');
const ratingModel = require('../model/ratingModel');
const { populate } = require('../model/book_appointmentModel');
const notificationModel = require('../model/NotificationModel');

const randtoken = require('rand-token');
//const bcrypts = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const VerifyMobileModel = require('../model/VerifyMobileModel');
const { default: axios } = require('axios');
require('dotenv').config();
var refreshTokens = {}



exports.registerPatients = async (req, res) => {
    try {

        var file = req.file
        let payload = req.body;
        const password = await bcrypt.hashPassword("123456");
        if (file) {

            let options = {
                name: payload.name,
                email: payload.email,
                password: password,
                profile_photo_path: req.file.filename,
                blood_group: payload.blood_group,
                phone: payload.phone,
                address: payload.address,
                dob: payload.dob,
                gender: payload.gender,
                UserType: 'patients'
            };
            const newUser = await add(userModel, options);
            const test = await add(familyMemberModel, { user_id: newUser._id });
            // console.log(test, ">>>>>>>>>>>>>>>>>>>>>>");
            return res.status(200).json({ message: "register patients" });
        }
        else {
            let options = {
                name: payload.name,
                email: payload.email,
                password: password,
                blood_group: payload.blood_group,
                phone: payload.phone,
                address: payload.address,
                dob: payload.dob,
                gender: payload.gender,
                UserType: 'patients'
            };
            // await add(userModel,options);
            const newUser = await add(userModel, options);
            await add(familyMemberModel, { user_id: newUser._id })

            return res.status(200).json({ message: "register patients" });
        }

    } catch (error) {
        res.status(500).json({ error: error })
    }
}

exports.patientsRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors
            });
        }
        else {
            let payload = req.body;
            payload['UserType'] = 'patients';
            let family_user = {}
            const newUser = new userModel(payload);
            await newUser.save();
            family_user['user_id'] = newUser._id
            family_user['name'] = payload.name;
            family_user['blood_group'] = payload.blood_group;
            family_user['phone'] = payload.phone;
            family_user['gender'] = payload.gender;
            family_user['relation'] = 'self';

            const newfamilyMember = new familyMemberModel(family_user);
            await newfamilyMember.save();
            return res.status(200).json({
                message: "Patient register"
            })
        }
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.patientsList = async (req, res) => {
    try {
        var filter = {}
        // console.log("????????????????????<<<<<<<<<<<");
        var page = req.query.page ? parseInt(req.query.page) : 1;
        var limit = req.query.limit ? parseInt(req.query.limit) : 5;
        var searchKey = req.query;
        var search_all = req.query.all;
        delete searchKey.page;
        delete searchKey.limit;
        var objKeys = Object.keys(searchKey);

        for (var i = 0; i < objKeys.length; i++) {
            let pattern = new RegExp(searchKey[objKeys[i]]);
            filter[objKeys[i]] = pattern;
        }
        var valid_getQuery = Object.keys(filter)
        for (var i = 0; i < valid_getQuery.length; i++) {
            if (valid_getQuery[i] == 'undefined') {
                delete filter[valid_getQuery[i]]
            }
        }
        filter['UserType'] = 'patients'

        // console.log(filter);
        if (search_all) {
            var pattern = new RegExp(filter.all);
            delete filter.all;
            filter['email'] = pattern
            var data = await userModel.find(filter).limit(limit).skip((parseInt(page) - 1) * limit).sort({ _id: -1 });
            if (data.length == 0) {
                delete filter.email;
                filter['name'] = pattern
                var data = await userModel.find(filter).limit(limit).skip((parseInt(page) - 1) * limit).sort({ _id: -1 });
            }
            if (data.length == 0) {
                delete filter.name;
                filter['phone'] = pattern
                var data = await userModel.find(filter).limit(limit).skip((parseInt(page) - 1) * limit).sort({ _id: -1 });
            }
        }

        var data = await userModel.find(filter).limit(limit).skip((parseInt(page) - 1) * limit).sort({ _id: -1 });
        var newData = await userModel.find(filter);

        // const data = await getListFilter(userModel, req.query, { UserType: 'patients' }).catch(err => {
        //     return res.status(500).json({ error: err })
        // })
        ////////console.log(data,'=======================')
        return res.json({
            data: data,
            page: data.length % newData.length,
            page1: Math.ceil(newData.length / limit)
        })
        return res.status(200).json({ data: data })
    } catch (error) {
        console.log(error, "usererror-------------------");
        return res.status(500).json({ error: error })
    }
}

exports.patientsDetails = async (req, res) => {
    try {
        let _id = req.params.id;
        // let modelType = req.query.type == 'family'? true:false;
        // if(modelType){
        var data = await familyMemberModel.findOne({ _id: _id }).populate('user_id')
        // console.log(data, "??????????");
        var appointments = await book_appointmentModel.find({ patient_familyMemberId: data._id, center_id: req.centerId, appointment_status: { $ne: 'not complete' } }).sort({ date: -1 })
        var reports = await patientsReportsModel.find({ patientId: data._id, shareWith: { $elemMatch: { centerId: req.centerId } } })

        if (appointments.length == 0) {
            return res.status(404).json({ message: "not found" })
        }
        // }
        // else{
        //     var data = await userModel.findOne({_id:_id})
        //     var appointments = await book_appointmentModel.find({patient_userId:data._id})
        // }
        // console.log(data);
        // const data = await userModel.findOne({_id:_id})
        return res.status(200).json({ data: data, appointments: appointments, reports: reports })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

exports.patientFamilyMamber = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else {
            let payload = req.body;
            payload['userId'] = req.activeUser.userId;

            let options = {
                // "profile_photo_path":payload.userId,
                "name": payload.name,
                "phone": payload.phone,
                "dob": payload.dob,
                "gender": payload.gender,
                "insurance_no": payload.insurance_no,
                "blood_group": payload.blood_group,
                "relation": payload.relation,
                "user_id": req.activeUser.userId,
                "email": payload.email,
                "house_no": payload.house_no,
                "area": payload.area,
                "street": payload.street,
                "state": payload.state,
                "city": payload.city,
                "pincode": payload.pincode,
            }

            if (payload.profile_photo_path) {
                options['profile_photo_path'] = await uploadBase64Image(req.body.profile_photo_path, "upload/image/", "user_" + moment().format('DDMMYYhhiiss'))

            }


            const newData = new familyMemberModel(options);
            await newData.save()
            if (payload.reports) {
                let reports = payload.reports;
                for (var i = 0; i < reports.length; i++) {
                    if (reports[i].image) {
                        let options = {
                            userId: req.activeUser.userId,
                            patientId: newData._id,
                            // file: reports[i].image,
                            title: reports[i].title
                        }
                        options['file'] = await uploadBase64Image(reports[i].image, "upload/image/", "user_report" + moment().format('DDMMYYhhiiss') + i)

                        await add(patientsReportsModel, options)
                    }
                }

            }
            return res.status(200).json({ message: "create" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

exports.patientUpdateFamilyMamber = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors
            });
        }
        else {
            let payload = req.body;

            if (payload.profile_photo_path) {
                payload['profile_photo_path'] = await uploadBase64Image(req.body.profile_photo_path, "upload/image/", "user_" + moment().format('DDMMYYhhiiss'))

            }
            let _id = req.params.id;
            await familyMemberModel.updateOne({ _id }, payload);

            if (payload.reports) {
                let reports = payload.reports;
                for (var i = 0; i < reports.length; i++) {
                    if (reports[i].image) {
                        let options = {
                            userId: req.activeUser.userId,
                            patientId: _id,
                            // file: reports[i].image,
                            title: reports[i].title
                        }
                        options['file'] = await uploadBase64Image(reports[i].image, "upload/image/", "user_report" + moment().format('DDMMYYhhiiss') + i)

                        await add(patientsReportsModel, options)
                    }
                }

            }
            return res.status(200).json({ message: "update" });
        }
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.getAllCenterList = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.latitude)
        const longitude = parseFloat(req.query.longitude);
        const { page, limit } = req.query;
        var querys = {};
        var testquerys = {};
        const getQuery = req.query;
        var filter = []
        var sort = {}

        if (latitude && longitude) {
            filter.push(
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [latitude, longitude]
                        },
                        distanceMultiplier: 0.001,
                        distanceField: "distance",
                        // query: { $sort: "calcDistance" }0,
                        maxDistance: 10000000,
                        spherical: true
                    }
                },
                // { "$sort":sort },
                // { "$sort": { "distance": 1} },
            )
        }
        if (getQuery.rating) {
            sort['rating'] = parseInt(getQuery.rating)
            filter.push({ "$sort": { 'rating': parseInt(getQuery.rating) } })
        }
        var check_date = false
        var date = req.query.date
        if (getQuery.search) {
            querys['name'] = new RegExp(getQuery.search.toLowerCase())
        }
        if (getQuery.city) {
            querys['city'] = new RegExp(getQuery.city)
        }
        if (getQuery.price_from && getQuery.price_to) {
            querys['charges'] = { $gte: parseInt(getQuery.price_from), $lte: parseInt(getQuery.price_to) }

        }
        else if (getQuery.price_from && !getQuery.price_to) {
            // querys['charges'] = {$gte:parseInt(getQuery.price_from)}
            querys['charges'] = { $gte: parseInt(getQuery.price_from) }
            // }
            // {createdAt:{$gte:ISODate("2021-01-01"),$lt:ISODate("2020-05-01"}}
        }
        else if (!getQuery.price_from && getQuery.price_to) {
            // querys['charges'] = {$gte:parseInt(getQuery.price_from)}
            querys['charges'] = { $lt: parseInt(getQuery.price_to) }
            // }
            // {createdAt:{$gte:ISODate("2021-01-01"),$lt:ISODate("2020-05-01"}}
        }
        // if(getQuery.price_to){
        //     querys['charges'] = {$lte:parseInt(getQuery.price_to)}
        // }
        if (getQuery.date) {
            check_date = true
            date = moment(date, "YYYY-MM-DD").format('DD-MM-YYYY')
        }
        else {
            check_date = true
            date = moment().format('DD-MM-YYYY')
        }
        filter.push({ "$match": querys, },)
        // console.log(querys);
        // console.log(latitude);
        // console.log( longitude);
        // [-73.97, 40.77]
        querys['status'] = 'active';
        querys['verify_status'] = "approved"
        // let filter =[
        // ]
        if (check_date == true) {
            // date = moment(date, "YYYY-MM-DD").format('DD-MM-YYYY')
            // if(!getQuery.date) {
            //     date = moment().format('DD-MM-YYYY')
            // }
            // console.log(date, "------------------");
            filter.push(
                {
                    $lookup: {
                        from: "date_slots",
                        let: { centerId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$center_id", "$$centerId"] },
                                            { $eq: ["$date", date] },
                                            { $gte: ["$left_bed", 1] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "date_slots",
                    },
                },
            )
        }
        var addFields = {
            $addFields: {
                "date_slots_temp": { $sum: "$date_slots.left_bed" },
            }
        }
        var date_slots_date_match = {
            $match: {
                "date_slots.date": date
            }
        }
        // filter.push(dateGroup)
        filter.push(addFields)
        if (getQuery.date) {
            filter.push(date_slots_date_match)
        }
        delete getQuery.page;
        delete getQuery.limit;
        // var getObject = Object.keys(getQuery);
        // querys[getObject[0]] = new RegExp(getQuery[getObject[0]])
        // if(payload.rating)
        // console.log(filter, "????????");
        let options2 = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10
        }
        const data = await aggregatePaginate(centerModel, filter, options2)
        // const data = await centerModel.find(querys);
        return res.status(200).json({ data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

exports.getCenterDetails = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log(req.query)
        const date = moment().format('DD-MM-YYYY')
        const { latitude, longitude } = req.query;
        // const data = await centerModel.findOne({ _id: _id, 'status': 'active', 'verify_status': 'approved' ,});
        const center_filter = [
        ]
        if (latitude && longitude) {
            center_filter.push(
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [parseInt(latitude), parseInt(longitude)]
                        },
                        distanceMultiplier: 0.001,
                        distanceField: "distance",
                        // query: { $sort: "calcDistance" }0,
                        maxDistance: 10000000,
                        spherical: true
                    }
                },

                // { "$sort":sort },
                // { "$sort": { "distance": 1} },
            )
        }

        // center_filter.push({
        //     $lookup:{
        //         from:"date_slots",
        //         foreignField:"center_id",
        //         localField:"_id",
        //         as:"date_slots"
        //     }
        // })
        center_filter.push(
            {
                $lookup: {
                    from: "date_slots",
                    let: { centerId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$center_id", "$$centerId"] },
                                        { $eq: ["$date", date] },
                                        { $gte: ["$left_bed", 1] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "date_slots",
                },
            },
        )
        center_filter.push({
            $addFields: {
                "total_left_bed": { $sum: "$date_slots.left_bed" },
            }
        })
        center_filter.push({
            $match: {
                _id: mongoose.Types.ObjectId(_id),
                status: "active",
                verify_status: "approved"
            }
        })
        // center_filter.push(
        //     {
        //         $addFields: {
        //             "date_slots_temp": { $sum: "$date_slots.left_bed" },
        //         }
        //     }
        // )


        // center_filter.push(
        //     {
        //         $lookup: {
        //             from: "date_slots",
        //             foreignField:'_id',
        //             localField:"_id",
        //             // let: { centerId: "$_id" },
        //             // pipeline: [
        //             //     {
        //             //         $match: {
        //             //             $expr: {
        //             //                 $and: [
        //             //                     { $eq: ["$center_id", "$$centerId"] },
        //             //                     { $eq: ["$date", date] },
        //             //                     { $gte: ["$left_bed", 1] },
        //             //                 ],
        //             //             },
        //             //         },
        //             //     },
        //             // ],
        //             as: "date_slots",
        //         },
        //     },
        // )
        const data1 = await aggregate(centerModel, center_filter)
        // {
        //     $geoNear: {
        //         near: {
        //             type: "Point",
        //             coordinates: [latitude, longitude]
        //         },
        //         distanceMultiplier: 0.001,
        //         distanceField: "distance",
        //         // query: { $sort: "calcDistance" }0,
        //         maxDistance: 10000000,
        //         spherical: true
        //     }
        // },
        const ratings = await ratingModel.find({ center_id: _id });
        return res.status(200).json({ data: data1, reviews: ratings })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

exports.appointmentSlotsDetails = async (req, res) => {
    // return res.status(200).json({data:"test"})
    try {
        var centerId = req.params.id;
        // return res.send(centerId)
        // var day = req.params.day;
        const data = await date_slotsModel.find({ center_id: centerId, date: { $gte: moment().format('DD-MM-YYYY') } }).select('date start_time end_time total_beds')

        // const data = await date_slotsModel.find({ center_id: centerId, date: { $gte: moment().format('DD-MM-YYYY')} }).select('date start_time end_time total_beds')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}



exports.dateSlotsList = async (req, res) => {
    try {

        var date = req.query.date;


        if (date) {

            var currant_time = parseInt(moment().utcOffset("+05:30").format('HHmmss'))
            var match_time = moment().utcOffset("+05:30").format('DD-MM-YYYY')
            if (date == match_time) {
                console.log("match time")
                var date_condition_match = { "date": date, 'slot_start_time': { $gte: currant_time }, 'center_id': mongoose.Types.ObjectId(req.params.id), 'left_bed': { $gte: 0 } }
            }
            else {
                var date_condition_match = {
                    "date": date, 'center_id': mongoose.Types.ObjectId(req.params.id)
                    , 'left_bed': { $gte: 0 }
                }

            }
            //    var date_condition_match = {"date" :date, 'center_id':mongoose.Types.ObjectId(req.centerId),'left_bed':{$gte:0} }

            var filter = [

                // {
                //     "$match": { "date": date, 'slot_start_time':{$gte:nowDate},  'center_id': mongoose.Types.ObjectId(req.centerId) },
                // },
                {
                    "$match": date_condition_match,
                },
                { "$project": { "date": "$date", "total_bed": "$total_bed", "start_time": "$start_time", "left_bed": "$left_bed", "end_time": "$end_time", "center_id": "$center_id" } }
            ]

            var data = await aggregate(date_slotsModel, filter)

            return res.status(200).json({ data: data })
        }
        // var data = await dateSlotsModel.find({'center_id':req.centerId,  slot_date_n: { $gte: parseInt(moment().format('YYYYMMDD')) }}).sort({date : -1}).select('date').distinct('date').where('left_bed').gt(-0);


        var data = await date_slotsModel.find({ slot_date_n: { $gte: parseInt(moment().format('YYYYMMDD')) }, 'center_id': mongoose.Types.ObjectId(req.params.id), left_bed: { $gte: -0 } }).where('left_bed').gt(-0).sort({ slot_date_n: 1 }).select('date');

        var pre_date = "";
        var date_array = []
        for (var i = 0; i < data.length; i++) {
            if (pre_date != data[i]['date']) {
                date_array.push(data[i]['date'])
                pre_date = data[i]['date']
            }
        }

        //    console.log(data, "dates")
        return res.status(200).json({ data: date_array })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}



exports.dateSlotsList1 = async (req, res) => {
    try {


        var date = req.query.date;

        //   var only  = req.query.only
        if (date) {
            // 
            // var nowDate = parseInt(moment().format('HHmmss'))
            var currant_time = parseInt(moment().utcOffset("+05:30").format('HHmmss'))
            var match_time = moment().utcOffset("+05:30").format('DD-MM-YYYY')
            // console.log(date, "------------------------------date", match_time)
            if (date == match_time) {
                var date_condition_match = { "date": date, 'slot_start_time': { $gte: currant_time }, 'center_id': mongoose.Types.ObjectId(req.params.id), 'left_bed': { $gte: 0 } }
            }
            else {
                var date_condition_match = { "date": date, 'center_id': mongoose.Types.ObjectId(req.params.id), 'left_bed': { $gte: 0 } }

            }
            //    console.log()
            var filter = [

                {
                    "$match": date_condition_match,
                },
                { "$project": { "date": "$date", "total_bed": "$total_bed", "start_time": "$start_time", "left_bed": "$left_bed", "end_time": "$end_time", "center_id": "$center_id" } }
            ]

            var data = await aggregate(date_slotsModel, filter)
            // console.log(data, '---------------------------------')

            return res.status(200).json({ data: data })
        }
        var data = await date_slotsModel.find({ slot_date_n: { $gte: moment().format('DDMMYYYY') }, 'center_id': mongoose.Types.ObjectId(req.params.id), left_bed: { $gte: -0 } }).where('left_bed').gt(-0).sort({ slot_date_n: 1 }).select('date');


        var pre_date = "";
        var date_array = []
        for (var i = 0; i < data.length; i++) {
            if (pre_date != data[i]['date']) {
                date_array.push(data[i]['date'])
                pre_date = data[i]['date']
            }
        }


        return res.status(200).json({ data: date_array })
    } catch (error) {
        console.log(error, "--------------")
        return res.status(500).json({ error: error })
    }
}

exports.patientProfile = async (req, res) => {
    try {
        var profileId = req.params.id;

        let filter = [
            {
                "$match": { '_id': mongoose.Types.ObjectId(profileId), UserType: "patients" },
            },


            {
                $lookup: {
                    from: 'book_appointments',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'appointments'
                }
            },

            {
                $lookup: {
                    from: 'familymembers',
                    localField: 'appointments.patient_familyMemberId',
                    foreignField: '_id',
                    as: 'familyMembers'
                }
            },




        ]
        const user = await aggregate(userModel, filter)
        const appointments = await book_appointmentModel.find({ userId: profileId }).populate('center_id patient_familyMemberId').sort({ 'date': -1 });
        const reports = await patientsReportsModel.find({ userId: profileId }).populate('patientId');

        const reviews = await ratingModel.find({ user_id: profileId }).populate('center_id').sort({ createdAt: -1 });

        const members = await familyMemberModel.find({ user_id: profileId }).sort({ createdAt: -1 });

        return res.status(200).json({ data: user[0], appointments: appointments, reports: reports, reviews: reviews, members: members })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}



exports.patientAppointment = async (req, res) => {
    try {
        var profileId = req.params.id;


        const appointments = await book_appointmentModel.find({ userId: profileId, appointment_status: { $ne: 'not complete' } }).populate('center_id patient_familyMemberId').sort({ 'date': -1 });
        return res.status(200).json({ appointments: appointments })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

exports.SendRegisterOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else {
            const payload = req.body;
            var otp = randomNumber(1000, 9999);
            var check_otp = await verifyMobileModel.findOne({ phone: payload.phone, userType: 'patients' });

            if (check_otp) {
                var check_otp = await verifyMobileModel.updateOne({ _id: check_otp._id }, { otp: otp });

            }
            else {
                let options = {
                    phone: payload.phone,
                    otp: otp,
                    userType: 'patients'
                };
                const newData = new verifyMobileModel(options);
                // return res.send(newData)
                await newData.save()


            }


            var subject = "Registration OTP";
            var message = "Your otp is " + otp
            await userEnquiryMail('Bookcare', payload.email, subject, message)


            // access token and refresh token
            return res.status(200).json({
                data: "register ",
                // accessToken: token,
                // refreshToken: refreshToken
            });


        }
    } catch (error) {
        console.log(error, "------------------------------------------");
        return res.status(500).json({ error: error })
    }
}

exports.newPatients = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else {
            const payload = req.body;
            const check_otp = await verifyMobileModel.findOne({ phone: payload.phone, otp: payload.otp, userType: 'patients' });

            if (!check_otp) {
                return res.status(422).json({
                    errors: [{ param: 'otp', msg: 'Otp is invalid' }]
                });
            }
            let password = await passwordHash.generate(payload.password);
            let options = {
                name: payload.name,
                email: payload.email,
                blood_group: payload.blood_group,
                // profile_photo_path:await base64toImage(payload.profile_photo_path,),
                phone: payload.phone,
                address: payload.address,
                dob: payload.dob,
                insurance_no: payload.insurance_no,
                gender: payload.gender,
                password: password,
                UserType: 'patients',
                tc: payload.tc
            };
            const newData = new userModel(options);
            // return res.send(newData)
            await newData.save()
            let family_user = new familyMemberModel({
                user_id: newData._id,
                name: newData.name,
                phone: newData.phone,
                blood_group: newData.blood_group,
                dob: newData.dob,
                gender: newData.gender,
                relation: 'self'
            });
            await family_user.save()

            let userDetails = {
                userId: newData._id,
                name: newData.name,
                email: newData.email,

            }

            var subject = "Registration mail";
            var message = "Your registration is successfully"
            await email_send(newData._id, subject, message)
            await VerifyMobileModel.deleteOne({ _id: check_otp._id });

            var token = await jwtToken.sign(userDetails, process.env.JWT_SECREATE_kEY, { expiresIn: '86765m' });
            var refreshToken = randtoken.uid(256);
            refreshTokens[refreshToken] = newData.email;
            // access token and refresh token
            return res.status(200).json({
                data: "register ",
                accessToken: token,
                refreshToken: refreshToken
            });



            return res.status(200).json({ data: "register " })
        }
    } catch (error) {
        console.log(error, "------------------------------------------");
        return res.status(500).json({ error: error })
    }
}

// new api 

exports.patientFamilyMamberList = async (req, res) => {
    try {
        // console.log(req.activeUser.userId);
        const userId = req.activeUser.userId
        const familyMemberFilter = [
            { $match: { user_id: mongoose.Types.ObjectId(userId) } },
            {

                $lookup: {
                    from: "patients_reports",
                    localField: "_id",
                    foreignField: "patientId",
                    as: "patients_reports"
                }
            }
        ]
        // const data = await familyMemberModel.find({ user_id: userId })
        const data = await aggregate(familyMemberModel, familyMemberFilter)
        return res.json({ data })
    } catch (error) {

        console.log
        return res.json({ error: error })
    }
}



exports.bookAppointment = async (req, res) => {
    try {


        // console.log(req.body);
        console.log(req.activeUser.userId);
        const payload = req.body;

        const slot = await date_slotsModel.findOne({ _id: payload.slot_id }).populate('center_id')



        var check_appointment = await book_appointmentModel.findOne({ patient_familyMemberId: payload.patient_id, date: slot.date, appointment_status: { $ne: 'cancelled' }, $or: [{ apt_start_time: { $gte: slot.slot_start_time, $lt: slot.slot_end_time } }, { apt_endtime: { $gte: slot.slot_start_time, $lt: slot.slot_end_time } }] });
        // console.log(check_appointment)
        if (check_appointment) {
            return res.status(400).json({ message: "You can't book appointment for this slot. Because you already have an appointment between this time" })
        }
        if (slot.left_bed <= 0) {
            return res.status(400).json({ message: "Please select another slot, this slot is full" })
        }



        if (slot.left_bed < 0) {
            return res.status(400).json({ message: "kj" })
        }
        var date_slots = {};
        const user = await userModel.findOne({ _id: req.activeUser.userId });
        // return res.status(200).json({ mesaage:  payload.slot_id })


        if (!payload.patient_id) {

            let createfamilyMamber = new familyMemberModel({
                name: payload.name,
                user_id: user._id,
                phone: user.mobile,
                relation: payload.relation,
                blood_group: payload.blood_group
            })
            await createfamilyMamber.save()
            payload['patient_id'] = createfamilyMamber._id
            payload['user'] = 'family_member'

        }
        var commission = (100 - parseInt(slot.center_id.commission ? slot.center_id.commission : "0")) / 100 * parseInt(slot.center_id.charges);


        date_slots = {
            booked_by: 'online',
            patient_familyMemberId: payload.patient_id,
            center_id: slot.center_id,
            date: slot.date,
            appointment_start_time: slot.start_time,
            appointment_end_time: slot.end_time,
            payment_type: payload.payment_type,
            slot_id: slot._id,
            charges: slot.center_id.charges,
            appointment_id: moment().format('DDMMYYYYHHmmss'),

            userId: req.activeUser.userId,
            commission: parseInt(slot.center_id.charges) - parseInt(commission),
            apt_date: slot.slot_date_n,
            apt_start_time: slot.slot_start_time,
            apt_end_time: slot.slot_end_time,

        }
        if (payload.payment_type === 'online') {
            date_slots['appointment_status'] = 'not complete'
        }
        // if(date_slots['commission'] == NaN){
        //     date_slots['commission'] = 0
        // }

        const newData = new book_appointmentModel(date_slots)
        await newData.save()
        // await add(book_appointmentModel, date_slots)
        var leftBed = parseInt(slot.left_bed) - 1;
        var book_slots = parseInt(slot.book_slots) + 1;
        // console.log(leftBed);


        await date_slotsModel.updateOne({ _id: slot._id }, { left_bed: leftBed, book_slots })

        if (payload.payment_type != 'online') {

            var subject = "Appointment booking ";

            var message = "Your dialysis slot has been successfully booked at " + slot.center_id.name + " for " + slot.date + " at " + slot.start_time + ". "
            // var message = "Your appointment has been successfully booked on "+slot.date+" at "+slot.start_time
            await email_send(req.activeUser.userId, subject, message)

            let options = {
                center_id: slot.center_id,
                message: newData.appointment_key + " has been booked on " + slot.date + " at " + slot.start_time,
                date: moment().format('DD/MM/YYYY h:mm a'),
                type: 'center',
                module: 'appointment'
            };
            //   await add(notificationModel, options);
            var notification = await add(notificationModel, options);
            console.log("notification-------------------------------------")

            pushNotification(slot.center_id, options['message'])

            return res.status(200).json({ mesaage: "create book", data: newData, notification })

        }
        return res.status(200).json({ mesaage: "create book", data: newData })

    } catch (error) {
        console.log(error), "-------------------------------------------book appointment";
        return res.status(500).json({ error: error })
    }
}


exports.slot = async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await date_slotsModel.findOne({ _id: _id }).populate('center_id')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.userProfile = async (req, res) => {
    try {
        let userId = req.activeUser.userId;
        const data = await userModel.findOne({ _id: userId });
        return res.status(200).json({ data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}


exports.bookAppointmentList = async (req, res) => {
    try {
        var querys = {};
        let populates = [
            {
                path: "center_id",
            },
            {
                path: "patient_familyMemberId"
            },
            {
                path: "reports",
                populate: [
                    {
                        path: "reportId"
                    }
                ]
            }
        ]
        const { page, limit } = req.query;
        const getQuery = req.query;
        console.log(getQuery), "----------------------"
        delete getQuery.page;
        delete getQuery.limit;
        var getObject = Object.keys(getQuery);
        // querys[getObject[0]] = new RegExp(getQuery[getObject[0]])
        for (var i = 0; i < getObject.length; i++) {
            querys[getObject[i]] = getQuery[getObject[i]]
        }
        querys['userId'] = req.activeUser.userId;
        // console.log(querys);
        var test_querys = Object.keys(querys)
        // console.log(test_querys);
        for (var i = 0; i < test_querys.length; i++) {
            if (test_querys[i] == 'undefined') {
                delete querys[test_querys[i]]
            }
        }

        // querys['appointment_status'] = { $ne: 'not complete' }
        if (querys.appointment_status) {
            if (querys.appointment_status == 'ne-cancelled') {
                querys['appointment_status'] = { $nin: ['cancelled', 'not complete'] }
            }
            // else if(querys.appointment_status ) {

            // }
        }
        // else {
        //     querys['appointment_status'] = { $ne: 'not complete' }
        // }
        // console.log(querys);
        if (!page && !limit) {

            const allData = await book_appointmentModel.find(querys).populate(populates).sort({ apt_date: -1 })
            return res.status(200).json({ data: { doc: allData } })
        }
        var options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: populates,
            sort: {
                apt_date: -1 //Sort by Date Added DESC
            }


        };
        querys['populate'] = 'reports.reportId'

        // console.log(querys);
        var data = await listPaginate(book_appointmentModel, querys, options);
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ error })
    }

}


exports.getAppointment = async (req, res) => {
    try {
        const data = await book_appointmentModel.findOne({ _id: req.params.appointmentId }).populate('center_id')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ error })
    }
}


// const files = req.body.files
// delete payload.files
// console.log(payload,'-------------------------------upload documents -----------------------------------')
// const userId  = req.activeUser.userId;
// payload['userId'] = userId;

// var appointment = await book_appointmentModel.findOne({_id: payload.appointmentId})
// // console.log(payload.appointmentId,"8888")
// var reports = [];
// for(var i = 0; i < files.length; i++) {
//     if (files[i].image) {
//     var option ={
//         userId,
//         file:await base64toImage(files[i].image, 'upload/image/',"patients_reports_"+ moment().format('DDMMYYhhiiss')+i),
//         title:files[i].title,
//         patientId:appointment.patient_familyMemberId,
//         shareWith : [{centerId:appointment.center_id}]
//     }
//     let newData = new patientsReportsModel(option);
//     await newData.save()

//     reports.push({reportId:newData._id})
// }

// }

// // cretenine:payload.cretenine, 
// var data = await book_appointmentModel.updateOne({_id: payload.appointmentId},{cretenine:payload.cretenine, $set:{reports:reports}}, {new:true});
// // var data = await book_appointmentModel.updateOne({_id: payload.appoitmentId},{});



exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else {
            const files = req.body.files
            let payload = req.body;
            console.log(payload.files, "-------------------------");
            if (req.body.profile_photo_path) {
                payload['profile_photo_path'] = await uploadBase64Image(req.body.profile_photo_path, "upload/image/", "user_" + moment().format('DDMMYYhhiiss'))

            }

            let userId = req.activeUser.userId;
            await userModel.updateOne({ _id: userId }, payload);
            const patient_familyMemberId = await familyMemberModel.findOneAndUpdate({ user_id: userId, relation: 'self' }, payload);
            console.log(patient_familyMemberId, "patient_familyMemberId");
            if (files) {
                const files = req.body.files
                const userId = req.activeUser.userId;
                payload['userId'] = userId;
                var reports = [];
                for (var i = 0; i < files.length; i++) {
                    if (files[i].image) {
                        var option = {
                            userId,
                            file: await base64toImage(files[i].image, 'upload/image/', "patients_reports_" + moment().format('DDMMYYhhiiss') + i),
                            title: files[i].title,
                            patientId: patient_familyMemberId,
                        }
                        let newData = new patientsReportsModel(option);
                        await newData.save()
                        // reports.push({ reportId: newData._id })
                    }
                }


            }
            return res.status(200).json({ message: "update" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}


exports.bookAppointmentCancel = async () => {
    return new Promise(async (resolve, reject) => {
        const bookAppointment = await book_appointmentModel.find({ payment_status: "cancel" }).catch(err => {
            reject(err)
        })
        resolve(bookAppointment)

    });
}



exports.cancelAppointment = async (req, res) => {
    try {
        var id = req.params.id;
        var apt = await book_appointmentModel.findOne({ _id: id });
        if (apt.appointment_status == 'cancelled') {
            return res.status(423).json({ message: "Appointment is already cancel" })
        }
        var appointment = await book_appointmentModel.updateOne({ _id: id }, { appointment_status: 'cancelled' });

        var slot = await date_slotsModel.findOne({ _id: apt.slot_id });

        var date_slot = await date_slotsModel.findOneAndUpdate({ _id: apt.slot_id }, { left_bed: slot.left_bed + 1, book_slots: parseInt(slot.book_slots) - 1 });
        let options = {
            center_id: date_slot.center_id,
            message: apt.appointment_key + " has been cancelled",
            date: moment().format('DD/MM/YYYY h:mm a'),
            type: 'center',
            module: 'appointment'
        };
        //   await add(notificationModel, options);
        var notification = await add(notificationModel, options);
        // console.log(notification, "---------------------------------"/)

        var subject = "Appointment mail";
        var message = "As per your request, your Dialysis appointment for (" + slot.date + ", " + slot.start_time + ") has now been cancelled. "
        await email_send(req.activeUser.userId, subject, message)



        return res.status(200).json({ message: "cancelled appointment", data: notification })
    } catch (error) {
        appointment
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

exports.rescheduleAppointment = async (req, res) => {
    try {
        var id = req.params.id;
        // var slot_id = req.query.slot_id;

        const payload = req.body;
        //--------------------------------------cancel appointment
        var apt = await book_appointmentModel.findOne({ _id: id });
        if (apt.appointment_status == 'cancelled') {
            return res.status(423).json({ message: "Appointment is already cancel" })
        }

        var check_appointment = await book_appointmentModel.findOne({ patient_familyMemberId: apt.patient_familyMemberId, slot_id: payload.slot_id, appointment_status: { $ne: 'cancelled' } });
        if (check_appointment) {
            return res.status(423).json({ message: "You already have an appointment between this time" })
        }


        var appointment = await book_appointmentModel.updateOne({ _id: id }, { appointment_status: 'cancelled' });

        var slot = await date_slotsModel.findOne({ _id: apt.slot_id });

        var date_slot = await date_slotsModel.findOneAndUpdate({ _id: apt.slot_id }, { left_bed: slot.left_bed + 1, book_slots: parseInt(slot.book_slots) - 1 });

        const new_slot = await date_slotsModel.findOne({ _id: payload.slot_id }).populate('center_id')



        var commission = (100 - parseInt(new_slot.center_id.commission ? new_slot.center_id.commission : "0")) / 100 * parseInt(new_slot.center_id.charges);


        date_slots = {
            booked_by: 'online',
            patient_familyMemberId: apt.patient_familyMemberId,
            center_id: new_slot.center_id._id,
            apt_date: parseInt(moment(new_slot.date, 'DD-MM-YYYY').format('YYYYMMDD')),

            date: new_slot.date,
            appointment_start_time: new_slot.start_time,
            appointment_end_time: new_slot.end_time,
            payment_type: apt.payment_type,
            payment_status: apt.payment_status,
            slot_id: new_slot._id,
            charges: new_slot.center_id.charges,
            appointment_id: moment().format('DDMMYYYYHHmmss'),

            userId: apt.userId,
            commission: parseInt(new_slot.center_id.charges) - parseInt(commission),
            apt_start_time: new_slot.slot_start_time,
            apt_end_time: new_slot.slot_end_time,
            cretenine: apt.cretenine,
            reports: apt.reports

        }
        // console.log(date_slots)
        // res.status(422).json(date_slots);

        const newData = new book_appointmentModel(date_slots)
        await newData.save()
        var leftBed = parseInt(new_slot.left_bed) - 1;
        var book_slots = parseInt(new_slot.book_slots) + 1;


        await date_slotsModel.updateOne({ _id: new_slot._id }, { left_bed: leftBed, book_slots })

        let options = {
            center_id: date_slot.center_id,
            message: apt.appointment_key + " appointment is reschedule on (" + new_slot.date + ", " + new_slot.start_time + ").",
            date: moment().format('DD/MM/YYYY h:mm a'),
            type: 'center',
            module: 'appointment'
        };
        //   await add(notificationModel, options);
        var notification = await add(notificationModel, options);



        var subject = "Reschedule Appointment";
        var message = "As per your request, your Dialysis appointment for (" + apt.date + ", " + apt.appointment_start_time + ") is reschedule on (" + new_slot.date + ", " + new_slot.start_time + "). "
        await email_send(req.activeUser.userId, subject, message)


        //------------------------------------------end new appointment


        return res.status(200).json({ message: "reschedule appointment", data: notification })
    } catch (error) {
        appointment
        console.log(error);
        return res.status(500).json({ error: error })
    }
}








exports.patientCenters = async (req, res) => {
    try {
        // var data = await book_appointmentModel.find({'userId':req.activeUser.userId }).distinct('center_id'
        //     ,function(error,ids) {
        //         centerModel.find({'_id':{$in : ids}},function(err,result) {
        //           console.log(result);
        //         });

        // })

        var filter = [
            {
                $match: { 'userId': mongoose.Types.ObjectId(req.activeUser.userId) }
            },

            {
                $lookup: {
                    from: 'centers',
                    localField: 'center_id',
                    foreignField: '_id',
                    as: 'center_id'
                }
            },
            {
                $group: {
                    _id: "$center_id"
                },
            },




        ]
        const data = await aggregate(book_appointmentModel, filter)
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }

}






exports.checkNotification = async (req, res) => {
    try {

        var user = await userModel.findOne({ _id: req.query.id }).distinct('fcm_token.token')
        // console.log(user)
        var notification = {
            'title': "hello",
            'text': "checknotification"
        }

        var notification_key = {
            'notification': notification,
            'registration_ids': ["eVSpIaFITUaoCaPR0kcG1p:APA91bGI4Yl-0v7Gi9cvn4w31V9zxe8ZbjnqJt0Se4I3PqDXt_-5CKZVQgXyOI9zytIYS1njtyUPS9ffB46MvS4yAXaS0ZGNuI3nyG5-ty6r4p0QYtE4v5KSwf8V1GIB2kUzAAVZ2BpK"]
        }
        console.log(notification_key, 'send')
        await axios.post('https://fcm.googleapis.com/fcm/send', notification_key, {
            headers: {
                // 'application/json' is the modern content-type for JSON, but some
                // older servers may use 'text/json'.
                // See: http://bit.ly/text-json
                'Authorization': `key=${process.env.firebase_msg_key}`,
                'content-type': 'text/json'
            }
        }).then(res => {
            return res.status(200).json({ res })
            console.log("send :", res);
        }).catch(err => {
            return res.status(200).json({ err })
            console.log("err");
        })
        return res.status(200).json({ user })
    } catch (error) {
        if (error) throw error
    }
}


exports.createUserToFamily = async (req, res) => {
    // try {


    //         var users = await userModel.find({UserType:'patients'})
    //         var data = []
    //         for (var i=0 ; i<users.length; i++) {

    //             let options = {
    //                 name: users[i].name,
    //                 email: users[i].email,
    //                 blood_group: users[i].blood_group,
    //                 phone: users[i].phone,

    //                 dob: users[i].dob,
    //                 gender: users[i].gender,
    //                 relation: 'self',
    //                 houser_no: users[i].houser_no,
    //                 street: users[i].street,
    //                 area: users[i].area,
    //                 city: users[i].city,
    //                 state: users[i].state,
    //                 pincode: users[i].pincode,
    //                 insurance_no: users[i].insurance_no,
    //                 user_id: users[i]._id,
    //                 profile_photo_path: users[i].profile_photo_path,
    //                 userType : users[i].UserType
    //             };

    //             data.push(options)
    //             // await add(userModel,options);
    //             // const newUser = await add(familyMemberModel, options);


    //         }


    //         return res.status(200).json({ message: data });
    // } catch (error) {
    //     if (error) throw error
    // }
}
