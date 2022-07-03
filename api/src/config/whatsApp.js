require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.whatsappSMS = () =>{
    return new Promise((resolve,reject)=>{
        // try {
        //     client.messages
        //           .create({
        //              from: 'whatsapp:+15407923554',
        //              body: 'Hello there!',
        //              to: 'whatsapp:9675004434'
        //            },(err,res)=>{
        //                if(err){
        //                    reject(err)
        //                }
        //                resolve(res)
        //            })
        // } catch (error) {
        //     reject(error)
        // }
    })

}