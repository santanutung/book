'use strict'
const userModel = require('../model/userModel');
const patientsModel = require('../model/patientsModel');
const familyMamberModel = require('../model/familyMemberModel');
const book_appointmentModel = require('../model/book_appointmentModel');
const { add } = require('../service/mongoServices');
const appointment_slotsModel = require('../model/appointment_slotsModel');
const dateSlotsModel = require('../model/date_slotsModel')
const moment = require('moment');
const { email_send } = require('../service/helper');
const NotificationModel = require('../model/NotificationModel');
const date_slotsModel = require('../model/date_slotsModel');
const { data } = require('jquery');
const {aggregate} = require('../service/mongoServices')
const mongooose = require('mongoose')

exports.bookAppointment = async (req, res) => {
    try {
      
        const payload = req.body;
        
        const slot = await dateSlotsModel.findOne({ _id: payload.slot_id }).populate('center_id')
        var date_slots = {};
        var user = await userModel.findOne({ phone: payload.mobile, UserType: 'patients' });


        var check_appointment = await book_appointmentModel.findOne({patient_familyMemberId:payload.patient_id, date:slot.date, appointment_status: {$ne: 'cancelled'}, $or : [{apt_start_time : {$gte:slot.slot_start_time,$lt:slot.slot_end_time}}, {apt_endtime : {$gte:slot.slot_start_time,$lt:slot.slot_end_time}}] });
       
        if (check_appointment) {
            return res.status(400).json({ message: "You can't book appointment for this slot. Because this patient already have an appointment between this time"})
        }
       


        if(slot.left_bed <= 0) {
            return res.status(400).json({ message: "Please select another slot, this slot is full"})
        }
        if (user) {
            if (!payload.patient_id) {

                let createfamilyMamber = new familyMamberModel({
                    name: payload.name,
                    user_id: user._id,
                    phone: payload.mobile,
                    relation:'other'
                })
                await createfamilyMamber.save()
                payload['patient_id'] = createfamilyMamber._id
                payload['user'] = 'family_member'

            }
            payload['user_id'] = user._id
        }
        else {
           
            let user = new userModel({
                name: payload.name,
                phone: payload.mobile,
                UserType: "patients"
            })

        
            await user.save()
 
            let family_user = new familyMamberModel({
                user_id:user._id,
                name:user.name,
                phone:user.phone,
                relation:'self'
            });
            await family_user.save()
            payload['patient_id'] = family_user._id
            payload['user'] = 'family_member'
            payload['user_id'] = user._id

        }

        var commission = (100-parseInt(slot.center_id.commission))/100 *parseInt(slot.center_id.charges);
      
            date_slots = {
                booked_by : 'offline',
                patient_familyMemberId: payload.patient_id,
                center_id: req.centerId ? req.centerId : payload.center_id,
                date: payload.date,
                appointment_start_time: slot.start_time,
                appointment_end_time: slot.end_time,
                slot_id: slot._id,
                charges: slot.center_id.charges,
                appointment_id: moment().format('DDMMYYYYHHmmss'),
                userId: payload.user_id,

                apt_date : slot.slot_date_n,
                apt_start_time : slot.slot_start_time,
                apt_end_time : slot.slot_end_time,
    
                
            }

    
        var appointment = await add(book_appointmentModel, date_slots)
        var leftBed = parseInt(slot.left_bed) - 1;
        var book_slots = parseInt(slot.book_slots) +1;
       
        await dateSlotsModel.updateOne({ _id: slot._id }, { left_bed: leftBed,book_slots })

        if(user.email) {

            var subject = "Appointment booking";
    
            var message = "Your dialysis slot has been successfully booked at "+slot.center_id.name+" for "+appointment.date+" at "+appointment.appointment_start_time+". "
    
            await email_send(user._id, subject, message)
            
        }
  
  
        let options = {
            user_id: payload.user_id,
            message: appointment.appointment_key + " has been booked on "+appointment.date+" at "+appointment.appointment_start_time,
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'patient',
            module:'appointment'
        };
        //   await add(notificationModel, options);
        var notification = await add(NotificationModel, options);



        
        return res.status(200).json({ mesaage: "create book", user_id:payload.user_id, notification:notification })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}


exports.bookAppointmentList1 = async (req, res) => {
    try {
        var _id = req.params.id
        var page = req.query.page;
        var limit = req.query.limit;
        var queryDate = req.query.type;

        
        let filter = [
            {
                path: 'patient_familyMemberId',
                // match: { name: new RegExp(req.query.name)},
                populate: {
                    path: "user_id",
                    // match: { phone: new RegExp(req.query.phone)},
                }
            },
            {
                path: 'reports.reportId',
            },
        ]
      

        const date = moment().format('DD-MM-YYYY');
        var check_data = [];
        if (queryDate === 'upcoming') {
            // var filterData = { "date": { "$gte": date } };
            var filterData = { "date": { "$gte": date } };
            if (req.centerId && req.centerId != '') {
                filterData['center_id'] = req.centerId
            }
            if (req.query.appointment_status && req.query.appointment_status != '') {
                if (req.query.appointment_status == 'ne-cancelled') {
                    
                    filterData['appointment_status'] = {$ne : 'cancelled'}
                }
                else {

                    filterData['appointment_status'] = req.query.appointment_status
                }
                
            }
           
            if (req.query.from_date && req.query.from_date != '' && req.query.to_date && req.query.to_date != '' ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
                filterData['date'] = {  "$lte":date, "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.date && req.query.date != '') {
                filterData['date'] = { "$eq": moment(req.query.date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }

            if (req.query.limit ? true : false) {
                var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ date: -1 });
            }
            else {
                var data = await book_appointmentModel.find(filterData).populate(filter).sort({ date: -1 });
            }
            check_data = await book_appointmentModel.find(filterData)
        }
        else if(queryDate === 'history') {
            var filterData = { "date": { "$lte": date } };
            if (req.centerId && req.centerId != '') {
                filterData['center_id'] = req.centerId
            }
            if (req.query.appointment_status && req.query.appointment_status != '') {
                if (req.query.appointment_status == 'ne-cancelled') {
                    
                    filterData['appointment_status'] = {$ne : 'cancelled'}
                }
                else {

                    filterData['appointment_status'] = req.query.appointment_status
                }
            }
            if (req.query.from_date && req.query.from_date != '') {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }

            else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }

                // filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }
            }
            else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
                filterData['date'] = {  "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            
            }
           
            // book_appointmentModel.findOneAndDelete

            if (req.query.limit ? true : false) {
                var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ date: -1 });;
            }
            else {
                var data = await book_appointmentModel.find(filterData).populate(filter).sort({ date: -1 })
            }
            check_data = await book_appointmentModel.find(filterData)
        }
        else{
            var filterData = {};
            if (req.centerId && req.centerId != '') {
                filterData['center_id'] = req.centerId
            }
            if (req.query.appointment_status && req.query.appointment_status != '') {
                if (req.query.appointment_status == 'ne-cancelled') {
                    
                    filterData['appointment_status'] = {$ne : 'cancelled'}
                }
                else {

                    filterData['appointment_status'] = req.query.appointment_status
                }
            }
            if (req.query.from_date && req.query.from_date != '') {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }

            else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }

                // filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }
            }
            else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
                filterData['date'] = {  "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            
            }
           

            if (req.query.limit ? true : false) {
                var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ date: -1 });;
            }
            else {
                var data = await book_appointmentModel.find(filterData).populate(filter).sort({ date: -1 })
            }
            check_data = await book_appointmentModel.find(filterData)
        }
        return res.status(200).json(
            {
                data: data,
                page:Math.ceil(check_data.length/ parseInt( req.query.limit)),
           
            })
    } catch (error) {
        console.log(error,"test");
        return res.status(500).json({ error: error })
    }
}

