const conterModel = require('../model/centers.Model');
const {validationResult} = require('express-validator');
const {base64toImage} = require('../utilities/base64toImage');
const moment = require('moment')

exports.updateImages = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
           const images = req.body.images;
           const _id = req.params.centerId? req.params.centerId : req.centerId;
           const payload = req.body;
            // console.log(images);
           var center =  await conterModel.findOne({_id:_id})

            var image = ''
           for(var i=0;i<images.length;i++){
            payload.images[i].image = await base64toImage(images[i].image, "upload/images/", moment().format('DDMMYYhhiiss') + i+_id + "image")
            payload.images[i].is_primary =images[i].is_primary
            if (images[i].is_primary == 1) {
              image =  payload.images[i].image
            }
           }
           console.log(payload,"????????/");
          
           for(var i = 0; i < center.images.length; i++) {
             if(image != '') {

               center.images[i]['is_primary'] = 0; 
             }
             payload.images.push(center.images[i])
           }

           if (image == '') {
            image = center.primaryImage
           }
      
           await conterModel.updateOne({_id:_id},{primaryImage:image,"$set":{"images":images}})
           return res.status(200).json({images})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

exports.deleteImage = async (req,res) =>{
    try {
      var _id = req.params.centerId? req.params.centerId : req.centerId;
      var imageId = req.params.imageId;
      await conterModel.updateOne({_id:_id},{$pull:{"images":{_id:imageId}}});
      return res.status(200).json({message:"delete image"})
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }


  exports.updateImage = async (req,res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
      var _id = req.params.centerId? req.params.centerId : req.centerId;
      var imageId = req.params.imageId;
      const payload = req.body;
      let option = {
        image:await base64toImage(payload.image, "upload/", moment().format('DDMMYYhhiiss') +1 + "image"),
        // image:payload.image,
        is_primary:payload.is_primary
      }
      console.log(option);
      await conterModel.updateOne({_id:_id},{$push:{images:option}});
      res.status(200).json({message:"update"})
    }
    } catch (error) {
        console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  exports.centerGallery = async(req,res) => {
   
    try {
      const _id= req.centerId?req.centerId : req.params.centerId;
      const data = await conterModel.findOne({_id}).select('images');
      return res.status(200).json({data})
  } catch (error) {
      return res.status(500).json({error})
  }

}

exports.updatePrimaryImages = async(req, res) => {
   
  try {

           const _id = req.centerId ? req.centerId : req.params.centerId;
           const payload = req.body;
            console.log(_id, 'center id');
           var center =  await conterModel.findOne({_id:_id})
            console.log(center)
            var image = ''
            var images = []
           console.log(payload,"????????/");
          
           for(var i = 0; i < center.images.length; i++) {
             if(center.images[i]._id == req.query.key) {

               center.images[i]['is_primary'] = 1; 
               image = center.images[i]['image']
             }
             else {
              center.images[i]['is_primary'] = 0; 
             }
             images.push(center.images[i])
           }

           if (image == '') {
            image = center.primaryImage
           }
      
           await conterModel.updateOne({_id:_id},{primaryImage:image,"$set":{"images":images}})
           return res.status(200).json({images})
} catch (error) {
  console.log(error)
    return res.status(500).json({error})
}

}
