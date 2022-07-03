const appointmentSlotsModel = require('../model/appointment_slotsModel');
const centerModel = require('../model/centers.Model');
const { addHours } = require('../utilities/Date');
const { add } = require('../service/mongoServices')
const moment = require('moment');
const { validationResult } = require('express-validator');
const { aggregate } = require('../service/mongoServices')
const dateSlotsModel = require('../model/date_slotsModel');
const mongoose = require('mongoose')


exports.create_appointment_slots = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var payload = req.body;
            var centerId = req.centerId;
            payload['center_id'] = centerId
            await add(appointmentSlotsModel, payload).catch(err => {
                return res.status(500).json({ error: err })
            });
            return res.status(200).json({ message: "slot create" })
        }

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}




exports.appointmentSlotsDetails = async (req, res) => {
    try {
        var centerId = req.centerId;
        var day = req.params.day;
        const data = await appointmentSlotsModel.find({ center_id: centerId, day: day }).select('start_time end_time total_beds')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}


exports.appointmentSlotsDetailsById = async (req, res) => {
    try {
        var centerId = req.centerId;
        var id = req.params.id;
        const data = await appointmentSlotsModel.find({ center_id: centerId, id: id }).select('start_time end_time total_beds')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}



exports.appointmentSlotsUpdate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var centerId = req.centerId;
            var id = req.params.update;
            let payload = req.body;
            var check = await appointmentSlotsModel.findOne({ _id: id });
            const endTime = await appointmentSlotsModel.findOne({ center_id: centerId, _id: id, day: payload.day, end_time: payload.end_time, start_time: payload.start_time });
            const startTime = await appointmentSlotsModel.findOne({ center_id: centerId, _id: id, day: payload.day, end_time: payload.end_time, start_time: payload.start_time });
            if (endTime) {
                return res.status(422).json({ error: "unique end_time" })
                // throw new Error('unique end_time');
            }
            if (startTime) {
                return res.status(422).json({ error: "unique start_time" })
                //  throw new Error('unique end_time');
            }
            await appointmentSlotsModel.findOneAndUpdate({ center_id: centerId, _id: id }, payload, { upsert: true });
            return res.status(200).json({ message: "update " });
        }
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}


