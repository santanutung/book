exports.adminPermission = (req,res,next)=>{
    console.log(req.activeUser);
    var user = req.activeUser;
    if(user.UserType!="superAdmin"){
     return res.status(522).json({message:"not allow is route"})
    }   
}

exports.centerPermission = (req,res,next)=>{
    var user = req.activeUser;
    if(user.UserType !=="superAdmin"){
     return res.status(522).json({message:"not permission this route"})
    }   
    next()
}