const book_appointmentModel = require("../model/book_appointmentModel")
const { aggregate } = require('../service/mongoServices');
const mongoose = require('mongoose')
const moment = require('moment');
const centersModel = require("../model/centers.Model");

exports.dashboardApi = async (req, res) => {
    try {
        //    var _id =  ;
        console.log("-----------------------", req.params.id);
        var bookedBy = [
            {
                $match: { center_id: req.params.id ? mongoose.Types.ObjectId(req.params.id) : mongoose.Types.ObjectId(req.centerId) }
            },
            {
                $group:
                {
                    _id:
                    {
                        booked_by: "$booked_by",
                    },
                    total_appointments: { $sum: 1 },
                    // total_earning: { $sum: { '$toInt': '$charges' } }
                }
            },
        ]

        var bookedByEarning = [
            {
                $match: { center_id: req.params.id ? mongoose.Types.ObjectId(req.params.id) : mongoose.Types.ObjectId(req.centerId), appointment_status: 'completed' }
            },
            {
                $group:
                {
                    _id:
                    {
                        booked_by: "$booked_by",
                    },
                    total_appointments: { $sum: 1 },
                    total_earning: { $sum: { '$toInt': '$charges' } }
                }
            },
        ]


        var appointmentStatus = [
            {
                $match: { center_id: req.params.id ? mongoose.Types.ObjectId(req.params.id) : mongoose.Types.ObjectId(req.centerId) }
            },
            {
                $group:
                {
                    _id:
                    {
                        appointment_status: "$appointment_status",
                    },
                    total_appointments: { $sum: 1 },
                }
            },
        ]

        const today = await book_appointmentModel.find({ date: moment().format('DD-MM-YYYY') , center_id: req.params.id ? mongoose.Types.ObjectId(req.params.id) : mongoose.Types.ObjectId(req.centerId)})
        const booked_by_earning = await aggregate(book_appointmentModel, bookedByEarning)
        const booked_by = await aggregate(book_appointmentModel, bookedBy)
        const appointment_status = await aggregate(book_appointmentModel, appointmentStatus)

        var data = {
            'allBookings': 0,
            'pendingAppointments': 0,
            'cancelAppointments': 0,
            'offlineAppointments': 0,
            'offlineEarning': 0,
            'onlineAppointments': 0,
            'onlineEarning': 0,
            'todayAppointments': today.length
        }

        if (booked_by.length > 0) {
            for (let i = 0; i < booked_by.length; i++) {
                data[booked_by[i]._id.booked_by + 'Appointments'] = booked_by[i].total_appointments
                // data[booked_by[i]._id.booked_by + 'Earning'] = booked_by[i].total_earning
            }
        }

        if (booked_by_earning.length > 0) {
            for (let i = 0; i < booked_by_earning.length; i++) {
                // data[booked_by[i]._id.booked_by + 'Appointments'] = booked_by[i].total_appointments
                data[booked_by_earning[i]._id.booked_by + 'Earning'] = booked_by_earning[i].total_earning
            }
        }

        let all_appointments = 0;
        if (appointment_status.length > 0) {
            for (let i = 0; i < appointment_status.length; i++) {
                data[appointment_status[i]._id.appointment_status === 'completed' ? 'complete' : appointment_status[i]._id.appointment_status + 'Appointments'] = appointment_status[i].total_appointments
                all_appointments += parseInt(appointment_status[i].total_appointments);
            }
        }
        data['allBookings'] = all_appointments

        return res.status(200).json({ 'data': data })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}
exports.dashboardAppointmentStatus = async (req, res) => {
    try {

        var filter = [
            {
                $group:
                {
                    _id:
                    {
                        appointment_status: "$appointment_status",
                    },
                    total_appointments: { $sum: 1 },
                }
            },
        ]
        const data = await aggregate(book_appointmentModel, filter)
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}



exports.patientsList = async (req, res) => {
    try {
        let filter = [
            {
                path: 'patient_familyMemberId',
                populate: {
                    path: "user_id"
                }
            },
            {
                path: 'patient_userId',
            },
        ]
        // .group('from')
        // ref: 'familyMember',
        // book_appointmentModel.findOneAndUpdate
        // const patient = await book_appointmentModel.find().group('patient_userId').populate(filter)
        const patientfamily = await book_appointmentModel.aggregate([


            // const patientfamily = await book_appointmentModel.aggregate([
            {
                $group:
                {
                    _id:
                    {
                        userGroup: "$patient_userId",
                        familyMemberGroup: '$patient_familyMemberId'
                    }
                }
            },

            {
                $lookup: {
                    from: 'familymembers',
                    localField: '_id.familyMemberGroup',
                    foreignField: '_id',
                    as: 'family'
                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userGroup',
                    foreignField: '_id',
                    as: 'user'
                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: `family.user_id`,
                    foreignField: '_id',
                    as: 'family_user'
                }
            },


            //   {
            //     $project: {
            //         _id : {
            //             facilities: 0
            //         },
            //         units: {
            //             unitType: 0
            //         }
            //     }
            // },




        ]).exec(function (err, invites) {
            if (err) {
                next(err);
            }

            return res.status(200).json({ data: invites })
        }
        );

        // populate('patient_familyMemberId patient_userId');
        // console.log(patientfamily);
        // return res.status(200).json({patient:patientfamily});
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}



// { "_id": { "$oid": "618cc303ba0b3183b24847d0" },
//  "center_id": { "$oid": "618a2ce183eece4fa42ff904" }, 
//  "slot_id": { "$oid": "618b984f3e026709c3a9b012" }, 
//  "date": "11-11-2021", "appointment_start_time": "11:00 am", 
//  "appointment_end_time": "03:00 pm", 
//  "charges": "1000",
//   "userId": { "$oid": "618cc303ba0b3183b24847cc" }, 
//   "patient_familyMemberId": { "$oid": "618cc303ba0b3183b24847ce" }, 
//   "booked_by": "offline", "appointment_id": { "$numberLong": "11112021124515" }, 
//   "payment_status": "pending", "appointment_status": "completed", "commission": "0",
//    "created_at": "1636614853363", "__v": 0, "before_weight": "89", "after_weight": "87" }

exports.adminDashboardApi = async (req, res) => {
    try {
        //    var _id =  ;
        var bookedBy = [

            {
                $group:
                {
                    _id:
                    {
                        booked_by: "$booked_by",
                    },
                    total_appointments: { $sum: 1 },
                    // total_earning: { $sum: { '$toInt': '$charges' } }
                }
            },
        ]
        var bookedByEarning = [
            {
                $group:
                {
                    _id:
                    {
                        booked_by: "$booked_by",
                    },
                    total_appointments: { $sum: 1 },
                    total_earning: { $sum: { '$toInt': '$charges' } },
                    total_commission: { $sum: { '$toInt': '$commission' } }
                }
            },
        ]

        var appointmentStatus = [

            {
                $group:
                {
                    _id:
                    {
                        appointment_status: "$appointment_status",
                    },
                    total_appointments: { $sum: 1 },
                }
            },
        ]

        const today = await book_appointmentModel.find({ date: moment().format('DD-MM-YYYY') })
        const centers = await centersModel.find()

        const booked_by = await aggregate(book_appointmentModel, bookedBy)
        const booked_by_earning = await aggregate(book_appointmentModel, bookedByEarning)
        const appointment_status = await aggregate(book_appointmentModel, appointmentStatus)

        var data = {
            'allBookings': 0,
            'pendingAppointments': 0,
            'cancelAppointments': 0,
            'offlineAppointments': 0,
            'offlineEarning': 0,
            'onlineAppointments': 0,
            'totalCommission': 0,
            'onlineEarning': 0,
            'todayAppointments': today.length,
            'totalCenters': centers.length
        }

        if (booked_by.length > 0) {
            for (let i = 0; i < booked_by.length; i++) {
                data[booked_by[i]._id.booked_by + 'Appointments'] = booked_by[i].total_appointments
                // data[booked_by[i]._id.booked_by + 'Earning'] = booked_by[i].total_earning
            }
        }


        if (booked_by_earning.length > 0) {
            for (let i = 0; i < booked_by_earning.length; i++) {
                // data[booked_by[i]._id.booked_by + 'Appointments'] = booked_by[i].total_appointments
                data[booked_by_earning[i]._id.booked_by + 'Earning'] = booked_by_earning[i].total_earning
                data['totalCommission'] += booked_by_earning[i].total_commission
            }
        }

        let all_appointments = 0;
        if (appointment_status.length > 0) {
            for (let i = 0; i < appointment_status.length; i++) {
                data[appointment_status[i]._id.appointment_status + 'Appointments'] = appointment_status[i].total_appointments
                all_appointments += parseInt(appointment_status[i].total_appointments);
            }
        }
        data['allBookings'] = all_appointments

        return res.status(200).json({ 'data': data })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}
