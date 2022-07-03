var jwt = require('jsonwebtoken');
const centerModel = require('../model/centers.Model');
const userModel = require('../model/userModel')
require('dotenv').config();
var center = "center";
module.exports  =  (req,res,next)=>{
  try {
       var bearer = req.headers.authentication.split(" ");
       //console.log(bearer)
        token = bearer[1];
        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
        req.activeUser=decode;
        userModel.findOne({_id:decode.userId,UserType:center},(err,result)=>{
            if(err){
                return  res.status(401).json({
                    status:401,
                    message:"Failed to authenticate token."
                }) 
            }
            else{
                if(!result){
                    return  res.status(401).json({
                        status:401,
                        message:"Failed to authenticate token."
                    })
                }
                console.log(result,'token')
                req.centerId = result.center_id;
                next()
            }
        })

  } catch (error) {
      res.status(401).json({
          status:401,
          message:"Failed to authenticate token."
      }) 
  }
}
