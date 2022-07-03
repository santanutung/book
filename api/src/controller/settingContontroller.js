const settingModel = require('../model/setting.Model');




// exports.addSetting = async (req,res) =>{
//     let payload = req.body;
  
//     let options= {
//       type:payload.type,
//       description:payload.description
//     }
//    const settingType = await  settingModel.findOne({type:payload.type});
//    if(settingType){
//      await settingModel.updateOne({type:payload.type},req.body);
//      return res.status(200).json({messgae:`add ${payload.type} setting`});
//    }
//    else{

//      const newData = new settingModel(options);
//      await newData.save();
     
//      return res.status(200).json({messgae:`add ${payload.type} setting`})
//    }
// }


// app.post('/private/setting' , async (req , res)=>{
exports.addSetting = async (req,res) =>{
    let payload = req.body;
  
    let options= {
      type:payload.type,
      description:payload.description
    }
   const settingType = await  settingModel.findOne({type:payload.type});
   if(settingType){
     await settingModel.updateOne({type:payload.type},req.body);
     return res.status(200).json({messgae:`add ${payload.type} setting`});
   }
   else{

     const newData = new settingModel(options);
     await newData.save();
     
     return res.status(200).json({messgae:`add ${payload.type} setting`})
   }
  
  };
  
  
//   app.get('/private/setting/:type' ,async (req , res)=>{
  exports.settingTypes = async (req,res) =>{
     var type =  req.params.type;
     const settingType = await  settingModel.findOne({type:type}).catch(err=>{
       res.status(500).json({error:err})
     });
     return res.status(200).json({data:settingType})
  
  }

//   app.get('/setting/:type' ,async (req , res)=>{
exports.settingClientType = async (req,res) =>{
     var type =  req.params.type;
     const settingType = await  settingModel.findOne({type:type}).catch(err=>{
       res.status(500).json({error:err})
     });
     return res.status(200).json({data:settingType})
  
  }