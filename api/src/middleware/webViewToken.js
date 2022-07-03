var jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports  =  (req,res,next)=>{
  try {
       var test = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWMwMjI3NGMxZjc0Nzg3MWM4YWM5MDgiLCJlbWFpbCI6InNhZ2FyQGdtYWlsLmNvbSIsImlhdCI6MTY0MDA4NzExNCwiZXhwIjoxNjQ1MjkzMDE0fQ.Ha2BMEYSvFdEhMtCp2zqlEDuyI7Toy7UXiWgukrFVjc"
    //    var test = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWMwMjI3NGMxZjc0Nzg3MWM4YWM5MDgiLCJlbWFpbCI6InNhZ2FyQGdtYWlsLmNvbSIsImlhdCI6MTY0MDA4NzExNCwiZXhwIjoxNjQ1MjkzMDE0fQ.Ha2BMEYSvFdEhMtCp2zqlEDuyI7Toy7UXiWgukrFVjc"
       var bearer = test.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
        req.activeUser=decode
      next()
  } catch (error) {
      res.status(401).json({
          status:401,
          message:"Failed to authenticate token."
      }) 
  }
}
