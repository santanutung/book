var jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports  =  (req,res,next)=>{
  try {
       var bearer = req.headers.authentication.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
        req.activeUser=decode
        console.log(decode,"user Token");
      next()
  } catch (error) {
      res.status(401).json({
          status:401,
          message:"Failed to authenticate token."
      }) 
  }
}
