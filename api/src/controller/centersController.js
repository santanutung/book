const centerModel = require('../model/centers.Model');
const userModel = require('../model/userModel');
const router = require('express').Router();
const bcrypt = require('../utilities/bcrypt');
const { v4: uuidv4 } = require('uuid');
const centerTimeModel = require('../model/center_timesModel');
const centerImageModel = require('../model/center_imagesModel');
const notificationModel = require('../model/NotificationModel');
const { getList, add, Search, findById, edit,getAllList,permanentRemove,aggregate } = require('../service/mongoServices');
const { response } = require('../utilities/responseStructure');
const { validationResult } = require('express-validator');
const randtoken = require('rand-token');
//const bcrypts = require('bcrypt');
const jwtToken = require('jsonwebtoken');
var passwordHash = require('password-hash');
const {pdfConvert} = require('../service/helper');
const moment = require('moment')
const centerDocumentCategory = require('../model/center_documentsCategoryModel')
const centerDocumentsModel = require('../model/center_documents');
// const PSPDFKit = require('pspdfkit')
const { centerEmailSend } = require('../service/helper');
fs = require('fs');
const upload = require('../utilities/upload');
const center_documentsCategoryModel = require('../model/center_documentsCategoryModel');

const book_appointmentModel = require('../model/book_appointmentModel')
const {uploadBase64Image} = require('../utilities/base64toString')
require('dotenv').config();
var refreshTokens = {}
const mongoose = require('mongoose');
const e = require('express');
const centersModel = require('../model/centers.Model');
const { centerUpdateMailSend } = require('../config/emailService');
// const test1 = require('../service/centerService');
// test1.findData().then(data=>{
//     console.log(data,">>>>>>>>>>>>>>");
// })


// exports.patientsList  = async(req,res) =>{
//     try {
//         let filter = [
//             {
//                 path: 'patient_familyMemberId',
//                 populate: {
//                     path: "user_id"
//                 }
//             },
//             {
//                 path: 'patient_userId',
//             },
//         ]
//         const data = await book_appointmentModel.find().group('patient_userId');
//         res.send(data)
//     } catch (error) {
//         return res.status(500).json({error:error})
//     }
// }

exports.patientsList  = async(req,res) =>{

    try {

        let phone = req.query;
        let filter = [
            {
                "$match": { 'center_id':mongoose.Types.ObjectId(req.centerId) } , 
            },
            {
                $group:
                {
                    _id:
                    {
                        userGroup: "$patient_userId",
                        familyMemberGroup: '$patient_familyMemberId'
                    }
                }
            },
                
                {
                    $lookup: {
                      from: 'familymembers',
                      localField: '_id.familyMemberGroup',
                      foreignField: '_id',
                      as: 'family'
                    }
                  },
                
                  {
                    $lookup: {
                      from: 'users',
                      localField: '_id.userGroup',
                      foreignField: '_id',
                      as: 'user'
                    }
                  },
                 
                  {
                    $lookup: {
                      from: 'users',
                      localField: `family.user_id`,
                      foreignField: '_id',
                      as: 'family_user'
                    }
                  },
              
        ]

        const data = await aggregate(book_appointmentModel,filter)

        return res.status(200).json({data:data})

    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.registerCenter = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
       
        var fileName = "";
        var payload = req.body;
        var coordinates = req.body.coordinates
        payload['location'] = {"coordinates":coordinates}
        // console.log(payload,"??????????????????????????");
        if(req.body.image) {
            payload['primaryImage'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
            // payload['fileName'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
            payload['images'] = [{image : payload['primaryImage'], is_primary:1}]
        }
        // if(!req.body.times){
        //     return res.status(422).json({error:"center time required"})
        // }
        payload['times'] = req.body.times
        payload['verify_status'] = 'approved'
         const center = await add(centerModel, payload);
         var pswd = "123456"
        let password = passwordHash.generate(pswd);
     
        let user = {
            name: center.name,
            email:payload.email,
            password: password,
            phone: payload.contact_no,
            address: payload.address,
            center_id: center._id,
            UserType:'center',
           
        }
        // console.log(user, 'user');
        await add(userModel, user);

        var subject = "Center Registeration";
        // var message = apt.appointment_id + " has been cancelled"
        // var message = `Thank for register with us.<br> Login Id : ${userId}<br>password : 123456`
        var message = ` (${center.name}) has been successfully registered with bookcare.in on (${moment().format('DD-MM-YYYY')}). You can now access our portal (<a href="${process.env.center_url}" target="blank">${process.env.center_url}</a>) using your login credentials:
        <br>
        ID: ${payload.email}
        Password: ${pswd}`
        await centerEmailSend(center._id, subject, message)

       

        //  userModel.createIndexes({ "location" : "2dsphere" } )
        return res.status(200).json({ message: "resgiter center"});
    }

        // }
    } catch (error) {
        console.log(error,"?????????????");
        res.status(500).json({ error: error }
        )
    }
}