exports.bookAppointmentList = async (req, res) => {
    try {
        var filterData = {};
        var queryDate = req.query.type;
        var patient = req.query.patient;
   
     
        if (req.centerId && req.centerId != '') {
            filterData['center_id'] = req.centerId
        }

        if (queryDate === 'upcoming') {
           

            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD'))}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment().format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else {
                filterData['apt_date'] = { "$gte": parseInt(moment().format('YYYYMMDD'))}

            }

        }
        else if(queryDate === 'history') {
            

            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment().format('YYYYMMDD') )}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else {
                filterData['apt_date'] = { "$lte": parseInt(moment().format('YYYYMMDD'))}

            }

           
        }
        else{

            var filterData = {};
            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.date) {
                console.log(moment(req.query.date, 'YYYY-MM-DD').format('DD-MM-YYYY'))
            var filterData = { "date": moment(req.query.date, 'YYYY-MM-DD').format('DD-MM-YYYY') };

            }
           
        }
        if (req.query.appointment_status && req.query.appointment_status != '') {
            if (req.query.appointment_status == 'ne-cancelled') {
                
                filterData['appointment_status'] = {$nin : ['cancelled', 'not complete']}
            }
            else {
              
                filterData['appointment_status'] = req.query.appointment_status
                // filterData['appointment_status'] = 'cancelled'
            }
        }
      

        filterData['center_id'] = mongooose.Types.ObjectId(req.centerId)


        if (req.query.slot_id && req.query.slot_id != '') {
            filterData['slot_id'] = mongooose.Types.ObjectId(req.query.slot_id)
        }


            const nameFilter =[
                {
                    $match:filterData
                },
                {$sort:{apt_date:-1}},
                {
                    $lookup: {
                      from: 'familymembers',
                      localField: 'patient_familyMemberId',
                      foreignField: '_id',
                      as: 'patient_familyMemberId'
                    }
                    
                  },
                  {
                      $unwind:'$patient_familyMemberId'
                  },
                  {
                    $lookup: {
                        localField: 'patient_familyMemberId.user_id',
                      from: 'users',
                      foreignField: '_id',
                      as: 'patient_familyMemberId.user_id'
                    }
                  },
                  {$unwind: '$patient_familyMemberId.user_id'},
            ]

            if(patient) {

                    var matchName =  {$match: { $or :[{
                        "patient_familyMemberId.name":new RegExp(patient.toLowerCase())},  {"patient_familyMemberId.user_id.phone":new RegExp(patient.toLowerCase())}]
                        
                }}
                nameFilter.push(matchName)
            }
            const newData = await aggregate(book_appointmentModel,nameFilter);
            return res.status(200).json({data:newData})
      
    } catch (error) {
        console.log(error,"test");
        return res.status(500).json({ error: error })
    }
}



