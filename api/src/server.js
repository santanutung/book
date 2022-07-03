'use strict'
const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser').json({ limit: '100mb' });
const http = require('http');
const bodyprsr = require('body-parser').urlencoded({ extended: true })
const authRoutes = require('./routes/auth.Routes');
const db = require('./config/databaseConnection');
const center = require('./controller/centersController');
const path = require('path');
const validation = require('./utilities/validation');
const appointment_slots = require('./controller/appointmentSlotController')
const socket = require('./socketIo/live')
const server = http.createServer(app);
const { Server } = require("socket.io");
const testdb = require('../src/config/createPermission');
const adminToken = require('./middleware/adminToken');
const employRoutes = require('./routes/employ.Routes');
const centersController = require('../src/controller/centersController');
const admin_Routes = require('../src/routes/admin.Routes');
const { validationResult } = require('express-validator');
const userModel = require('./model/userModel');
const patientRoutes = require('./routes/patient.Routes');
const centerAppRoutes = require('./routes/center.app.Routes');
const userController = require('../src/controller/userController');
const appointmentController = require('../src/controller/appointmentSlotController');
const familyMemberModel = require('../src/model/familyMemberModel');
const SettingController = require('./controller/settingContontroller');
const appJwt = require('../src/middleware/centerAppToken');
const patientsController = require('./controller/patientsController')

const moment = require('moment')
patientsController.bookAppointmentCancel().then(data => {
  // console.log(data);
})
// update center data

// const centerModel = require('./model/centers.Model');



// async function name() {
//  var coordinates = [-83.97,76.77]
//  var payload ={}
//  var test = {status:"active"}
//   payload['location'] = {"coordinates":coordinates}
//     const data = await centerModel.find()
//    console.log(data.length);
//     for(var i =0;i<data.length;i++){
//       console.log(data[i]._id,">>>>");
//       await centerModel.updateOne({_id:data[i]._id},payload)
//       await centerModel.createIndexes({location: '2dsphere' })
//     }
//     console.log("yes");
//     return
// }

// name()










const Razorpay = require('razorpay')
const shortid = require('short-id');
const book_appointmentModel = require('./model/book_appointmentModel');
const { array } = require('./utilities/multer');
const { centerUpdateMailSend } = require('./config/emailService');
const centersModel = require('./model/centers.Model');

testdb()
db.connect();

const io = new Server(server, {
  cors: '*'
});

app.use(cors('*'))
app.options('*', cors());

app.use('/admin', adminToken)
app.use('/static', express.static(path.join(__dirname, '../upload/image')));
app.use('/static', express.static(path.join(__dirname, '../upload/images')));
app.use('/files', express.static(path.join(__dirname, '../upload/pdf')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

socket.io(server)
app.use(bodyprsr)
app.use(bodyParser)

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));


app.use('/admin', admin_Routes)
app.use('/admin/employee', employRoutes)

//add-family-member  start



app.post('/private/patient/add-family-member', validation.familyMamber, async (req, res) => {
  // console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.msg,
      errors: errors.errors
    });
  }
  else {
    await familyMemberModel.create(req.body).catch(err => {
      return res.status(500).json({ err: err })
    });
    return res.send('done')
  }
});



