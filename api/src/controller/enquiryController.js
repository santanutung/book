
const enquiryModel =require('../model/enquiryModel');
const {validationResult} = require('express-validator');
const {listPaginate, add} = require('../service/mongoServices')
const { sendEnquiryMail, userEnquiryMail, jwtDecoder } = require('../service/helper');
const notificationModel = require('../model/NotificationModel');
const moment = require('moment');
const userModel = require('../model/userModel');
const centersModel = require('../model/centers.Model');
require('dotenv').config()
exports.enquiry = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
        const payload = req.body;
        let options ={
            name:payload.name,
            email:payload.email,
            subject:payload.subject,
            message:payload.message,
        }
       
        console.log(payload)

        if(req.headers.authentication) {
            const  userId = jwtDecoder(req, res).userId
            options['userId'] = userId;
          
            var user = await userModel.findOne({ _id: userId });
            if(!payload.name) {
                options['name'] = user.name;
            }
            if(!payload.email) {
                options['email'] = user.email;
            }
            
        }
        const newData = new enquiryModel(options);
        await newData.save();
        let notification_options = {
            
            // message:payload.message,
            message : "You have received a enquiry no. "+newData.enquiry_no+" from "+ options['name'],
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'admin',
            module:'enquiry'
        };
        //   await add(notificationModel, options);
        var data = await add(notificationModel, notification_options);
        var subject = "Enquiry Mail"
        var message = `<p>Name : ${options.name}<p><p>Email : ${options.email}<p><p>Subject : ${options.subject}<p><p>Message : ${options.message}<p>`
        await userEnquiryMail('Bookcare', 'arr003@arramton.com', subject, message)

        await userEnquiryMail('Bookcare', 'neevhealthech@gmail.com', subject, message)

        
        res.status(200).json({messgae:"create", data})
        }
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.enquiryList = async (req,res)=>{
    try {
        var querys = {userId: req.activeUser.userId};
        // var newdata = new Date().toISOString().slice(0,10)
        // console.log(newdata);
        // return res.send(newdata)
        const { page, limit } = req.query;
        var date = req.query.date;
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 1,
        };
        
        // return res.send(options)
        if(date) {
            let regex = new RegExp(`${date}`,)
            querys['date']= regex
          }
        // else{
        //     querys = {}
        // }
        // var data = await listPaginate(enquiryModel, querys, options);
        var data = await enquiryModel.find(querys).limit(limit).skip((parseInt(page)-1) * limit).sort({createdAt:-1});
        var all_data = await enquiryModel.find(querys).sort({createdAt:-1})
        return res.json({
            data:data,
            page :Math.ceil(all_data.length/limit)
        })


        // const data = await enquiryModel.find();
        // var data = await listPaginate(enquiryModel, querys, options);
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({error})
    }
}

exports.AdminEnquiryList = async (req,res)=>{
    try {
        var querys = {};
        // var newdata = new Date().toISOString().slice(0,10)
        // console.log(newdata);
        // return res.send(newdata)
        const { page, limit } = req.query;
        var date = req.query.date;
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 1,
            sort:{createdAt:-1}
        };
        
        // return res.send(options)
        if(date) {
            let regex = new RegExp(`${date}`,)
            querys['date']= date
          }
          if(req.query.enquiry_no) {
            querys['enquiry_no']= req.query.enquiry_no
          }
        // else{
        //     querys = {}
        // }
        var data = await listPaginate(enquiryModel, querys, options);
        // var newData = await enquiryModel.find(querys).limit(limit).skip((parseInt(options.page)-1) * options.limit).sort({createdAt:-1});
        var all_data = await enquiryModel.find(querys).sort({createdAt:-1})
        return res.json({
            data:data,
            page :Math.ceil(all_data.length/limit)
        })


        // const data = await enquiryModel.find();
        // var data = await listPaginate(enquiryModel, querys, options);
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({error})
    }
}