exports.appointmentSlotsDelete = async (req, res) => {
    try {
        var centerId = req.centerId;
        var id = req.params.delete;

        const slot = await appointmentSlotsModel.findOne({ center_id: centerId, _id: id });
        if (!slot) {
            return res.status(422).json({ error: "Invalid center id" })
        }

        await appointmentSlotsModel.deleteOne({ center_id: centerId, _id: id });
        return res.status(200).json({ message: "delete slot" });
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}



exports.createDateSlots = async (req, res) => {
    try {
        var centerId = req.centerId;
       
        var current_date = moment();

        var centerData = await centerModel.find();
        var temp = [];
        for (var i = 0; i < 20; i++) {
            let day = current_date.format('dddd')
            let filter = [
                {
                    path: 'center_id',
                    select: "charges "
                }
            ]

            const Slots_data = await appointmentSlotsModel.find({ day: day, center_id: centerId })
            if (Slots_data.length > 0) {

                for (var j = 0; j < Slots_data.length; j++) {
                    let slots = {
                        center_id: Slots_data[j].center_id,
                        date: moment(current_date).format('DD-MM-YYYY'),
                        start_time: moment(Slots_data[j].start_time, 'h:mm a').format('hh:mm a'),
                        end_time: moment(Slots_data[j].end_time, 'h:mm a').format('hh:mm a'),
                        total_bed: Slots_data[j].total_beds,
                        left_bed: Slots_data[j].total_beds,
                        slot_date:moment(current_date),
                        slot_date:moment(current_date),
                        slot_date_n:moment(current_date).format('DDMMYYYY'),
                        slot_start_time:parseInt(moment(Slots_data[j].start_time, 'h:mm a').format('HHmmss')),
                        slot_end_time:parseInt(moment(Slots_data[j].end_time, 'h:mm a').format('HHmmss')),
                    }
                    const slots_check = await dateSlotsModel.find({ center_id: slots.center_id, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });

                    if (slots_check.length == 0) {

                        await add(dateSlotsModel, slots)
                    }

                }
            }
            current_date = current_date.add(1, 'day');



        }
        return res.json({ data: "create" })


    } catch (error) {
        return res.status(200).json({ error: error })
    }
}

exports.dateSlotsList = async (req, res) => {
    try {
       
        var date = req.query.date;
        
      
        if (date) {
         
            var currant_time = parseInt(moment().utcOffset("+05:30").format('HHmmss'))
            var match_time = moment().utcOffset("+05:30").format('DD-MM-YYYY')
            if(date == match_time){
                console.log("match time")
               var date_condition_match = {"date" :date,'slot_start_time':{$gte:currant_time}, 'center_id':mongoose.Types.ObjectId(req.centerId),'left_bed':{$gte:0} }
           }
           else{
            var date_condition_match = {"date" :date, 'center_id':mongoose.Types.ObjectId(req.centerId)
            ,'left_bed':{$gte:0}
         }

           }
        //    var date_condition_match = {"date" :date, 'center_id':mongoose.Types.ObjectId(req.centerId),'left_bed':{$gte:0} }

            var filter = [

                // {
                //     "$match": { "date": date, 'slot_start_time':{$gte:nowDate},  'center_id': mongoose.Types.ObjectId(req.centerId) },
                // },
                {
                    "$match": date_condition_match,
                },
                { "$project": { "date": "$date", "total_bed": "$total_bed", "start_time": "$start_time", "left_bed": "$left_bed", "end_time": "$end_time", "center_id": "$center_id" } }
            ]

            var data = await aggregate(dateSlotsModel, filter)

            return res.status(200).json({ data: data })
        }
        // var data = await dateSlotsModel.find({'center_id':req.centerId,  slot_date_n: { $gte: parseInt(moment().format('YYYYMMDD')) }}).sort({date : -1}).select('date').distinct('date').where('left_bed').gt(-0);
       
       
       var data = await dateSlotsModel.find({ slot_date_n: { $gte:  parseInt(moment().format('YYYYMMDD'))}, 'center_id': mongoose.Types.ObjectId(req.centerId),left_bed:{$gte:-0} }).where('left_bed').gt(-0).sort({slot_date_n:1}).select('date');
     
       var pre_date = "";
       var date_array = []
       for(var i = 0 ; i < data.length ; i++) {
         if(pre_date != data[i]['date']) {
             date_array.push(data[i]['date'])
             pre_date =  data[i]['date']
         }
       }

       console.log(data, "dates")
        return res.status(200).json({ data: date_array })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}






// exports.create_appointment_Time =
// exports.appointmentSlotsList = async (req,res) =>{
//     try {
//         const data = await 
//     } catch (error) {
//         return res.status(500).json({error:error})
//     }
// }







//---------------------------------------------admin center slots-----------------------------------------------------------


exports.adminAppointmentSlotsDetails = async (req, res) => {
    try {
        var day = req.params.day;
        var center_id = req.params.center_id;
        const data = await appointmentSlotsModel.find({ center_id: center_id, day: day }).select('start_time end_time total_beds')
        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}


exports.adminAppointmentSlotsDelete = async (req, res) => {
    try {
        var centerId = req.params.center_id;
        var id = req.params.delete;

        const slot = await appointmentSlotsModel.findOne({ center_id: centerId, _id: id });
        if (!slot) {
            return res.status(422).json({ error: "Invalid center id" })
        }

        await appointmentSlotsModel.deleteOne({ center_id: centerId, _id: id });
        return res.status(200).json({ message: "delete slot" });
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}






exports.adminCreateAppointmentSlots = async (req, res) => {
    try {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var payload = req.body;
            var centerId = req.params.center_id;
            payload['center_id'] = centerId
            await add(appointmentSlotsModel, payload).catch(err => {
                return res.status(500).json({ error: err })
            });
            return res.status(200).json({ message: "slot create" })
        }

    } catch (error) {
        console.log(error, "-------------------------------------------------------");
        return res.status(500).json({ error: error })
    }
}




exports.adminAppointmentSlotsUpdate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var centerId = req.params.center_id;
            var id = req.params.update;
            let payload = req.body;
            var check = await appointmentSlotsModel.findOne({ _id: id });
          
            const endTime = await appointmentSlotsModel.findOne({ center_id: centerId, _id: { $ne: id }, day: payload.day, end_time: payload.end_time, start_time: payload.start_time });
            const startTime = await appointmentSlotsModel.findOne({ center_id: centerId, _id: { $ne: id }, day: payload.day, end_time: payload.end_time, start_time: payload.start_time });
            // return res.status(422).json({ error: endTime     })
            if (endTime) {
                return res.status(422).json({ error: "unique end_time" })
                // throw new Error('unique end_time');
            }
            if (startTime) {
                return res.status(422).json({ error: "unique start_time" })
                //  throw new Error('unique end_time');
            }
            await appointmentSlotsModel.findOneAndUpdate({ center_id: centerId, _id: id }, payload, { upsert: true });
            return res.status(200).json({ message: "update " });
        }
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}


//---------------------------------------------end admin center slots-------------------------------------------------------



//---------------------------------------------center date slots--------------------------------------------------------------


exports.appointmentDateSlotsDelete = async (req, res) => {
    try {
        var centerId = req.centerId?req.centerId:req.query.centerId;
        var id = req.params.delete;

        const slot = await dateSlotsModel.findOne({ center_id: centerId, _id: id });
        if (!slot) {
            return res.status(422).json({ error: "Invalid center id" })
        }

        await dateSlotsModel.deleteOne({ center_id: centerId, _id: id });
        return res.status(200).json({ message: "delete slot" });
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}





exports.appointmentDateSlotsUpdate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var centerId = req.centerId?req.centerId:req.body.centerId;
            var id = req.params.update;
            let payload = req.body;
            console.log("-------------------",payload)
            var check = await dateSlotsModel.findOne({ _id: id });
            payload.date = check.date
            console.log(payload,"edit slot----------------------------------")
            const endTime = await dateSlotsModel.findOne({ center_id: centerId, _id: { $ne: id }, date: check.date, end_time: payload.end_time, start_time: payload.start_time });
            // const startTime=  await dateSlotsModel.findOne({ center_id:centerId,_id:id, date:check.date,end_time:payload.end_time,start_time:payload.start_time});
            if (endTime) {
                return res.status(422).json({ error: "unique end_time" })
                // throw new Error('unique end_time');
            }
            else {
                const startTime = await dateSlotsModel.findOne({ center_id: centerId, _id: { $ne: id }, date: check.date, end_time: payload.end_time, start_time: payload.start_time });
                if (startTime) {
                    return res.status(422).json({ error: "unique start_time" })
                    //  throw new Error('unique end_time');
                }
                else if(parseInt(check.left_bed) !== parseInt(check.total_bed)){
                    if (parseInt(check.left_bed) > parseInt(payload.total_bed)) {
                        return res.status(422).json({ error: "total beds must be greater than left beds" })
                    }
                }
            }

            payload['start_time']= moment(payload.start_time, 'h:mm a').format('hh:mm a'),
            payload['end_time']= moment(payload.end_time, 'h:mm a').format('hh:mm a'),
            payload['slot_start_time']= parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss')),
            payload['slot_end_time']= parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss')),
            payload['slot_end_time']
            payload['left_bed'] = parseInt(payload.total_bed)-parseInt(check.book_slots)
            await dateSlotsModel.findOneAndUpdate({ center_id: centerId, _id: id }, payload, { upsert: true });
            // delete payload.repeat
         
            if(payload.repeat === 'daily'){
                for (var j = 1; j < 30; j++) {
                    current_date = moment(payload.date, 'DD-MM-YYYY').add(j, 'day');
                    console.log(current_date,"current_date");
                    let slots = {
                        center_id: centerId,
                        date: moment(current_date, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                        start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a'),
                        end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a'),
                        total_bed: payload.total_bed,
                        left_bed: payload.total_bed,
                        slot_date:moment(current_date),
                        slot_date_n:moment(current_date).format('YYYYMMDD'),
                        slot_start_time:parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss')),
                        slot_end_time:parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss')),
                    }
                    console.log(slots,"slots");
                    const slots_check = await dateSlotsModel.find({ center_id: centerId, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });
                    if (slots_check.length == 0) {
                        await add(dateSlotsModel, slots)
                    }
                }
            }
            else if(payload.repeat =='weekly'){
             for (var j = 1; j < 5; j++) {
                 current_date = moment(payload.date, 'DD-MM-YYYY').add(j*7, 'day');
                 console.log(current_date,"current_date");
                 let slots = {
                     center_id: centerId,
                     date: moment(current_date).format('DD-MM-YYYY'),
                     start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a'),
                     end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a'),
                     total_bed: payload.total_bed,
                     left_bed: payload.total_bed,
                     slot_date:moment(current_date),
                     slot_date_n:moment(current_date).format('YYYYMMDD'),
                     slot_start_time:parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss')),
                     slot_end_time:parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss')),
                 }
                 console.log(slots,"slots");
                 const slots_check = await dateSlotsModel.find({ center_id: centerId, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });
                 if (slots_check.length == 0) {
                     await add(dateSlotsModel, slots)
                 }
             }
            }


            return res.status(200).json({ message: "update " });
        }
    } catch (error) {
        return res.status(200).json({
            error: error
        })
    }
}





exports.adminCreateDateSlots = async (req, res) => {
    try {
        var centerId = req.params.center_id;
        var current_date = moment();

        var temp = [];
        for (var i = 0; i < 20; i++) {
            let day = current_date.format('dddd')
            let filter = [
                {
                    path: 'center_id',
                    select: "charges "
                }
            ]

            const Slots_data = await appointmentSlotsModel.find({ day: day, center_id: centerId })
            if (Slots_data.length > 0) {

                for (var j = 0; j < Slots_data.length; j++) {
                    let slots = {
                        center_id: Slots_data[j].center_id,
                        date: moment(current_date).format('DD-MM-YYYY'),
                        start_time: moment(Slots_data[j].start_time, 'h:mm a').format('hh:mm a'),
                        end_time: moment(Slots_data[j].end_time, 'h:mm a').format('hh:mm a'),
                        total_bed: Slots_data[j].total_beds,
                        left_bed: Slots_data[j].total_beds,
                        slot_date:moment(current_date),
                        slot_date_n:moment(current_date).format('DDMMYYYY'),
                        slot_start_time:parseInt(moment(Slots_data[j].start_time, 'h:mm a').format('HHmmss')),
                        slot_end_time:parseInt(moment(Slots_data[j].end_time, 'h:mm a').format('HHmmss')),

                    }
                    const slots_check = await dateSlotsModel.find({ center_id: slots.center_id, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });

                    if (slots_check.length == 0) {
                        await add(dateSlotsModel, slots)
                    }

                }
            }
            current_date = current_date.add(1, 'day');



        }
        return res.json({ data: "create" })


    } catch (error) {
        return res.status(200).json({ error: error })
    }
}

