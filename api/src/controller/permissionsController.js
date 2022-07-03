
const permissionModel = require('../model/permissionsModel');
const response = require('../utilities/responseStructure');
const {add} = require('../service/mongoServices')


exports.createPermission = async (req,res) =>{
    try {
        var rs = await response(req.method);
        let payload = req.body;
        let options  = {
            name:payload.name
        }
        await add(permissionModel,options);
        res.status(rs.status).json({
            message:"create permission"
        })

    } catch (error) {
        res.status(rs.status).json({
            error:error
        })
    }
}
