const UserModel = require('../model/userModel');
const { add } = require('../service/mongoServices');
// const { hashPassword } = require('../utilities/bcrypt');
const { getList, getListFilter, getListSearch, getSearch } = require('../service/mongoServices');
const userModel = require('../model/userModel');
var select = 'name email phone profile_photo_path'
var passwordHash = require('password-hash');
const { uploadBase64Image } = require('../utilities/base64toString');
// const { default: Moment } = require('react-moment');
const moment = require("moment");

exports.resgiter = async (req, res) => {
    try {
        let payload = req.body;
        let haspassword =await passwordHash.generate(payload.password);

        
            var options = {
                name: payload.name,
                email: payload.email,
                password: haspassword,
                phone: payload.contact_no,
                UserType: 'employee'
            }
            if (req.body.profile_photo_path) {
                payload['profile_photo_path'] = await uploadBase64Image(req.body.profile_photo_path, "upload/image/", "user_" + moment().format('DDMMYYhhiiss'))

            }


            await add(UserModel, options).catch(error => {
                res.status(500).json({ error: error })
            });
            res.status(200).json({
                messsage: "employ register"
            })
       
         

    } catch (error) {
        console.log(error, "---------------------------");
        res.status(500).json({
            error: error
        })
    }
}
exports.employeeList = async (req, res) => {
    try {
        let query = req.query;
        console.log(query);
        if (!query.page && !query.limit) {
            var data = await UserModel.find({ UserType: 'employee' }).select(select)
            return res.status(200).json({
                data: data
            })
        }
        else {
            var data = await getListFilter(UserModel, query, { UserType: 'employee' }, select);

            res.status(200).json({
                data: data
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

exports.employeeUpdate = async (req, res) => {
    try {
        var _id = req.params.id;
        let payload = req.body;

            if (req.body.profile_photo_path) {
                payload['profile_photo_path'] = await uploadBase64Image(req.body.profile_photo_path, "upload/image/", "user_" + moment().format('DDMMYYhhiiss'))

            }


            if(payload.password && payload.password != '') {
                payload['password'] =await passwordHash.generate(payload.password);
            }
            await UserModel.findOneAndUpdate({ _id: _id }, payload, { upsert: true });
            return res.status(200).json({ message: "update" })
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}
exports.employeeDetails = async (req, res) => {
    try {
        var _id = req.params.id;

        const data = await userModel.findOne({ _id: _id }).select(select)
        res.status(200).json({ data: data })

    } catch (error) {
        res.status(500).json({ error: error })
    }
}

exports.employeeDelete = async (req, res) => {
    try {
        var _id = req.params.id;
        await userModel.findOneAndDelete({ _id: _id })
      return  res.status(200).json({ message: "delete employee" })

    } catch (error) {
       return res.status(500).json({ error: error })
    }
}

exports.employeeFilter = async (req, res) => {
    try {
        var query = req.query;
        var email = { email: { $regex: query.email } };
        var name = { name: { $regex: query.name } }
        if (query.email) {
            var data = await getSearch(UserModel, { UserType: 'employee' }, query, select, email);
            return res.status(200).json({ data: data })
        }
        else {
            var data = await getSearch(UserModel, { UserType: 'employee' }, query, select, name)
            return res.status(200).json({ data: data })

        }

    } catch (error) {
        res.status(500).json({ error: error })
    }
}