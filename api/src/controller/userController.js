const userModel = require('../model/userModel');
//const bcrypt = require('../utilities/bcrypt');
const randtoken = require('rand-token');
//const bcrypts = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const { find, add } = require('../service/mongoServices');
const { response } = require('../utilities/responseStructure');
require('dotenv').config();
var refreshTokens = {}

const { validationResult } = require('express-validator');
var passwordHash = require('password-hash');
const { email_send, randomNumber, centerEmailSend } = require('../service/helper');




exports.login = async (req, res) => {
    try {
        var rs = await response(req.method);
        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error
            });
        }
        else {

            let payload = req.body

            const user = await userModel.findOne({ email: payload.email, UserType: {$in:['superadmin', 'employee']} });
            if (!user) {
                return res.status(422).json({ error: "Invalid Credentials" })
            }
            else {
                let userDetails = {
                    userId: user._id,
                    name: user.name,
                    email: user.email,

                }

                // const password = await bcrypts.compare(payload.password, user.password);
                const password = await passwordHash.verify(payload.password, user.password);
                if (password === true) {
                    var token = await jwtToken.sign(userDetails, process.env.JWT_SECREATE_kEY, { expiresIn: '86765m' });
                    var refreshToken = randtoken.uid(256);
                    refreshTokens[refreshToken] = user.email;
                    // access token and refresh token
                    return res.status(200).json({
                        accessToken: token,
                        refreshToken: refreshToken
                    });
                }
                else {

                    return res.status(422).json({
                        error: "check email and password"
                    })
                }
            }
        }

    } catch (error) {
        res.status(rs.status).json({
            error: error
        });
    }
}
exports.UserLogin = async (req, res) => {
    try {
        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error
            });
        }
        else {

            let payload = req.body

            const user = await userModel.findOne({ phone: payload.phone, userType:"patients" });
            if (!user) {
                return res.status(422).json({ error: "Invalid Credentials" })
            }
            else {
                let userDetails = {
                    userId: user._id,
                    name: user.name,
                    email: user.email,

                }
                // const password = await bcrypts.compare(payload.password, user.password);
                const password = await passwordHash.verify(payload.password, user.password);
                if (password === true) {
                    var token = await jwtToken.sign(userDetails, process.env.JWT_SECREATE_kEY, { expiresIn: '86765m' });
                    var refreshToken = randtoken.uid(256);
                    refreshTokens[refreshToken] = user.email;
                    // access token and refresh token
                    return res.status(200).json({
                        accessToken: token,
                        refreshToken: refreshToken
                    });
                }
                else {

                    return res.status(422).json({
                        error: "check phone and password"
                    })
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}
exports.userRefreshToken = async (req, res) => {
    try {
        var email = req.body.email;
        var refreshToken = req.body.refreshToken;
        if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken]) == email) {
            var user = {
                'email': email,
            }
            var token = await jwtToken.sign(user, process.env.JWT_SECREATE_kEY, { expiresIn: '86765m' });
            res.json({
                accessToken: token
            })
        }
        else {
            res.send(401)
        }
    } catch (error) {

    }
}
exports.register = async (req, res) => {
    try {
        var rs = await response(req.method);
        let payload = req.body;
        // let password = await  bcrypt.hashPassword(payload.password);
        let password = await passwordHash.generate(payload.password);
        let options = {
            name: payload.name,
            email: payload.email,
            password: password,
            profile_photo_path: payload.profile_photo_path,
            blood_group: payload.blood_group,
            phone: payload.phone,
            address: payload.address,
            dob: payload.dob,
            gender: payload.gender,
            center_id: payload.center_id
        };
        await add(userModel, options);
        return res.status(rs.status).json({
            message: "user register"
        });
    } catch (error) {
        res.status(rs.status).json({
            error: error
        });
    }
}

exports.userList = async (req, res, next) => {
    try {
        const result = await userModel.find()
        res.status(200).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}





//-------------------------------------------forgot password---------------------------------------------------




exports.forgotPasswordSendOTP = async (req, res) => {
    try {


        let payload = req.body
        console.log(payload)
        const user = await userModel.findOne({ phone: payload.phone, userType:'patients' });
        if (!user) {
            return res.status(422).json({ errors: [{ param: "phone", msg: "Invalid Credentials" }] })
        }
        else {
            var otp = randomNumber(1000, 9999)
            var data = await userModel.findOneAndUpdate({ _id: user._id }, { otp: otp });

            var subject = "Forgot Password mail";
            var message = `OTP is ${otp}`
            await email_send(user._id, subject, message)

            return res.status(200).json({ message: "OTP successfully send" })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }



}




exports.forgotPasswordVerifyOTP = async (req, res) => {
    try {


        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json(error);
        }
        else {
            let payload = req.body
            console.log(payload)
            const user = await userModel.findOne({ phone: payload.phone, otp: payload.otp, userType : 'patients' });
            if (!user) {
                return res.status(422).json({ errors: [{ param: "otp", msg: "Otp is invalid" }] })
            }
            else {
                let password = await passwordHash.generate(payload.password);

                var data = await userModel.findOneAndUpdate({ _id: user._id }, { otp: null, password: password });

                // var subject = "Forgot Password mail";
                // var message = "OTP is 1234"
                // await email_send(user._id, subject, message)

                return res.status(200).json({ message: "Password is successfully updated" })

            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }



}


//------------------------------------------end forgot password-----------------------------------------------

//------------------------------------------center forgot password--------------------------------------------

exports.centerForgotPasswordSendOTP = async (req, res) => {
    try {


        let payload = req.body
        console.log(payload)
        const center = await userModel.findOne({ phone: payload.phone, userType : 'center' }).populate('center_id');
        if (!center) {
            return res.status(422).json({ errors: [{ param: "phone", msg: "Invalid Credentials" }] })
        }
        else {
            var otp = randomNumber(1000, 9999)
            var data = await userModel.findOneAndUpdate({ _id: center._id }, { otp: otp });

            var subject = "Forgot Password mail";
            var message = `OTP is ${otp}`
            await centerEmailSend(data.center_id, subject, message)

            return res.status(200).json({ message: "OTP successfully send", otp:otp})

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }



}



exports.centerForgotPasswordVerifyOTP = async (req, res) => {
    try {


        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json(error);
        }
        else {
            let payload = req.body
         
            const user = await userModel.findOne({ phone: payload.phone, otp: payload.otp, userType : 'center' });
            if (!user) {
                return res.status(422).json({ errors: [{ param: "otp", msg: "Otp is invalid" }] })
            }
            else {
                let password = await passwordHash.generate(payload.password);

                var data = await userModel.findOneAndUpdate({ _id: user._id }, { otp: null, password: password });

                // var subject = "Forgot Password mail";
                // var message = "OTP is 1234"
                // await email_send(user._id, subject, message)

                return res.status(200).json({ message: "Password is successfully updated" })

            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }



}

//------------------------------------------end center forgot password----------------------------------------