exports.adminBookAppointmentList = async (req, res) => {
    try {
        var filterData = {};
        var queryDate = req.query.type;
        var patient = req.query.patient;
   
        // console.log(req.query, "query------------------")
        filterData['appointment_status'] = { $ne: 'not complete' }
        if (req.query.center_id && req.query.center_id != '') {
            filterData['center_id'] = req.query.center_id
        }

        if (queryDate === 'upcoming') {
           

            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD'))}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment().format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else {
                filterData['apt_date'] = { "$gte": parseInt(moment().format('YYYYMMDD'))}

            }

        }
        else if(queryDate === 'history') {
            
            console.log(req.query, "query------------------")
     
            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment().format('YYYYMMDD') )}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else {
              
                filterData['apt_date'] = { "$lte": parseInt(moment().format('YYYYMMDD'))}

            }

           
        }
        else{

            var filterData = {};
            if(req.query.from_date && req.query.to_date) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD')), "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.from_date  ) {
                filterData['apt_date'] = { "$gte": parseInt(moment(req.query.from_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.to_date) {
                filterData['apt_date'] = { "$lte": parseInt(moment(req.query.to_date, "YYYY-MM-DD").format('YYYYMMDD') )}

            }
            else if(req.query.date) {
                console.log(moment(req.query.date, 'YYYY-MM-DD').format('DD-MM-YYYY'))
            var filterData = { "date": moment(req.query.date, 'YYYY-MM-DD').format('DD-MM-YYYY') };

            }
           
        }
        if (req.query.appointment_status && req.query.appointment_status != '') {
            if (req.query.appointment_status == 'ne-cancelled') {
                
                filterData['appointment_status'] = {$ne : 'cancelled'}
            }
            else {
              
                filterData['appointment_status'] = req.query.appointment_status
                // filterData['appointment_status'] = 'cancelled'
            }
        }
      
        if(req.query.center_id) {

            filterData['center_id'] = mongooose.Types.ObjectId(req.query.center_id)
        }



        if (req.query.slot_id && req.query.slot_id != '') {
            filterData['slot_id'] = mongooose.Types.ObjectId(req.query.slot_id)
        }


            const nameFilter =[
                {
                    $match:filterData
                },
                {$sort:{apt_date:-1}},
                {
                    $lookup: {
                      from: 'centers',
                      localField: 'center_id',
                      foreignField: '_id',
                      as: 'center_id'
                    }
                    
                  },

                {
                    $lookup: {
                      from: 'familymembers',
                      localField: 'patient_familyMemberId',
                      foreignField: '_id',
                      as: 'patient_familyMemberId'
                    }
                    
                  },
                  {
                      $unwind:'$patient_familyMemberId'
                  },
                  {
                    $lookup: {
                        localField: 'patient_familyMemberId.user_id',
                      from: 'users',
                      foreignField: '_id',
                      as: 'patient_familyMemberId.user_id'
                    }
                  },
                  {$unwind: '$patient_familyMemberId.user_id'},
            ]

            if(patient) {

                    var matchName =  {$match: { $or :[{
                        "patient_familyMemberId.name":new RegExp(patient.toLowerCase())},  {"patient_familyMemberId.user_id.phone":new RegExp(patient.toLowerCase())}]
                        
                }}
                nameFilter.push(matchName)
            }
            const newData = await aggregate(book_appointmentModel,nameFilter);
            return res.status(200).json({data:newData})
      
    } catch (error) {
        console.log(error,"test");
        return res.status(500).json({ error: error })
    }
}