exports.adminUpdateEnquiry = async (req,res)=>{
    try {
        let payload = req.body;
        let id = req.params.id;
        payload['date_time'] = moment().format('DD/MM/YYYY h:mm a')
        payload['userId'] = req.activeUser.userId
        console.log(payload, "payload--------------------------");
        var apt = await enquiryModel.findOne({ _id: id });
        var follow_up = apt.follow_up
        follow_up.push(payload)
        var enquiry = await enquiryModel.updateOne({ _id: id }, {$set:{follow_up:follow_up}});

       
        var subject = "Enquiry Follow Up";
        var message = payload.message
        await sendEnquiryMail(apt.name, apt.email, subject, message)

        if(apt.userId) {
            
            let notification_options = {
                
                // message:payload.message,
                user_id: apt.userId,
                // message : `${apt.enquiry_no} answer : ${payload.message} `,
                message : `enquiry No. ${apt.enquiry_no} Reply : ${payload.message} `,
                date: moment().format('DD/MM/YYYY h:mm a'),
                type:'user',
                module:'enquiry'
            };
            //   await add(notificationModel, options);
            var data = await add(notificationModel, notification_options);
            return res.status(200).json({message : 'update', user_id:apt.userId, notification :data})
        }

        return res.status(200).json({message : 'update'})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}


exports.adminUpdateStatusEnquiry = async (req,res)=>{
    try {
        let payload = req.body;
        let id = req.params.id;
        await enquiryModel.updateOne({ _id: id }, payload);

        return res.status(200).json({message : 'update'})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}



exports.adminGetEnquiry = async (req,res)=>{
    try {
        let id = req.params.id;
        console.log(id, "--------------------------");
        var data = await enquiryModel.findOne({ _id: id });

        return res.status(200).json({data})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}


exports.getEnquiry = async (req,res)=>{
    try {
        let id = req.params.id;
        console.log(id, "--------------------------");
        var data = await enquiryModel.findOne({ _id: id });

        return res.status(200).json({data})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}


exports.updateEnquiry = async (req,res)=>{
    try {
        let payload = req.body;
        let id = req.params.id;
        payload['date_time'] = moment().format('DD/MM/YYYY h:mm a')
        payload['userId'] = req.activeUser.userId
        console.log(payload, "payload--------------------------");
        var apt = await enquiryModel.findOne({ _id: id });
        var follow_up = apt.follow_up
        follow_up.push(payload)
        var enquiry = await enquiryModel.updateOne({ _id: id }, {$set:{follow_up:follow_up}});


        
        var subject = "Enquiry Follow Up";
        var message = payload.message
        await userEnquiryMail('admin', process.env.MAIL_RECEIVER, subject, message)

        await userEnquiryMail('Bookcare', 'rachnakmr1995@gmail.com', subject, message)
            
            let notification_options = {
                
                // message:payload.message,
                message : `enquiry No. ${apt.enquiry_no} Reply : ${payload.message} `,
                date: moment().format('DD/MM/YYYY h:mm a'),
                type:'admin',
                module:'enquiry'
            };
          
            var data = await add(notificationModel, notification_options);
            return res.status(200).json({message : 'update', notification :data})

        // return res.status(200).json({message : 'update'})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}




//------------------------------center enquiry----------------------------------------
exports.centerEnquiry = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
        const payload = req.body;

        
        let options ={
            // name:payload.name,
            // email:payload.email,
            centerId : req.centerId,
            userType : 'center',
            subject:payload.subject,
            message:payload.message,
        }


        var user = await centersModel.findOne({ _id: req.centerId });

        if(!payload.name) {
            options['name'] = user.name;
        }
        if(!payload.email) {
            options['email'] = user.email;
        }
       
        // console.log(payload)

        // if(req.headers.authentication) {
        //     const  userId = jwtDecoder(req, res).userId
        //     options['userId'] = userId;
          
        //     var user = await userModel.findOne({ _id: userId });
        //     if(!payload.name) {
        //         options['name'] = user.name;
        //     }
        //     if(!payload.email) {
        //         options['email'] = user.email;
        //     }
            
        // }
        const newData = new enquiryModel(options);
        await newData.save();
        let notification_options = {
            
            // message:payload.message,
            message : "You have received a enquiry no. "+newData.enquiry_no+" from "+ options['name'],
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'admin',
            module:'enquiry'
        };
        //   await add(notificationModel, options);
        var data = await add(notificationModel, notification_options);
        var subject = "Enquiry Mail"
        var message = `<p>Name : ${options.name}<p><p>Email : ${options.email}<p><p>Subject : ${options.subject}<p><p>Message : ${options.message}<p>`
        await userEnquiryMail('Bookcare', 'arr003@arramton.com', subject, message)

        await userEnquiryMail('Bookcare', 'neevhealthech@gmail.com', subject, message)

        
        res.status(200).json({messgae:"create", data})
        }
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}
//------------------------------end center enquiry----------------------------------



exports.centerEnquiryList = async (req,res)=>{
    try {
        var querys = {centerId: req.centerId};
     
        const { page, limit } = req.query;
        var date = req.query.date;
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 1,
        };
        
        // return res.send(options)
        if(date) {
            let regex = new RegExp(`${date}`,)
            querys['date']= regex
          }
        // else{
        //     querys = {}
        // }
        // var data = await listPaginate(enquiryModel, querys, options);
        var data = await enquiryModel.find(querys).limit(limit).skip((parseInt(page)-1) * limit).sort({createdAt:-1});
        var all_data = await enquiryModel.find(querys).sort({createdAt:-1})
        return res.json({
            data:data,
            page :Math.ceil(all_data.length/limit)
        })


        // const data = await enquiryModel.find();
        // var data = await listPaginate(enquiryModel, querys, options);
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({error})
    }
}
