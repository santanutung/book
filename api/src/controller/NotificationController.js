
const notificationModel = require('../model/NotificationModel');
const { listPaginate } = require('../service/mongoServices');


exports.getNotifications = async (req,res) =>{
    try {
      
        const data = await notificationModel.find({center_id:req.centerId, type:'center'}).sort({createdAt:-1})
        const unreadNotification = await notificationModel.find({center_id:req.centerId, isRead : false}).sort({createdAt:-1})
        return res.status(200).json({data:data, unreadNotification:unreadNotification})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}

exports.getAdminNotifications = async (req,res) =>{
    try {
      
        const data = await notificationModel.find({type:'admin'}).sort({createdAt:-1})
        const unreadNotification = await notificationModel.find({type:'admin', isRead : false}).sort({createdAt:-1})
        return res.status(200).json({data:data, unreadNotification:unreadNotification})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}

exports.getAdminNotificationsRead = async (req,res) =>{
    try {
      
        if (req.query.id) {
            await notificationModel.updateMany({type:'admin', _id:req.query.id}, {isRead:true})

        }
        else {

            await notificationModel.updateMany({type:'admin'}, {isRead:true})
        }
        return res.status(200).json({message : "mark read all"})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}




exports.getUserNotifications = async (req,res) =>{
    try {
       var  querys = {user_id:req.activeUser.userId}
        const { page, limit } = req.query;
        var options = {
            // select: 'title icon parentId',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 1,
            sort : {createdAt:-1}
        };

        var data = await listPaginate(notificationModel, querys, options);

        // const data = await notificationModel.find({user_id:req.activeUser.userId}).limit(options.limit).skip((parseInt(options.page)-1) * options.limit).sort({createdAt:-1})
        const unreadNotification = await notificationModel.find({user_id:req.activeUser.userId, isRead : false}).sort({createdAt:-1})
        return res.status(200).json({data:data, unreadNotification:unreadNotification})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error})
    }
}