exports.adminBookAppointmentList1 = async (req, res) => {
    try {
        var _id = req.params.id
        var page = req.query.page;
        var limit = req.query.limit;
        var queryDate = req.query.type;
        let filter = [
            {
                path:"center_id"
            },
            {
                path: 'patient_familyMemberId',
                populate: {
                    path: "user_id"
                }
            },
            {
                path: 'reports.reportId',
            },
           
        ]
        const date = moment().format('DD-MM-YYYY');
        var check_data = [];
        if (queryDate === 'upcoming') {
            // var filterData = { "date": { "$gte": date } };
            var filterData = { "date": { "$gte": date } };
            if (req.query.center_id && req.query.center_id != '') {
                filterData['center_id'] = req.query.center_id
            }
            if (req.query.appointment_status && req.query.appointment_status != '') {
                filterData['appointment_status'] = req.query.appointment_status
            }
            if (req.query.from_date && req.query.from_date != '' && req.query.to_date && req.query.to_date != '' ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
                filterData['date'] = {  "$lte":date, "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }
            else if (req.query.date && req.query.date != '') {
                filterData['date'] = { "$eq": moment(req.query.date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }

            if (req.query.limit ? true : false) {
                var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ date: -1 });
            }
            else {
                var data = await book_appointmentModel.find(filterData).populate(filter).sort({ date: -1 });
            }
            check_data = await book_appointmentModel.find(filterData)
        }
        else {
            var filterData = { "date": { "$lte": date } };
            if (req.query.center_id && req.query.center_id != '') {
                filterData['center_id'] = req.query.center_id
            }
            if (req.query.appointment_status && req.query.appointment_status != '') {
                filterData['appointment_status'] = req.query.appointment_status
            }
            if (req.query.from_date && req.query.from_date != '') {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            }

            else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
                filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }
            }
            else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
                filterData['date'] = {  "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            
            }
           


            if (req.query.limit ? true : false) {
                var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ date: -1 });;
            }
            else {
                var data = await book_appointmentModel.find(filterData).populate(filter).sort({ date: -1 })
            }
            check_data = await book_appointmentModel.find(filterData)
        }
        return res.status(200).json(
            {
                data: data,
                page:Math.ceil(check_data.length/ parseInt( req.query.limit)),
         
            })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}


