var jwt = require('jsonwebtoken');
const centerModel = require('../model/centers.Model');
const userModel = require('../model/userModel')
require('dotenv').config();
var superadmin= "superadmin"
module.exports  =  (req,res,next)=>{
  try {
       var bearer = req.headers.authentication.split(" ");
       //console.log(bearer)
        token = bearer[1];
        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
        req.activeUser=decode;
        userModel.findOne({_id:decode.userId,UserType:superadmin},(err,result)=>{
            if(err){
                return  res.status(401).json({
                    status:401,
                    message:"Failed to authenticate token."
                }) 
            }
            else{
              if(result){
                  console.log(result);
                  req.userId = result._id;
                  next()
              }
              else{
                return  res.status(401).json({
                    status:401,
                    message:"not permissions admin routes"
                })
              }
          
            }
        })

  } catch (error) {
      res.status(401).json({
          status:401,
          message:"Failed to authenticate token."
      }) 
  }
}
