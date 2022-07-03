const RatingModel = require('../model/ratingModel');
const { validationResult } = require('express-validator');
const centerModel = require('../model/centers.Model');
const { aggregate } = require('../service/mongoServices');
const mongoose = require('mongoose');
const { find } = require('../model/centers.Model');

const moment = require('moment');
const book_appointmentModel = require('../model/book_appointmentModel');


function reviewCount(center_id) {
    return new Promise(async (resolve, reject) => {
        var aggregateData = [
            {
                $match: { center_id: mongoose.Types.ObjectId(center_id) }
            },
            {
                $group: {
                    _id: { center_id: "$center_id" },
                    cleanliness_rating: { $sum: { '$toInt': '$cleanliness_rating' } },
                    hygiene_rating: { $sum: { '$toInt': '$hygiene_rating' } },
                    service_rating: { $sum: { '$toInt': '$service_rating' } },
                    cleanliness_rating_count: { $sum: 1 }
                }
            },
        ]
        const data = await aggregate(RatingModel, aggregateData);
        const newData = data[0];
        if(newData) {
         
            console.log(newData,"rating---------------------");
        
            delete newData._id
            // delete newData.cleanliness_rating_count
            var options = {
                cleanliness_rating: newData.cleanliness_rating/newData.cleanliness_rating_count,
                hygiene_rating: newData.hygiene_rating/newData.cleanliness_rating_count,
                service_rating: newData.service_rating/newData.cleanliness_rating_count,
              
                
            }
            options['rating'] = (parseInt(options['cleanliness_rating']) + parseInt(options['hygiene_rating'])+ parseInt(options['service_rating']))/3
        }
        else {
            var options = {
                cleanliness_rating: 0,
                hygiene_rating: 0,
                service_rating: 0,
                rating: 0,
            }

        }
        console.log("ratingoptions---------------------",options,"ratingoptions---------------------");
       
        options['rating'] = (options['cleanliness_rating']+options['hygiene_rating']+options['service_rating'])/3
        console.log(options, "??????");
        await centerModel.updateOne({ _id: center_id }, options, { new: true })
        resolve(data)

    })
}

exports.addReview = async (req, res) => {
    try {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {

            const payload = req.body;
            console.log(payload, "rating----------------------------- ");
            const user_id = req.activeUser.userId;
            let options = {
                user_id,
                center_id: payload.center_id,
                review: payload.review,
                cleanliness_rating: payload.cleanliness_rating,
                hygiene_rating: payload.hygiene_rating,
                service_rating: payload.service_rating,
                rating : (parseInt(payload.cleanliness_rating) + parseInt(payload.hygiene_rating) + parseInt(payload.service_rating))/3,
                date_time : moment().format('DD-MM-YYYY h:mm A')
            }
            const newdata = new RatingModel(options);
            await newdata.save();
            // const centerratings = await RatingModel.find({center_id:payload.center_id});
            const review_count = await reviewCount(payload.center_id)
            return res.status(200).json({ message: "add review", review_count })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

exports.listReview = async (req, res) => {
    try {
        const user_id = req.activeUser.userId;
        const data = await RatingModel.find({ user_id, user_id }).populate('center_id');
        // const centerratings = await RatingModel.find({center_id:payload.center_id});

        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}


exports.deleteReview = async (req, res) => {
    try {
        const _id = req.params.id
        const user_id = req.activeUser.userId;
        const get_RatingModel = await RatingModel.findOne({_id})
        const center_id = get_RatingModel.center_id;
        await RatingModel.deleteOne({_id,user_id});
        const review_count = await reviewCount(center_id)

        return res.status(200).json({message:"delete review", review_count})
    } catch (error) {
        return res.status(500).json({ error })
    }
}
exports.updateReview = async (req, res) => {
    try {
        const _id = req.params.id;
        const payload = req.body;
        payload['rating'] = (parseInt(payload.cleanliness_rating) + parseInt(payload.hygiene_rating) + parseInt(payload.service_rating))/3
        await RatingModel.updateOne({ _id }, payload);
        const get_RatingModel = await RatingModel.findOne({ _id: _id })
        const review_count = await reviewCount(get_RatingModel.center_id)
        return res.status(200).json({ message: "update review", review_count })
    } catch (error) {
        return res.status(500).json({ error })
    }
}


exports.centerReviewList = async (req, res) => {
    try {
        const center_id = req.centerId;
        console.log();
        const data = await RatingModel.find({ center_id, center_id }).populate('user_id').sort({_id:-1});
        // const centerratings = await RatingModel.find({center_id:payload.center_id});

        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}


exports.centerReviews = async (req, res) => {
    try {
        const center_id = req.params.id;
       
        const data = await RatingModel.find({ center_id, center_id }).sort({_id:-1}).populate('user_id');
        // const centerratings = await RatingModel.find({center_id:payload.center_id});

        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

// centerReviews

// check user feedback
exports.checkCenterFeedback = async (req,res) =>{
    try {
       
        var center_id = req.query.center_id;
        const data = await RatingModel.findOne({user_id:req.activeUser.userId, center_id});
        const check_appointment = await book_appointmentModel.findOne({userId:req.activeUser.userId, center_id});
        return res.status(200).json({data :data? true:false, check_appointment:check_appointment? true:false})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error})
    }
}