exports.bookAppointmentCancelled = async (req, res) => {
    try {
        var _id = req.params.id;
        var apt = await book_appointmentModel.findOne({ _id: _id })
        var appoinntment = await book_appointmentModel.updateOne({ _id: _id }, { appointment_status: 'cancelled' })


        var slot = await date_slotsModel.findOne({ _id: apt.slot_id }).populate('center_id');
 
        var date_slot = await date_slotsModel.findOneAndUpdate({ _id: appoinntment.slot_id }, { left_bed: parseInt(slot.left_bed)+1 ,  book_slots : parseInt(slot.book_slots) -1 });


        var subject = "Appointment cancel by center";
        var message = "Your Dialysis appointment for ("+slot.date+", "+slot.start_time+") has been cancelled by ("+slot.center_id.name+"). You can again book a new slot as per the slot availablity at (<a href='http://3.6.57.135:8444/'>Bookcare</a>).";
      
        await email_send(apt.userId, subject, message)


  
        let options = {
            user_id: apt.userId,
            message: "Your appointment id "+apt.appointment_key+" has been cancelled by ("+slot.center_id.name+")",
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'patient',
            module:'appointment'
        };
        //   await add(notificationModel, options);
        var notification = await add(NotificationModel, options);
        
       

        return res.status(200).json({ message: "cancelled appointment", user_id:apt.userId, notification:notification  })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

exports.bookAppointmentdemo = async (req, res) => {
    try {
       let payload = req.body;
       var _id = req.params.id;
        var appointment = await book_appointmentModel.updateOne({ _id: _id }, req.body,{upsert:true}).catch((err) => {
            if (err) {
                return res.status(500).json({ error: error });
            }
        });
        var apt = await book_appointmentModel.findOne({_id}).populate('center_id')

        if(apt.appointment_status == 'completed') {
        var subject = "Appointment complete";
        var message = "Your Dialysis appointment for ("+apt.date+", "+apt.appointment_start_time+") has been complete by ("+apt.center_id.name+").";
    
        await email_send(apt.userId, subject, message)


        let options = {
            user_id: apt.userId,
            message: "Your appointment id "+apt.appointment_key+" has been complete by ("+apt.center_id.name+")",
            date: moment().format('DD/MM/YYYY h:mm a'),
            type:'patient',
            module:'appointment'
        };
        //   await add(notificationModel, options);
        var notification = await add(NotificationModel, options);
        
        return res.status(200).json({ message: "update appointment", apt, notification })


        }
       


        return res.status(200).json({ message: "update appointment", apt })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}


//show appointment on admin panel
// exports.bookAppointmentList = async (req, res) => {
//     try {
//         console.log(req.query,":::::::::::::::::");
//         var _id = req.params.id
//         var page = req.query.page;
//         var limit = req.query.limit;
//         var queryDate = req.query.type;
//         let filter = [
//             {
//                 path: 'patient_familyMemberId',
//                 populate: {
//                     path: "user_id"
//                 }
//             },
//             {
//                 path: 'patient_userId',
//             },
//         ]
//         const date = moment().format('DD-MM-YYYY');
//         var check_data = [];
//         if (queryDate === 'upcoming') {
//             // var filterData = { "date": { "$gte": date } };
//             var filterData = { "date": { "$gte": date } };
//             if (req.query.center && req.query.center != '') {
//                 filterData['center_id'] = req.query.center
//             }
//             if (req.query.appointment_status && req.query.appointment_status != '') {
//                 filterData['appointment_status'] = req.query.appointment_status
//             }
//             if (req.query.from_date && req.query.from_date != '' && req.query.to_date && req.query.to_date != '' ) {
//                 filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
//             }
//             else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
//                 filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
//             }
//             else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
//                 filterData['date'] = {  "$lte":date, "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
//             }
//             else if (req.query.date && req.query.date != '') {
//                 filterData['date'] = { "$eq": moment(req.query.date, "YYYY-MM-DD").format('DD-MM-YYYY') }
//             }

//             if (req.query.limit ? true : false) {
//                 var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ _id: -1 });
//             }
//             else {
//                 var data = await book_appointmentModel.find(filterData).populate(filter);
//             }
//             check_data = await book_appointmentModel.find(filterData)
//         }
//         else {
//             var filterData = { "date": { "$lte": date } };
//             if (req.query.center && req.query.center != '') {
//                 filterData['center_id'] = req.query.center
//             }
//             if (req.query.appointment_status && req.query.appointment_status != '') {
//                 filterData['appointment_status'] = req.query.appointment_status
//             }
//             if (req.query.from_date && req.query.from_date != '') {
//                 filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
//             }

//             else if (req.query.from_date && req.query.from_date != '' && (!req.query.to_date || req.query.to_date == '') ) {
//                 filterData['date'] = { "$gte": moment(req.query.from_date, "YYYY-MM-DD").format('DD-MM-YYYY'), "$lte": date }
//             }
//             else if (req.query.to_date && req.query.to_date != '' && (!req.query.from_date || req.query.from_date == '') ) {
//                 filterData['date'] = {  "$lte": moment(req.query.to_date, "YYYY-MM-DD").format('DD-MM-YYYY') }
            
//             }
           


//             if (req.query.limit ? true : false) {
//                 var data = await book_appointmentModel.find(filterData).populate(filter).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).sort({ _id: -1 });;
//             }
//             else {
//                 var data = await book_appointmentModel.find(filterData).populate(filter)
//             }
//             check_data = await book_appointmentModel.find(filterData)
//         }
//         return res.status(200).json(
//             {
//                 data: data,
//                 page:Math.ceil(check_data.length / data.length)
//             })
//     } catch (error) {
//         return res.status(500).json({ error: error })
//     }
// }

// let dateSlotsCreate = (data) =>{
//     return new Promise((resolve,reject)=>{
//         let date_slots = {
//             patient_userId:data._id,
//             center_id:req.centerId? req.centerId:payload.center_id,
//             date:payload.date,
//             appointment_start_time:slot.start_time,
//             appointment_end_time:slot.end_time,
//             slot_id:slot._id,
//             charges:slot.center_id.charges
//            }
//     })
// }
// center_id:
// bookBy:
// date:
// appointment_time:
// charges_status:
// patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: ['users','familyMember'],
// },
// payment_status: {
//     type: String,
//     default: "pending"
// },
// appointment_status: {
//     type: String,
//     default: "pending"
// },
// weight:
// after:
