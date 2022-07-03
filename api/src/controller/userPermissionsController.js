const user_permissions = require('../model/permissionsModel');
const {add} = require('../service/mongoServices')

exports.createPermission = async (req,res) =>{
    try {
        let payload = req.body;
        console.log(payload)
        // let options = {}
        // options[user_id] = payload.user_id;
        // options[permission_id] = payload.permission_id;
        // await add(user_permissions,options);
         res.json({
             message:"create"
         })
    } catch (error) {
        res.json({
            error:error
        })
    }
}