//---------------------------------------------end center date slots-----------------------------------------------------------



exports.adminDateSlotsList = async (req, res) => {
    try {
        // {"$match": {"name" :{ "$ne" : null } } }, 
        // {"$group" : {"_id": "$name", "count": { "$sum": 1 } } },
        // {"$match": {"count" : {"$gt": 1} } }, 
        // {"$project": {"name" : "$_id", "_id" : 0} }
        var date = req.query.date;
        
        //   var only  = req.query.only
        // if (date) {
            // 
            // var nowDate = parseInt(moment().format('HHmmss'))
            var currant_time = parseInt(moment().format('HHmmss'))
            var match_time = moment().format('DD-MM-YYYY')
            var date_condition_match = {"date" :date, 'center_id':mongoose.Types.ObjectId(req.params.centerId) }

            var filter = [

                // {
                //     "$match": { "date": date, 'slot_start_time':{$gte:nowDate},  'center_id': mongoose.Types.ObjectId(req.centerId) },
                // },
                {
                    "$match": date_condition_match,
                },
                { "$project": { "date": "$date", "total_bed": "$total_bed", "left_bed": "$left_bed", "start_time": "$start_time", "left_bed": "$left_bed", "end_time": "$end_time", "center_id": "$center_id" } }
            ]

            var data = await aggregate(dateSlotsModel, filter)

        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}




exports.addDateSlots = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        else {
        var centerId = req.centerId? req.centerId : req.body.centerId;
        var id = req.params.update;
        let payload = req.body;
        var check = await dateSlotsModel.findOne({ _id: id });
        payload['date'] = payload.date
        console.log(payload);
        const endTime = await dateSlotsModel.findOne({ center_id: centerId, date: payload.date, end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a')});
        if (endTime) {
            return res.status(422).json({ errors : [{param :'end_time', msg:"This time is ready exist", endTime}] })
        }
        else {
            const startTime = await dateSlotsModel.findOne({ center_id: centerId, date: payload.date,  start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a')});
            if (startTime) {
                return res.status(422).json({ errors : [{param :'start_time', msg:"This time is ready exist", startTime}] })
            }
        }
            payload['slot_date_n'] =parseInt(moment(payload.date, 'DD/MM/YYYY').format('YYYYMMDD'))
            payload['start_time']= moment(payload.start_time, 'h:mm a').format('hh:mm a')
            payload['end_time']= moment(payload.end_time, 'h:mm a').format('hh:mm a')
            payload['slot_start_time']= parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss'))
            payload['slot_end_time']= parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss'))
            payload['center_id']= centerId
            payload['left_bed']= payload.total_bed
            payload['repeat']= payload.repeat
            var data = await add(dateSlotsModel, payload)
            console.log(payload)
            // delete payload.repeat
               if(payload.repeat === 'daily'){
                   for (var j = 1; j < 30; j++) {
                       current_date = moment(payload.date, 'DD-MM-YYYY').add(j, 'day');
                       console.log(current_date,"current_date");
                       let slots = {
                           center_id: centerId,
                           date: moment(current_date, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                           start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a'),
                           end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a'),
                           total_bed: payload.total_bed,
                           left_bed: payload.total_bed,
                           slot_date:moment(current_date),
                           slot_date_n:moment(current_date).format('YYYYMMDD'),
                           slot_start_time:parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss')),
                           slot_end_time:parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss')),
                       }
                       console.log(slots,"slots");
                       const slots_check = await dateSlotsModel.find({ center_id: centerId, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });
                       if (slots_check.length == 0) {
                           await add(dateSlotsModel, slots)
                       }
                   }
               }
               else if(payload.repeat =='weekly'){
                for (var j = 1; j < 5; j++) {
                    current_date = moment(payload.date, 'DD-MM-YYYY').add(j*7, 'day');
                    console.log(current_date,"current_date");
                    let slots = {
                        center_id: centerId,
                        date: moment(current_date).format('DD-MM-YYYY'),
                        start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a'),
                        end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a'),
                        total_bed: payload.total_bed,
                        left_bed: payload.total_bed,
                        slot_date:moment(current_date),
                        slot_date_n:moment(current_date).format('YYYYMMDD'),
                        slot_start_time:parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss')),
                        slot_end_time:parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss')),
                    }
                    console.log(slots,"slots");
                    const slots_check = await dateSlotsModel.find({ center_id: centerId, date: slots.date, start_time: slots.start_time, end_time: slots.end_time });
                    if (slots_check.length == 0) {
                        await add(dateSlotsModel, slots)
                    }
                }
               }
            return res.status(200).json({data })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

exports.adminAddDateSlots = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        else {
        var centerId = req.body.centerId;
        console.log(req.body)
        // return res.status(422).json({ errors : [{param :'start_time', msg:"This time is ready exist", centerId:req.body.centerId}] })

        var id = req.params.update;
        let payload = req.body;
        var check = await dateSlotsModel.findOne({ _id: id });
        payload['date'] = moment(payload.date, 'YYYY-MM-DD').format('DD-MM-YYYY')
        const endTime = await dateSlotsModel.findOne({ center_id: centerId, date: payload.date, end_time: moment(payload.end_time, 'h:mm a').format('hh:mm a')});
        if (endTime) {
            return res.status(422).json({ errors : [{param :'end_time', msg:"This time is ready exist", endTime}] })
        }
        else {
            const startTime = await dateSlotsModel.findOne({ center_id: centerId, date: payload.date,  start_time: moment(payload.start_time, 'h:mm a').format('hh:mm a')});
            if (startTime) {
                return res.status(422).json({ errors : [{param :'start_time', msg:"This time is ready exist", startTime}] })
            }

        }
        
        
       
            payload['slot_date_n'] =parseInt(moment(payload.date, 'DD-MM-YYYY').format('DDMMYYYY'))
            payload['start_time']= moment(payload.start_time, 'h:mm a').format('hh:mm a')
            payload['end_time']= moment(payload.end_time, 'h:mm a').format('hh:mm a')
            payload['slot_start_time']= parseInt(moment(payload.start_time, 'h:mm a').format('HHmmss'))
            payload['slot_end_time']= parseInt(moment(payload.end_time, 'h:mm a').format('HHmmss'))
            // payload['center_id']= centerId
            payload['left_bed']= payload.total_bed

            var data = await add(dateSlotsModel, payload)
            console.log(payload)
            return res.status(200).json({data })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