exports.registerCenterApp = async (req, res) => {
    console.log(req);
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
       console.log(req.body);
        var fileName = "";
        var payload = req.body;
        delete payload.image
        // console.log(req.body,">>>>>>>>>>>");
        if(req.body.image) {
            payload['primaryImage'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
            // payload['fileName'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
        }

        // payload['coordinates'] = [parseFloat(payload.latitude), parseFloat(payload.longitude)]
        payload['location'] = {"coordinates":[parseFloat(payload.latitude), parseFloat(payload.longitude)]}
         const center = await add(centerModel, payload);
         let pswd = "123456";
        let password = passwordHash.generate(pswd);
      
        let user = {
            name: center.name,
            email: payload.email,
            password: password,
            phone: payload.contact_no,
            address: payload.address,
            center_id: center._id,
            UserType:'center'
        }
        console.log(user, 'user');
        await add(userModel, user);
        var subject = "Center Registeration";
        // var message = apt.appointment_id + " has been cancelled"
        // var message = `Thank for register with us.<br> Login Id : ${userId}<br>password : 123456`
        var message = `Thank you for registering with us.<br>

        (${center.name}) has been successfully registered with bookcare.in on (${moment().format('DD-MM-YYYY')}). You can now access our portal (<a href="${process.env.center_url}" target="blank">${process.env.center_url}</a>) using your login credentials:
        <br>
        ID: ${payload.email}
        Password: ${pswd}`
        await centerEmailSend(center._id, subject, message)


        return res.status(200).json({ message: "resgiter center"});
    }

        // }
    } catch (error) {
        console.log(error,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        res.status(500).json({ error: error }
        )
    }
}
exports.centerImageUpload = async (req, res) => {
    try {
        var rs = await response(req.method);
        let payload = req.body;
        console.log(req.file);
        let options = {
            center_id: payload.center_id,
            image: req.file.filename,
            is_primary: payload.is_primary
        };
        await add(centerImageModel, options);
        res.status(rs.status).json({ message: "create image" });

    } catch (error) {
        res.status(res.status).json({
            error: error
        })
    }
}


