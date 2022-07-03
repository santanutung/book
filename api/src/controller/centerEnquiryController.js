const centerEnquirysModel = require('../model/centerEnquiryModel');
const { validationResult } = require('express-validator');
const { add, listPaginate } = require('../service/mongoServices');
const NotificationModel = require('../model/NotificationModel');
const { userEnquiryMail, centerUpdateMailSend } = require('../config/emailService');
const moment = require('moment');
const { sendEnquiryMail } = require('../service/helper');
exports.centerEnquiryAdd = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(422).json(errors);
        }
        else {
            const payload = req.body;
            // await add(centerEnquirysModel, payload);

            const newData = new centerEnquirysModel(payload);
            await newData.save();
            let notification_options = {
            
                // message:payload.message,
                message : "You have received a enquiry no. "+newData.enquiryNumber+" from "+ payload['name'],
                date: moment().format('DD/MM/YYYY h:mm a'),
                type:'admin',
                module:'centerenquiry'
            };
            //   await add(notificationModel, options);
            var data = await add(NotificationModel, notification_options);
            var subject = "Enquiry Mail"
            var message = `<p>Name : ${payload.name}<p><p>Email : ${payload.email}<p><p>Phone : ${payload.phone}<p><p>Address : ${payload.address}<p><p>Message : ${payload.message}<p>`
            await userEnquiryMail('Bookcare', 'arr003@arramton.com', subject, message)

            

            return res.status(200).json({ message: "create", data:data })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}


exports.centerEnquiryGet = async (req, res) => {
    try {
        // const data = await centerEnquirysModel.find().sort({enquiryNumber:-1})

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
            sort:{enquiryNumber:-1}
        };
        
        // return res.send(options)
        if(date) {
            let regex = new RegExp(`${date}`,)
            querys['date']= date
          }
          if(req.query.enquiry_no) {
            querys['enquiryNumber']= req.query.enquiry_no
          }
        // else{
        //     querys = {}
        // }
        var data = await listPaginate(centerEnquirysModel, querys, options);
        // var newData = await enquiryModel.find(querys).limit(limit).skip((parseInt(options.page)-1) * options.limit).sort({createdAt:-1});
        var all_data = await centerEnquirysModel.find(querys).sort({enquiryNumber:-1})
        return res.json({
            data:data,
            page :Math.ceil(all_data.length/limit)
        })


        return res.status(200).json({ data })
    } catch (error) {
        console.log(error, "-------------------------------")
        return res.status(500).json({ error })
    }
}

exports.centerEnquiryDetails = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await centerEnquirysModel.findOne({ _id })
        return res.status(200).json({ data })

    } catch (error) {
        return res.status(500).json({ error })
    }
}

exports.centerEnquiryDelete = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await centerEnquirysModel.deleteOne({ _id })
        return res.status(200).json({ data })

    } catch (error) {
        return res.status(500).json({ error })
    }
}


exports.adminUpdateEnquiry = async (req,res)=>{
    try {
        let payload = req.body;
        let id = req.params.id;
        payload['date_time'] = moment().format('DD/MM/YYYY h:mm a')
        payload['userId'] = req.activeUser.userId
        console.log(payload, "payload--------------------------");
        var apt = await centerEnquirysModel.findOne({ _id: id });
        var follow_up = apt.follow_up
        follow_up.push(payload)
       await centerEnquirysModel.updateOne({ _id: id }, {$set:{follow_up:follow_up}});

       
        var subject = "Enquiry Follow Up";
        var message = payload.message
        await centerUpdateMailSend(apt.name, apt.email, subject, "", message)

        
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
        await centerEnquirysModel.updateOne({ _id: id }, payload);

        return res.status(200).json({message : 'update'})
    } catch (error) {
        console.log(error,'--------------------------------');
        return res.status(500).json({error})
    }
}
