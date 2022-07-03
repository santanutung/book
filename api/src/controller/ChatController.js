
// const centerChatModel =require('../model/CenterChatModal');
const notificationModel = require('../model/NotificationModel');
const moment = require('moment');
const userModel = require('../model/userModel');
const centersModel = require('../model/centers.Model');
const CenterChatModal = require('../model/CenterChatModal');
require('dotenv').config()


exports.centerMessage = async (req,res) =>{
    try {
       
        const payload = req.body;

        
        let options ={
            center_id : req.centerId,
            message:payload.message,
            sender : 'center'
        }


        const newData = new CenterChatModal(options);
        await newData.save();

        const center = await centersModel.findOne({_id:req.centerId})
        var message = center.name +" : "+payload.message
        options['center_message'] =message
        res.status(200).json({message:"create", data:options})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.adminChat = async (req,res) =>{
    try {
       
        var data = await CenterChatModal.find({center_id:req.params.centerId})

        // var unread_message = await CenterChatModal.find({sender : 'center', isRead:false}).populate('center_id')
      
      
        // console.log(data)
        res.status(200).json({messgae:"create", data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}



exports.getUnreadMessage = async (req,res) =>{
    try {
       
        var payload = req.body

        if(req.centerId) { 
            payload['center_id'] = req.centerId
        }
        payload['sender'] = req.centerId ? 'admin' : 'center'
        payload['isRead'] = false
        console.log(payload)
        var data = await CenterChatModal.find(payload).populate('center_id').sort({_id:-1})
      
      
        // console.log(data)
        res.status(200).json({messgae:"read", data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
    
}

exports.markReadMessage = async (req, res) => {
    try {
      
        await CenterChatModal.updateMany({sender:'center', center_id:req.params.centerId}, {isRead:true})

        return res.status(200).json({message : "mark read all"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error})
    }
}


exports.centerChat = async (req,res) =>{
    try {
       
        var data = await CenterChatModal.find({center_id:req.centerId})
        var unread_message = await CenterChatModal.find({center_id:req.centerId, sender : 'admin', isRead:false})
      
        // console.log(data)
        res.status(200).json({messgae:"create", data, unread_message})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.adminMessage = async (req,res) =>{
    try {
       
        const payload = req.body;

        
        let options ={
            center_id : req.params.centerId,
            message:payload.message,
            sender : 'admin',
            user_id : req.userId,
        }


        const newData = new CenterChatModal(options);
        await newData.save();
     
        res.status(200).json({messgae:"create", data:newData})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}
