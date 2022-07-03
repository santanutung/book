
// payment 
const Razorpay = require('razorpay');
const { render } = require('ejs');
const book_appointmentModel = require('../model/book_appointmentModel');
require('dotenv').config()
const moment = require('moment');
const userModel = require('../model/userModel');
const transactionModel = require('../model/transactionModel');
const notificationModel = require('../model/NotificationModel');
const NotificationModel = require('../model/NotificationModel');
const { email_send } = require('../service/helper');
const { add } = require('../service/mongoServices');

// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({

  // Replace with your key_id
  key_id: process.env.rzpy_key,

  // Replace with your key_secret
  key_secret: process.env.rzpy_secret_key
});
// rzpy_key =rzp_test_qq5hIPlizyIRAy
// rzpy_secret_key =uGCDj1l5Aw55PJ3WgROktnM7
//Inside app.js


exports.createOrder = async (req, res) => {
  try {
    // req.headers = {
    //     authentication: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWMwMjI3NGMxZjc0Nzg3MWM4YWM5MDgiLCJlbWFpbCI6InNhZ2FyQGdtYWlsLmNvbSIsImlhdCI6MTY0MDA4NzExNCwiZXhwIjoxNjQ1MjkzMDE0fQ.Ha2BMEYSvFdEhMtCp2zqlEDuyI7Toy7UXiWgukrFVjc',
    //     'content-type': 'application/json'
    // }
    const _id = req.params.id;
    const user_id = req.activeUser.userId;
    console.log(req.headers, user_id);

    const get_appointments = await book_appointmentModel.findOne({ _id, userId: user_id }).populate("userId center_id");
    const user = await userModel.findById({ _id: user_id })
    console.log(user);
    // console.log(get_appointments);
    // return res.status(200).json({get_appointments:get_appointments})
    const amount = get_appointments.charges
    const my_server = process.env.my_server
    const currency = process.env.rzpy_currency;
    const receipt = "receipt#" + moment().format('DDMMYYhhiiss');
    razorpayInstance.orders.create({ amount, currency, receipt },
      (err, order) => {

        if (!err) {
          //   console.log(order);
          res.render('payment', { order, key: process.env.rzpy_key, get_appointments, user, my_server })
          // res.json(order)
        }
        else {
          res.send(err);
        }
      }
    )

  } catch (error) {
    console.log(error);
  }
}
// app.post('/createOrder', (req, res)=>{ 

//   // STEP 1:
//   const {amount,currency,receipt, notes}  = req.body;      

//   // STEP 2:    
//   razorpayInstance.orders.create({amount, currency, receipt, notes}, 
//       (err, order)=>{

//         //STEP 3 & 4: 
//         if(!err)
//           res.json(order)
//         else
//           res.send(err);
//       }
//   )
// });


// app.get("/payment",(req,res)=>{
//   try {
//      res.render('payment')
//   } catch (error) {
//     console.error(error);
//   }
// })


exports.createTransaction = async (req, res) => {
  try {
    console.log(req);

    const payload = req.body;
    console.log(payload, "rating----------------------------- ");
    const user_id = req.activeUser.userId;
    let options = {
      userId: user_id,
      type: payload.type,
      amount: payload.amount,
      order_id: payload.order_id,
      transaction_id: payload.transaction_id,
      dateTime :moment().format('DD/MM/YYYY h:mm a'),
    }
    if (payload.type == 'appointment') {

      options['appointmentId'] = payload.appointment_id;

      
      const newdata = new transactionModel(options);
      await newdata.save();
      let appointment = await book_appointmentModel.findOneAndUpdate({ _id: payload.appointment_id }, { payment_type: 'online', payment_status: 'complete', appointment_status : 'pending' })
      
      var apt =  await book_appointmentModel.findOne({_id:options['appointmentId']})
      console.log("------------------------------",appointment, "34567890")

      var subject = "Appointment booking ";

      var message = "Your dialysis slot has been successfully booked at " + apt.center_id.name + " for " + apt.date + " at " + apt.appointment_start_time + ". "
      
      console.log(message)
      await email_send(req.activeUser.userId, subject, message)

      let notification_option = {
          center_id: apt.center_id,
          message: apt.appointment_key + " has been booked on " + apt.date + " at " + apt.appointment_start_time,
          date: moment().format('DD/MM/YYYY h:mm a'),
          type: 'center',
          module: 'appointment'
      };
     
      var notification = await add(notificationModel, notification_option);
      return res.status(200).json({ mesaage: "create book", notification: notification })


      


    }
    else if (payload.type == 'wallet') {
      const newdata = new transactionModel(options);
      await newdata.save();
      const data = await userModel.findOne({ _id: user_id });
      
      // let appointment = await userModel.updateOne({ _id: user_id }, { wallet_amount: parseInt(data.wallet_amount) + parseInt(payload.amount) })
    }

    // if(payload.payment_type != 'online') {
      // var appointment = book_appointmentModel.findOne({_id:payload.appointment_id}).populate('center_id')
      // var subject = "Appointment mail";
      // var message = "Your appointment has been successfully booked on "+appointment.date+" at "+appointment.start_time
      // await email_send(user_id, subject, message)
      console.log("------------------------------",appointment, "34567890")

      var subject = "Appointment booking ";

      var message = "Your dialysis slot has been successfully booked at " + appointment.center_id.name + " for " + appointment.date + " at " + appointment.appointment_start_time + ". "
      // var message = "Your appointment has been successfully booked on "+slot.date+" at "+slot.start_time
      console.log(message)
      await email_send(req.activeUser.userId, subject, message)

      let notification_option = {
          center_id: appointment.center_id,
          message: appointment.appointment_id + " has been booked on " + appointment.date + " at " + appointment.appointment_start_time,
          date: moment().format('DD/MM/YYYY h:mm a'),
          type: 'center',
          module: 'appointment'
      };
      //   await add(notificationModel, options);
      var notification = await add(notificationModel, notification_option);
      return res.status(200).json({ mesaage: "create book", data: newData, notification })


      

      let notification_options = {
          center_id: slot.center_id,
          message: appointment.appointment_id + " has been booked on "+slot.date+" at "+slot.start_time,
          date: moment().format('DD/MM/YYYY h:mm a'),
          type:'center',
          module:'appointment'
      };
      //   await add(notificationModel, options);
      var notification = await add(NotificationModel, notification_options);

  // }

    return res.status(200).json({ message: "add transaction", notification })


  } catch (error) {
    console.log(error);
  }
}


exports.allTransactions = async (req, res) => {
  try {
    try {
      const user_id = req.activeUser.userId;
      console.log(user_id, "active user")
      const data = await transactionModel.find({ userId: user_id }).sort({'created_at' : -1});
      // const centerratings = await RatingModel.find({center_id:payload.center_id});

      return res.status(200).json({ data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }

  } catch (error) {
    console.log(error);
  }
}


