const testiMonialModel = require("../model/testimonialModel");
const {validationResult} = require('express-validator');
const userModel = require("../model/userModel");
const NotificationModel = require("../model/NotificationModel");
const {listPaginate, add} = require('../service/mongoServices')
const moment = require('moment')
exports.addTestiMonial = async (req,res) =>{
    try {
        console.log(req.activeUser.userId);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
        const payload = req.body;
        let options = {
            review:payload.review
        }
   
        options['userId'] =req.activeUser.userId;
        const user = await userModel.findOne({_id : options['userId']})
        const newData = new testiMonialModel(options);
        await newData.save();

        let notification_options = {
            
            // message:payload.message,
            message : `A testimonial is added by ${user.name}`,
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'admin',
            module:'testimonial'
        };
        //   await add(notificationModel, options);
        var data = await add(NotificationModel, notification_options);


        return res.status(200).json({message:"create", notification :data})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error})
    }
}








exports.AdminaddTestiMonialApprove = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
         const _id = req.params.id;
         const payload = req.body;
         let option = {}
         option['verify_status'] = payload.payload;
         option['status'] = payload.status;
         await testiMonialModel.updateOne({_id},option);
         return res.status(200).json({message:"update"})
        }
    } catch (error) {
        return res.status(500).json({error})
    }
}


exports.approvedTesimonialList = async (req,res)=>{
    try {
        const data = await testiMonialModel.find({verify_status:'approved', status:'active'}).populate('userId');
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({error})
    }
}

exports.adminTestimonialList = async (req,res)=>{
    try {
        const data = await testiMonialModel.find().populate('userId').sort({'createdAt' : -1});
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({error})
    }
}


exports.adminUpdateTestimonial = async (req,res)=>{
    try {
        const _id = req.params.id;
         const payload = req.body;
         console.log(payload, "----------------------------------");
         let option = {}
        //  option[payload] = payload.payload;
        // //  option['status'] = payload.status;
         await testiMonialModel.updateOne({_id},payload);
         return res.status(200).json({message:"update"})
    } catch (error) {
        return res.status(500).json({error})
    }
}



exports.checkTestimonial = async (req,res) =>{
    try {
       
        const data = await testiMonialModel.findOne({userId:req.activeUser.userId});
        return res.status(200).json({data :data? true:false})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error})
    }
}

exports.adminDeleteTestimonial = async (req,res)=>{
  


    try {
        const _id = req.params.id
        await testiMonialModel.deleteOne({_id});
        return res.status(200).json({message:"delete testimonial"})
    } catch (error) {
        return res.status(500).json({ error })
    }
}

