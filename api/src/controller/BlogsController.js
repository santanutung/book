const blogModel = require('../model/BlogModel');
const { uploadBase64Image } = require('../utilities/base64toString');
const { validationResult } = require('express-validator');
const moment = require('moment')
exports.add = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
        const payload = req.body;
        let options ={
            title:payload.title,
            description:payload.description,
            short_description:payload.short_description,
            status:payload.status,
          
        }

        if (payload.image) {
            options['image'] = await uploadBase64Image(req.body.image, "upload/image/", "blog_" + moment().format('DDMMYYhhiiss'))

        }
       
        console.log(payload)

       
        const newData = new blogModel(options);
        await newData.save();
        
        res.status(200).json({messgae:"create", newData})
        }
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}

exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json(errors);
        }
        else{
        const payload = req.body;
        // console.log(payload, "payload")
        let options ={
            title:payload.title,
            description:payload.description,
            short_description:payload.short_description,
            status:payload.status,
          
        }

        if (payload.image) {
            options['image'] = await uploadBase64Image(req.body.image, "upload/image/", "blog_" + moment().format('DDMMYYhhiiss'))

        }
        // console.log(options)
       
        await blogModel.updateOne({_id:req.params.id},options);
        
        res.status(200).json({messgae:"updated"})
        }
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.index = async (req, res) => {
    try {
      
        var data = await blogModel.find().sort({_id:-1});
        
        res.status(200).json({data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.get = async (req, res) => {
    try {
      
        var data = await blogModel.findOne({_id:req.params.id});
        
        res.status(200).json({data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}

exports.delete = async (req, res) => {
    try {
      
        await blogModel.deleteOne({_id:req.params.id});
        
        res.status(200).json({message : 'delete'})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}



exports.activeBlogs = async (req, res) => {
    try {
      
        var data = await blogModel.find({'status' : 'enabled'}).sort({_id:-1});
        
        res.status(200).json({data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}


exports.getActiveBlog = async (req, res) => {
    try {
      
        var data = await blogModel.findOne({_id:req.params.id, 'status' : 'enabled'});
        
        res.status(200).json({data})
    } catch (error) {
        console.log(error, "enquiry-------------------");
        return res.status(500).json({error})
    }
}