exports.centerList = async (req, res) => {
    try {
        // console.log(req.query,"------------------------");
        var filter = {}
      var  page = req.query.page? parseInt(req.query.page):1;
      var  limit = req.query.limit? parseInt(req.query.limit):5;
      var  verify_status =req.query.verify_status;
      var serach_all = req.query;
      var getQuery = Object.keys(serach_all)
      if(!verify_status){
          return res.status(400).json({error:"verify_status requred req.query "})
      }
      for(var i=0;i<getQuery.length;i++){
        filter[getQuery[i]]  = serach_all[getQuery[i]]
      }
     var valid_getQuery= Object.keys(filter);
     console.log(valid_getQuery,">>>>>");
      for(var i =0; i<valid_getQuery.length;i++){
        if(valid_getQuery[i] == 'undefined'){
             delete filter[valid_getQuery[i]]
        }
    }
    if(filter.all){
        console.log("yes");
        var search_val = new RegExp(req.query.all)
        delete filter.all
        filter['name'] = search_val
        var all_data = await centerModel.find({verify_status:verify_status});
        var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
        console.log(newData.length,"len");
        if(newData.length ==0){
            delete filter.name;
            filter['email'] = search_val;
            
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
         if(newData.length ==0){
            delete filter.email;
            filter['contact_no'] = search_val
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
         if(newData.length ==0){
            delete filter.contact_no;
            filter['center_manager'] = search_val
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
         if(newData.length ==0){
            delete filter.center_manager;
            filter['address'] = search_val
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
         if(newData.length ==0){
            delete filter.address;
            filter['state'] = search_val
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
         if(newData.length ==0){
            delete filter.state;
            filter['city'] = search_val
            if (req.query.limit) {

                var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            }
            else {
                var newData = await centerModel.find(filter).sort({_id:-1});

            }
        }
    }
      console.log(filter,"???????????")
      
  
    //   var all_data = await centerModel.find({name:{ $regex: query.name }}).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
    //   var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
      if (req.query.limit) {

        var newData = await centerModel.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
    }
    else {
        var newData = await centerModel.find(filter).sort({_id:-1});

    }
    var all_data = await centerModel.find(filter);

      return res.json({
          data:newData,
          page:newData.length%all_data.length,
          page1 :Math.ceil(all_data.length/limit)
      })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}






exports.centerDetails = async (req, res) => {
    try {
        var rs = await response(req.method);
        console.log(req);
        var _id = req.params.id
       

        const centerData = await findById(centerModel, _id);
        const result = await centerDocumentsModel.find({'centerId':_id}).populate('document_typeId');
        res.status(200).json({ data: centerData, documents:result });

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}
exports.centerVerfiyUpdate = async (req, res) => {
    try {
        var rs = await response(req.method);
        var _id = req.params.id
        // console.log(req.body)
        // const { data} = req.body;
        console.log(req.body,":status")
        // if(verify_status){
        //     var options = {
        //         verify_status: verify_status
        //     }
        //        const result = await edit(centerModel, _id, options);
        // }
        // else{
        //     var options = {
        //         verify_status: verify_status
        //     }
            const result = await edit(centerModel, _id, req.body);
            return res.status(200).json({ data: "update" });
        // }

    } catch (error) {
        res.status(rs.status).json({
            error: error
        })
    }
}


exports.centerUpdate = async (req, res) => {
    try {
        console.log("update slot");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{

        var _id = req.params.id
        let payload = req.body;
        // const long=req.body.location;
        console.log(req.body,"?????");

        var old_centre = await centersModel.findOne({ _id: _id })
        let options = {
            name: payload.name,
            email: payload.email,
            contact_no: payload.contact_no,
            addition_contact_no: payload.addition_contact_no,
            address: payload.address,
            contact_no: payload.contact_no,
            state: payload.state,
            city: payload.city,
            area: payload.area,
            charges: payload.charges,
            pincode: payload.pincode,
            latitude: payload.latitude,
            longitude: payload.longitude,
            total_beds: payload.total_beds,
            commission:payload.commission,
            introduction: payload.introduction,
            center_manager:payload.center_manager,
            verify_status : 'approved',  
        };
        if(req.body.image) {
            options['primaryImage'] = uploadBase64Image(req.body.image, "upload/image/", "center_"+moment().format('DDMMYYhhiiss'))
        }
        // var coordinates = req.body.coordinates
        // options['location'] = {"coordinates":coordinates}
       
        // var coordinates = req.body.coordinates
        // options['location'] = {"coordinates":coordinates}
        console.log(options);
        await centerModel.findOneAndUpdate({ _id: _id }, options, { upsert: true });
        if(req.body.coordinates){
            await centerModel.updateOne({_id},{$set:{"location.coordinates":req.body.coordinates}})
            // await centerModel.createIndexes({location: '2dsphere' })
        }

        await userModel.findOneAndUpdate({ center_id: _id }, options, { upsert: true });
   

        var subject = "Center Update";
        // var message = apt.appointment_id + " has been cancelled"
        // var message = `Thank for register with us.<br> Login Id : ${userId}<br>password : 123456`
        // var message = ` (${center.name}) bookcare has. You can now access our portal (<a href="${process.env.center_url}" target="blank">${process.env.center_url}</a>) using your login credentials:
        // <br>
        // ID: ${payload.email}
        // Password: ${pswd}`
        // await centerEmailSend(center._id, subject, message)

        updateMail(old_centre, options, payload.email)


        // console.log(center.images[0]._id, 'njhgf');
        //  await centerModel.createIndexes({location: '2dsphere' })
        res.status(200).json({ message: "update center" });
    }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error }
        )
    }
}


 function updateMail(oldata, newdata, email) {
//     var newdata = await centersModel.findOne();
  
//   var oldata = await centersModel.findOne();
  
    var message = `<p style="line-height: 30px;">
    This is to inform you that your centre's information has been updated/changed by the admin.
    </p>`;
    
    message += `<table><tr><th>Current </th><th>New</th></tr>`
    if(newdata['name'] !== oldata['name']) {

        message += `<tr><th>Name : </th><td>${newdata['name']} </td> <td>${oldata['name']}</td>`
    }
    if(newdata['email'] !== oldata['email']) {

        message += `<tr><th>Email : </th><td>$<td>${newdata['email']} </td> <td>${oldata['email']}</td>`
    }
    if(newdata['contact_no'] !== oldata['contact_no']) {

        message += `<tr><th>Contact No. : </th><td>$<td>${newdata['contact_no']} </td> <td>${oldata['contact_no']}</td>`
    }

    if(newdata['center_manager'] !== oldata['center_manager']) {

        message += `<tr><th>Centre Manager : </th><td>$<td>${newdata['center_manager']} </td> <td>${oldata['center_manager']}</td>`
    }
  
    if(newdata['address'] !== oldata['address']) {

        message += `<tr><th>Address : </th><td>$<td>${newdata['address']} </td> <td>${oldata['address']}</td>`
    }

    if(newdata['state'] !== oldata['state']) {

        message += `<tr><th>State : </th><td>$<td>${newdata['state']} </td> <td>${oldata['state']}</td>`
    }

    if(newdata['city'] !== oldata['city']) {

        message += `<tr><th>City : </th><td>$<td>${newdata['city']} </td> <td>${oldata['city']}</td>`
    }


    if(newdata['pincode'] !== oldata['pincode']) {

        message += `<tr><th>Pincode : </th><td>$<td>${newdata['pincode']} </td> <td>${oldata['pincode']}</td>`
    }

    if(newdata['charges'] !== oldata['charges']) {

        message += `<tr><th>Charges : </th><td>$<td>${newdata['charges']} </td> <td>${oldata['charges']}</td>`
    }

    if(newdata['total_beds'] !== oldata['total_beds']) {

        message += `<tr><th>Total Beds : </th><td>$<td>${newdata['total_beds']} </td> <td>${oldata['total_beds']}</td>`
    }

    if(newdata['number_of_technician'] !== oldata['number_of_technician']) {

        message += `<tr><th>Number Of Technician : </th><td>$<td>${newdata['number_of_technician']} </td> <td>${oldata['number_of_technician']}</td>`
    }

    if(newdata['dialysis_per_month'] !== oldata['dialysis_per_month']) {

        message += `<tr><th>Dialysis Per Month : </th><td>$<td>${newdata['dialysis_per_month']} </td> <td>${oldata['dialysis_per_month']}</td>`
    }

    if(newdata['doctor_availability'] !== oldata['doctor_availability']) {

        message += `<tr><th>Doctor Availability : </th><td>$<td>${newdata['doctor_availability']} </td> <td>${oldata['doctor_availability']}</td>`
    }

    if(newdata['sitting_area'] !== oldata['sitting_area']) {

        message += `<tr><th>Availability of sitting area for family members : </th><td>$<td>${newdata['sitting_area']} </td> <td>${oldata['sitting_area']}</td>`
    }

    if(newdata['availability_pharmancy'] !== oldata['availability_pharmancy']) {

        message += `<tr><th>Availability of Pharmacy nearby : </th><td>$<td>${newdata['availability_pharmancy']} </td> <td>${oldata['availability_pharmancy']}</td>`
    }

    if(newdata['insurance_billing_facility'] !== oldata['insurance_billing_facility']) {

        message += `<tr><th>Whether the centre has an insurance billing facility or not : </th><td>$<td>${newdata['insurance_billing_facility']} </td> <td>${oldata['insurance_billing_facility']}</td>`
    }

    if(newdata['life_saving_drug'] !== oldata['life_saving_drug']) {

        message += `<tr><th>Availability of life-saving drugs. : </th><td>$<td>${newdata['life_saving_drug']} </td> <td>${oldata['life_saving_drug']}</td>`
    }




  message += `</table>`
  console.log(message)
  centerUpdateMailSend("", oldata.email, "centre Profile Update","centre Profile Update", message)
  }

exports.centerUpdateOther = async (req, res) => {

}


exports.coordinatesUpdate = async (req,res)=>{
    try {
        var coordinates = req.body.coordinates;
        var _id = req.params.id;
        await centerModel.updateOne({_id},{$set:{"location.coordinates":coordinates}})
        await centerModel.createIndexes({location: '2dsphere' })
        return res.status(200).json({message:"update"})
    } catch (error) {
        return res.status(500).json({error})
    }
}


exports.centerTimeUpdate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
        var _id =   req.body;
        var id = req.params.id;
        let payload = req.body;
            let options ={
                day:payload.day,
                opening_time:payload.opening_time,
                closing_time:payload.closing_time
            }
            console.log(id)
            console.log(options,':update')
          await centerModel.findOneAndUpdate({ 'times._id': id }, { '$set': { 'times.$': payload } }).catch(err=>{
            res.status(500).json({
                error: err
            })
          })
           return  res.status(200).json({message:"center time update"})
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}



exports.centerAllList = async(req,res)=>{
    try {
        let filter = {
            select:'times'
        }
        const data = await centerModel.find().populate(filter);
        return res.status(200).json({data:data})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}

exports.centerTimeAdd = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
        var _id = req.centerId;
        var payload = req.body;
        const data = await centerModel.findOneAndUpdate({'_id': req.params.id},{$push:{times:payload}});
        console.log(data)
        return res.status(200).json({message:"done"})
    }


   
  } catch (error) {
      return res.status(500).json({error:error})
  }


    // try {
    //     // var id = req.params.id;
    //     if() {

    //     }
    //     else 
    //     var id = req.centerId? req.centerId:req.params.id;
    //     var payload = req.body;
    //     console.log(req.centerId)
    //     console.log(id,'----------------add -----------')
    //     console.log(payload)
    //     centerModel.findOneAndUpdate({_id: id}, {$push:{times:{day:payload.day,opening_time:payload.opening_time,closing_time:payload.closing_time}}},(error,result)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     return res.status(200).json({message:"update"})
    
    // });
    // } catch (error) {
    //     res.status(500).json({
    //         error: error
    //     })
    // }
}

exports.centerTimeDelete = async (req, res) => {
    try {
        var id = req.centerId? req.centerId:req.params.id;
        // var id = req.params.id;
        var slot_id = req.params.slot
        console.log(typeof(slot_id),'type')
        console.log(typeof(id),'typeid')
        console.log(slot_id,'jjjjj')
        console.log(id,'----------------add -----------')
       

        await centerModel.findOneAndUpdate(
            { _id: id },
            { $pull: { times: { _id: slot_id } } },
            { safe: true, multi: false }
          );


       
        //   let options = {
        //       center_id: id,
        //       message: "Center time is upload by bookcare",
        //       date: moment().format('DD/MM/YYYY H:i:s')
        //   };
        //   await add(notificationModel, options);



        // const user = await centerModel.findByIdAndUpdate({_id:_id},{time});
        // user.times.$pull({ _id: slot_id });

    // centerModel.findOneAndUpdate({_id: id}, {$pop:{times:{_id:slot_id}}},(error,result)=>{
    //     if(error){
    //         console.log(error)
    //     }
        return res.status(200).json({message:"delete"})
    // });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}

exports.centerTimedDetails = async (req, res) => {
    try {
        var _id = req.centerId? req.centerId:req.params.id;
        // var _id = req.params.id;
       
        const data  = await centerModel.findOne({_id:_id}).select('times')
        return res.status(200).json({
            data:data
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}






let appointmentSlots = async () =>{
    return new Promise(async(resolve,reject)=>{
        try {
            centerModel.find((err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res[3])
            });
        } catch (error) {
            reject(error)
        }
    })
}



// async function functionName(){
//      try {
//          var data = await appointmentSlots();
//          var length = data.times.length;

//          var _id = await data._id;
//          var time = data.times
//          var list = [];
//          var day =[]
//          console.log(time)
//          for(var i =0; i <length;i++){
//             if(!day.includes(time[i].day)){
//                 var options = {
//                    center_id:time[i]._id,
//                    day:time[i].day,
//                    appointment_time:[
//                        {
//                            start_time:time[i].opening_time,
//                            end_time:time[i].closing_time
//                        }
//                    ]
   
//                 }
   
//                 list.push(options)
//                 day.push(time[i].push);
//             }

//          }
//          console.log(options)
//      } catch (error) {
//          if(error) throw error
//      }

// }
// functionName()



exports.centerLogin = async (req,res) =>{
    try {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
            let payload = req.body
            const user = await (await userModel.findOne({ email: payload.email.trim() ,UserType:'center'}));
            console.log(user,'---------')
            if (!user) {
                // {
                //     "value": "",
                //     "msg": "This field is required",
                //     "param": "password",
                //     "location": "body"
                // }
                return res.status(423).json({ error: "user not match" })
            }
            else {
                const center = await (await centerModel.findOne({ _id: user.center_id}));

               let  userDetails = {
                    userId: user._id,
                    name: center.name,
                    email: user.email,
                    centerId: user.center_id,
                    centerName : center.name
                 
                }
                console.log('kjhgfghj')
                const password =  passwordHash.verify(payload.password, user.password);
                console.log(password)
                if (password === true) {

                    
                //    await userModel.updateOne({ _id: user._id ,UserType:'center'} ,{fcm_token : payload.fcm_token});
                   await userModel.updateOne({ _id: user._id ,UserType:'center'} ,{$push:{fcm_token:{token : payload.fcm_token}}});

                    var token = await jwtToken.sign(userDetails, process.env.JWT_SECREATE_kEY, { expiresIn: '86765m' });
                    var refreshToken = randtoken.uid(256);
                    refreshTokens[refreshToken] = user.email;
                    // access token and refresh token
                    return res.status(200).json({
                        accessToken: token,
                        refreshToken: refreshToken
                    });
                }
                else {
            
                    return res.status(423).json({
                        error: "check email and password"
                    })
                }
            }
        }
    }  catch (error) {
        console.log(error)
        return res.status(500).json({
            error:error
        })
    }
}


exports.centerProfile = async (req,res) =>{
    try {
        console.log(req.activeUser.userId,'------------------------------------------------------------')
        const data = await centerModel.findOne({_id:req.centerId}).catch(err=>{
            return res.status(500).json({error:error})
        });
      return  res.status(200).json({data:data})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}





exports.CenterDocumentsUpload1 = async (req,res)=>{
    try {
         let img = req.body.img;
         console.log(img)
         let base64data = img.toString('base64');
         res.send(base64data)

    } catch (error) {
        return res.status(500).json({error:error})
    }
}


// async function demo1 () {
// return new Promise((resolve,reject)=>{
//    resolve( setTimeout(()=>{
//     pdfConvert()
//    },200))
// })
// }


exports.centerTimeCreate =async (req,res)=>{
    try {
          const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
        var _id = req.centerId;
        var payload = req.body;
        const data = await centerModel.findOneAndUpdate({'_id': _id},{$push:{times:payload}});
        console.log(data)
        return res.status(200).json({message:"done"})
    }
    } catch (error) {
        return res.status(500).json({error:error})
    }
}
// const uploadPdf = require('../')

exports.CenterDocumentsUpload = async (req,res,next)=>{
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     res.status(422).json({
        //         message: errors.msg,
        //         errors: errors.errors
        //     });
        // }
        // else{
       console.log('lkjhgf',req.body)
        let file = req.file;
        let payload = req.body;
        
        if(!payload.document) {
            return res.status(422).json({error:"Document is required"});
        }
       
        if(!payload.title){
            return res.status(422).json({error:"Title is required"});
        }
        // var documentTypeId_check = await center_documentsCategoryModel.findOne({_id:payload.document_typeId});
        // if(!documentTypeId_check){
        //     return res.status(422).json({error:"invalid document type id"});
        // }
        // var unique_document= await centerDocumentsModel.findOne({document_typeId}) 
        let centerId = req.centerId;
        // console.log(file,':======')
        // var pdf = file.filename.split('.')
        let options = {
            centerId:centerId,
            document_typeId:payload.title,
            // document:file.filename,
            // uploaded_type:pdf[1]
        }
        console.log(options)
        if(req.body.document) {
            options['document'] = uploadBase64Image(req.body.document, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
            // payload['fileName'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
        }
    
        await centerDocumentsModel.create(options).catch(err=>{
            return res.status(500).json({error:err})
        })
            // await add(centerDocumentsModel,options);

        
            return res.status(200).json({message:"document upload"})
        // }
    // }
    } catch (error) {
        console.log("upload document error---------------", error)
    
        return res.status(500).json({error:error})
    }
}
exports.CenterDocumentsUploadDetails = async (req,res) =>{
    try {
        let id = req.params.id;
        
        const data = await centerDocumentsModel.find({_id:id,userId:req.centerId});
        return res.status(200).json({data:data})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.CenterPdfDocumentsUpload = async(req,res) =>{
    try {
    //     const { filename } =  req.file;
    //    const {title} = req.body;
    //     if(!req.file){
    //         return res.status(422).json({error:"Only .pdf format allowed!"})
    //     }
    //     let options = {
    //         centerId:req.centerId,
    //         title:title,
    //         document:filename
    //     }
    //     await add(centerDocumentsModel,options);
    //     return res.status(200).json({message:"upload pdf"})
    console.log('lkjhgf')
    let file = req.file;
    let payload = req.body;
   console.log(req)
    if(!req.body.document) {
        return res.status(422).json({error:"Document1 is required"})
    }
    if(!req.body.title){
        return res.status(422).json({error:"title is required"})
    }
    let centerId = req.centerId;
    // console.log(file,':======')
    // // ImageValidate(req,res,next)
    // var pdf = file.filename.split('.')
    // payload['document'] = pdf[0]+'.pdf'

    if(req.body.document) {
        payload['document'] = uploadBase64Image(req.body.document, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
        // payload['fileName'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
    }




    let options = {
        centerId:centerId,
        title:payload.title,
        document:payload.document,
        // document:file.filename
    }
        // await  pdfConvert()
        await add(centerDocumentsModel,options);
    
        return res.status(200).json({message:"document upload"})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}
// exports.CenterDocumentsUpload = async (req,res,next)=>{
//     try {
//         let payload = req.body;
//         const file = req.files.myFile;
//          await imgUpload.imageUpload(req);
//          var pdf = file.name.split('.');
//              payload['centerId'] = req.centerId;
//              payload['document'] = pdf[0]+'.pdf';
             
//              add(centerDocumentsModel,payload).catch(err=>{
//                      return res.status(500).json({error:err})
 
//              })
//              return res.send({ status: "success", path: demo });
//     } catch (error) {
        
//         return res.status(500).json({error:'error'})
//     }
// }


exports.centerDocumentList = async (req,res) =>{
    try {
        var query = req.query;
        const data = await centerDocumentsModel.find().populate('document_typeId')
        return res.status(200).json({data:data})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.centerDocumentCheck = async( req,res) =>{
    try {
        
        const data = await centerDocumentsModel.findOne({document_typeId:req.params.id});
        var temp = data? true:false
        return res.status(200).json({data:temp})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}
exports.centerDocumentCheck1 = async( req,res) =>{
    try {
        var temp;
        const check1 = await centerDocumentCategory.find()
        const data = await centerDocumentsModel.findOne({document_typeId:req.params.id});
        // for(var i=0;i<data.length;i++){
        // console.log(data[i]);
        // }

        return res.status(200).json({data:temp,check:check1})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.centerDocumentDelete = async (req,res) =>{
    try {
        var id = req.params.id;
        await permanentRemove(centerDocumentsModel,id)
        return res.status(200).json({meassage:"delete document"})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.centerProfileEdit = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
         console.log(req.body)
         var payload = req.body
         if(req.body.image) {
            payload['primaryImage'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
            // payload['fileName'] = uploadBase64Image(req.body.image, "upload/images/", moment().format('DDMMYYhhiiss')+"image")
        }

        var center = centerModel.findOne({_id:req.centerId?req.centerId:req.params.id})

         await centerModel.updateOne({_id:req.centerId?req.centerId:req.params.id},payload,{upsert:true});

         if(req.params.id) {
            updateMail(center, payload, center.email)

         }
         return res.status(200).json({message:"update profile"})
        }
    } catch (error) {
        return res.status(500).json({error:error})
    }
}


exports.centerDocumentCategory = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else{
        const {title}= req.body;
        await add(centerDocumentCategory,{title:title});
        return res.status(200).json({message:"create document category "})
        }
    } catch (error) {
        return res.status(200).json({error:error})
    }
}
exports.centerDocumentCategoryDelete = async(req,res) =>{
    try {
        var id = req.params.id
        await remove(centerDocumentCategory,{id:id});
        return res.status(200).json({message:"delete document category "})
    } catch (error) {
        return res.status(200).json({error:error})
    }
}
exports.centerDocumentCategoryupdate = async(req,res) =>{

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors
            });
        }
        else{
        var id = req.params.id
        const {title}= req.body;
        await edit(centerDocumentCategory,id,{title:title});
        return res.status(200).json({message:"update document category "})
        }
    } catch (error) {
        return res.status(200).json({error:error})
    }
}
exports.centerDocumentCategoryDetails = async(req,res) =>{
    try {
        var id = req.params.id
        var data =  await centerDocumentCategory.findOne({_id:id})
        return res.status(200).json({data:data})
    } catch (error) {
        return res.status(200).json({error:error})
    }
}
exports.centerDocumentCategoryList = async(req,res) =>{
    try {
       var temp = [];
        var data = await centerDocumentCategory.find({isRemoved:true});
        for(var i=0;i<data.length;i++){
            var check = await centerDocumentsModel.findOne({centerId:req.centerId,document_typeId:data[i]._id})
            temp.push({_id : data[i]._id, "title" : data[i].title, "check" :check })
        }
        return res.status(200).json({data:temp})
    } catch (error) {
        return res.status(200).json({error:error})
    }
}

exports.uploadGallery = async(req,res) =>{
    try {
        let payload = req.body;
        // console.log(payload);
        var temp ={}
        let images = payload.images;
        console.log(image.lenght, "image")
        let imageData = [];
        for(var i=0;i<images.length;i++){
            var image =  await uploadBase64Image(images[i], "upload/image/", "center_"+moment().format('DDMMYYhhiiss')+i+req.centerId)
            imageData.push({'image' : image});

        }
        console.log(imageData);
        await centerModel.updateOne({_id:req.centerId},{$push:{images:imageData}})
        return res.status(200).json({data:"test"})
    } catch (error) {
        return res.status(200).json({error:error})
    }
}




// exports.viewAllCenterDetails = async (req,res) =>{
//     try {
//         const data = await userModel.find({UserType:"center"})
//         console.log(data);
//         return res.status(200).json({data})
//     } catch (error) {
//         return res.status(500).json({error})
//     }
// }


// function demo (){
//     pdfConvert()
// }

//Pipe its output somewhere, like to a file or HTTP response 
//See below for browser usage 
// const path = require('./upload/images')
// console.log(path)
// fs.readdir("./img", function(err, files) {
//     if (err) throw err;
//     var results = [];

//     files.forEach(function(file) {
//         var dot = file.lastIndexOf(".") + 1,
//             ext = file.substr(dot, file.length),
//             fmt = ["jpg", "png", "gif"];

//         if (fmt.indexOf(ext) > -1)
//                results.push(file);
//         }
  

//     showImages(results);

// })