app.get('/private/patient/family-member', async (req, res) => {
  try {
    var data = await familyMemberModel.find();
    res.status(200).json({ data: data })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

});
app.get('/private/patient/family-member/:id', async (req, res) => {
  try {
    var id = req.params.id
    var data = await familyMemberModel.findOne({ _id: id });
    res.status(200).json({ data: data })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

});
app.get('/private/patient/family-member', async (req, res) => {
  try {
    var data = await familyMemberModel.find();
    res.status(200).json({ data: data })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

});

app.get('/private/patient/family-member-find/:phone', async (req, res) => {
  try {
    var phone = req.params.phone
    var user = await userModel.findOne({ phone: phone, UserType: "patients" });
    if (!user) {
      return res.status(422).json({ error: "user not match" })
    }
    var data = await familyMemberModel.find({ user_id: user._id })
    let data1 = {
      //  user:user,
      familyMambers: data
    }
    return res.status(200).json({ data: data1 })
  } catch (error) {
    return res.status(500).json({ error: error })
  }

});

// end add-family-member




app.use('/auth', authRoutes);



// slots api


app.get('/slots', appointmentController.createDateSlots)









// end slots api




app.post('/admin/register', userController.register)
// app.post('/center-register',upload.single('primaryImage'),center.registerApp);

app.post('/admin/center', validation.adminCenterRegister, center.registerCenter);
app.post('/auth/center/register', validation.appCenterRegister, center.registerCenterApp);
app.get('/admin/center', center.centerList);
app.get('/admin/center-time-list', center.centerAllList);
app.get('/admin/center/:id', center.centerDetails);
app.put('/admin/center-verify/:id', center.centerVerfiyUpdate);
app.put('/admin/center-time/:id', center.centerTimeUpdate);
app.post('/admin/center-time/:id',  validation.centerTime, center.centerTimeAdd);
app.delete('/admin/center-time/:id/:slot', center.centerTimeDelete);
app.get('/admin/center-time/:id', center.centerTimedDetails)
app.put('/admin/center/:id', validation.updateCenter,center.centerUpdate);
app.put('/admin/center-detail/:id',center.centerProfileEdit);
app.get('/admin/appointment', appointment_slots.create_appointment_slots);

// app.get('/',)

// center app url

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

app.use('/private', appJwt, centerAppRoutes);
app.get('/private/center/profile', appJwt, centersController.centerProfile);
app.get('/setting/:type', SettingController.settingClientType)
app.use('/patients/api/', patientRoutes)




// app.use('/',(req,res)=>{
//   res.render('head')
// })



app.use('/payment-error', (req, res) => {
  res.render('paymentError')
})







const instance = new Razorpay({
  key_id: 'rzp_test_L2zWcegobm7lNI',
  key_secret: 'WQ2SMYZsZ7JtI2OJD0vIGssn'
})

app.post('/razorpay', async (req, res) => {
  // console.log(req, "n                         jhgfhdsrhgkgjh  ")
  // console.log(req.query, "razor pay -------------------------------------------------")
  // return res.send("ok")
  const payment_capture = 1
  const amount = req.query.total
  const currency = 'INR'
  const options = {
    amount: amount * 100,  // the amount is entered in subunits
    currency: currency,
    receipt: shortid.generate(),
    payment_capture: payment_capture,
    notes: req.body
  }
  try {
    const response = await instance.orders.create(options)
    // console.log(response)
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      userID: req.body.userID,
      email: req.body.email, // Add active user’s name
      plan: req.body.plan,
      start_date: req.body.start_date,
      last_till: req.body.last_till
    })
  } catch (error) {
    console.log(error);
    console.log(error)
  }
})


// app.use(express.static(path.resolve(__dirname, "./../web/patientbuild")));
// app.use(express.static(path.resolve(__dirname, "./../web/admin/build")));

// app.use(express.static(path.resolve(__dirname, "./../web/center/build")));
// Handle GET requests to /api route
// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from server!" });
// });
// // All other GET requests not handled before will return our React app
// app.get("*", (req, res) => {

//   res.sendFile(path.resolve(__dirname, "./../web/patientbuild", "index.html"));
// });

// app.get("/admin1", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./../web/admin/build", "index.html"));
// });

// app.get("/center", (req, res) => {

//   res.sendFile(path.resolve(__dirname, "./../web/center/build", "index.html"));
// });



// app.get("/admin/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./../web/admin/build", "index.html"));
// });

// app.get("/center", (req, res) => {

//   res.sendFile(path.resolve(__dirname, "./../web/center/build", "index.html"));
// });




app.get('/all-center', async (req, res) => {
  const data = await userModel.find({ UserType: "center" })
  res.render('allcenter', { data })
})



app.get('/center-only-payment-appointment', async (req, res) => {
  var date = parseInt(moment().format('DDMMYYYYHHmmss'))

  const data = await book_appointmentModel.find({ 'payment_type': "online", 'payment_status': 'pending' })
  // console.log(parseInt(date) - parseInt(data[0].appointment_id), "-----------------");
  var appoinntment_data = []
  for ( var i = 0; i < data.length ; i++) {
    var tt =data[i]['tt'] = date - data[i].appointment_id
    // if (tt > 1500) {
   
      appoinntment_data.push({t1: date +"-"+ data[i].appointment_id ,tt})

      var id = data[i]._id

      var apt = await book_appointmentModel.findOne({ _id: id });
      if (apt.appointment_status !== 'cancelled') {
        var appointment = await book_appointmentModel.deleteOne({ _id: id });

        var slot = await date_slotsModel.findOne({ _id: apt.slot_id });
  
        var date_slot = await date_slotsModel.findOneAndUpdate({ _id: apt.slot_id }, { left_bed: slot.left_bed + 1, book_slots: parseInt(slot.book_slots) - 1 });
       
      }
     


      // }
  }
  res.send(appoinntment_data)
  // res.render('allcenter',{data})
})





server.listen(8447, () => {
  console.log('listening on *:8447');
});






