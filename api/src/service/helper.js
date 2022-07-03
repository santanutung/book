
PDFDocument = require('pdfkit');
var jwt = require('jsonwebtoken');
var PDFDocument = require('pdfkit');
fs = require('fs');
doc = new PDFDocument
const htmlPdf = require('html-pdf');
// const PSPDFKit = require('pspdfkit')
// const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const userModel = require('../model/userModel');
const mailSend = require('../config/emailService')
const centerModel = require('../model/centers.Model');
const axois = require('axios');

require('dotenv').config();



let email_send =  (id, subject, message) =>{
    return new Promise(async(resolve,reject)=>{
      try {
          const user = await userModel.findOne({_id:id});
          console.log(user, "mail user----------------------------")
          if(!user){
              reject("try again")
          }
          if(user.email) {
          var resgisteration_no = user.resgisteration_no ? user.resgisteration_no : user.name
          await mailSend.mail_send(resgisteration_no, user.email,subject,"any",message)
          }
          resolve(true)
      } catch (error) {
          reject(error)
      }
    })
}


let sendEnquiryMail =  (name, email, subject, message) =>{
    return new Promise(async(resolve,reject)=>{
      try {
        if(email) {
          await mailSend.mail_send(name, email,subject,"any",message)
        }
          resolve(true)
      } catch (error) {
          reject(error)
      }
    })
}

let userEnquiryMail =  (name, email, subject, message) =>{
    return new Promise(async(resolve,reject)=>{
      try {

        console.log("send-mail------------------")
        if(email) {
          await mailSend.userEnquiryMail(name, email,subject,"any",message)
        }
          resolve(true)
      } catch (error) {
          reject(error)
      }
    })
}

let centerEmailSend =  (id, subject, message) =>{
    return new Promise(async(resolve,reject)=>{
      try {
          const center = await centerModel.findOne({_id:id});
        //   console.log(user, "mail user----------------------------")
          if(!center){
              reject("try again")
          }
          if(center.email) {
        //   var resgisteration_no = user.resgisteration_no ? user.resgisteration_no : user.name
          await mailSend.centerMailSend(center, center.email,subject,"any",message)
          }
          resolve(true)
      } catch (error) {
          reject(error)
      }
    })
}







// let pdfConvert = async () =>{
//     return new Promise((resolve,reject)=>{
//         try {
            
                   
//             fs.readdir('./upload/pdfconvert',async(err,files)=>{
//                 if (err) throw err;
//                 var results = [];

//                 console.log(files)
//                 console.log(files.length);
            
//                  doc.image('./upload/pdfconvert/'+files[0], {
//                     fit: [300, 400],
//                     align: 'center',
//                     valign: 'center'
//                 });
//                 var temp = files[0];
//                 var pdf = temp.split('.')
//                 doc.pipe(fs.createWriteStream('./upload/pdf/'+pdf[0]+'.pdf')); 
//                 doc.end();
              
//                 resolve(true)
//                     })


//         } catch (error) {
//             reject(error)
//         }
//     })
// }




// let pdfConvert = () =>{
//   return new Promise((resolve,reject)=>{
//     fs.readdir('./upload/pdfconvert',(err,files)=>{
//          if(err){
//              reject(err)
//          }
//         var temp = files[0];
//         var pdf = temp.split('.')
//         var pdfDoc = new PDFDocument;
//         pdfDoc.pipe(fs.createWriteStream('./upload/pdf/'+pdf[0]+'.pdf'));
//         pdfDoc.image('./upload/pdfconvert/'+files[0], { fit: [300, 400] ,align: 'center',  valign: 'center'});

//         pdfDoc.end();
//         fs.unlinkSync('./upload/pdfconvert/'+files[0])
//         resolve(true)
    
//             })
//   })

// }

let pdfConvert = () =>{
 
      fs.readdir('./upload/pdfconvert',(err,files)=>{
         if(err){
             reject(err)
         }
        var temp = files[0];
        var pdf = temp.split('.')
        var pdfDoc = new PDFDocument;
        console.log('--------------')
        pdfDoc.pipe(fs.createWriteStream('./upload/pdf/'+pdf[0]+'.pdf'));

        pdfDoc.image('./upload/pdfconvert/'+files[0], { fit: [300, 400] ,align: 'center',  valign: 'center'});
        pdfDoc.end();
        fs.unlinkSync('./upload/pdfconvert/'+files[0])
    
      })

}



let ImageValidate = (req,res,next) =>{
  imageType = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/bmp',
]
if(!imageType.includes(req.file.mimetype)){
return res.status(422).json({error:'kjsdj'});
}
else{
    next()
}
}






function randomNumber(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
} 
  

function jwtDecoder(req,res){
  try {
       var bearer = req.headers.authentication.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
        return decode
   
  } catch (error) {
      res.status(401).json({
          status:401,
          message:"Failed to authenticate token."
      }) 
  }
}



async function pushNotification (user_id, message) {


    try {

        var user = await userModel.findOne({center_id :user_id}).distinct('fcm_token.token')
       
        const config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            data:{
                "notification":{
                    "title":message
                },
                "registration_ids":user},
            headers:{
                "Authorization": "key=AAAAq_Kr-y8:APA91bHBsUbgIPVpMGjM6h8jD1EZynQpuHuAXk8yTrqDP_lE2oknL9Rggt5pTUMa0_Bm8TCY8vPE81wBT_mJYTSGqkFXGCvrCzlBOddUYNeUZ4wFi5nUuSChsfnN03fwZZ_q88VuaClq"
    
            }
        }
    
            const data = await axois(config);
            console.log(data);
        } catch (error) {
            console.log(error);
        }



//     try {
       
//         var user = userModel.findOne(user_id)

//         var notification ={
//             'title':title,
//             'text':message
//         }
       
//         var notification_key ={
//             'notification':notification,
//             'registration_ids':[user.fcm_token]
//         }
//         console.log(notification_key,'send')
//         await axios.post('https://httpbin.org/post', notification_key, {
//             headers: {
//                 // 'application/json' is the modern content-type for JSON, but some
//                 // older servers may use 'text/json'.
//                 // See: http://bit.ly/text-json
//                 'Authorization':`key=${process.env.firebase_msg_key}`,
//                 'content-type': 'text/json'
//             }
//             }).then(res=>{
//                 console.log("send :");
//             }).catch(err=>{
//                 console.log("err");
//             })
//     } catch (error) {
//         if (error) throw error
// }
}


module.exports = {pdfConvert,ImageValidate,email_send, sendEnquiryMail, centerEmailSend, userEnquiryMail, randomNumber, jwtDecoder, pushNotification}


