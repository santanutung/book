  
const {check,validationResult,param} = require('express-validator');
const centerModel = require('../model/centers.Model');
const appointmentSlotsModel = require('../model/appointment_slotsModel');
const patientModel = require('../model/patientsModel');

const userModel = require('../model/userModel');
const morbiditiesModel = require('../model/morbiditiesModel');

const centerDocumentCategoryModel = require('../model/center_documentsCategoryModel')
const partnerModel = require('../model/patientsModel')
const familyMemberModel = require('../model/familyMemberModel')
const testimonialModel =require('../model/testimonialModel')
// 

// exports.errorValidationResult = (req) =>{
//     return new Promise((resolve,reject)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//        return res.status(422).json({
//             message: errors.msg,
//             errors: errors.errors
//         });
//     }
//     });
// }

const centerTimeWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

const bloodGorup = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
	'O-'
]

exports.uploadGallery = [
    check('images').notEmpty().isArray(),
    check("images.*.image").notEmpty().withMessage('This field is required'),
    check("images.*.is_primary").notEmpty().withMessage('This field is required').isNumeric()
]
exports.updateGallery = [
    check("image").notEmpty().withMessage('This field is required'),
    check("is_primary").notEmpty().withMessage('This field is required').isNumeric()
]

exports.login = [
    check("email","Invalid email !").isString().isLength(),
    check("password","password mmust be within 6 to 20 charactar !")
    // .isLength({min:6},{max:20}),
]
exports.Userlogin = [
    check("phone","Invalid phone !").isString().isLength(),
    check("password","password mmust be within 6 to 20 charactar !").notEmpty()
    // .isLength({min:6},{max:20}),
]


exports.center = [
    check('name','This field is required').isString().isLength(),
    check('email','required email').isEmail().isLength(),
    check('contact_no','required contact_no').isString().isLength(),
    check('addition_contact_no','required addition_contact_no').isString().isLength(),
    check('address','required address').isString().isLength(),
    check('state','required state').isString().isLength(),
    check('city','required city').isString().isLength(),
    check('pincode','required pincode').isString().isLength(),
    check('total_beds','required total_beds').isString().isLength(),
    check('introduction','required introduction').isString().isLength(),
    check('verify_status','required verify_status').isString().isLength(),
    // check('times','required times').isArray(),
    
]
// centerName: centerName,
//             centerManager: centerManager,
//             email: email,
//             contact_no: contact,
//             address: address,
//             state: state,
//             city: city,
//             pincode: pincode,
//             latitude: latitude,
//             longitude: longitude,
//             primaryImage: centerImage,

exports.centerAppRegister = [
    check('centerName','This field is required').isString(),
    check('centerManager','This field is required').isString(),
    check('email','This field is required').isEmail(),
    check('contact_no','This field is required').isString(),
    check('addition_contact_no','This field is required').isString(),
    check('address','This field is required').isString(),
    check('state','This field is required').isString(),
    check('city','This field is required').isString(),
    check('pincode','This field is required').isString(),
    check('latitude','This field is required').isString(),
    check('longitude','This field is required').isString(),
    check('primaryImage','This field is required').isString().notEmpty(),
    // check('times','required times').isArray(),
    
]

// admin center validation
exports.appCenterRegister = [

    check('name').notEmpty().withMessage('This field is required'),
    check('center_manager','This field is required'),
    // check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email id'),
    // check('contact_no','This field is required').isString(),
    check('email').notEmpty().isEmail().withMessage("invalid Email").custom((input)=>{
        return userModel.findOne({email:input, userType:'center'}).then(data=>{
            if(data){
                throw new Error("Please try with a different Email Id.")
            }
        })
    }),


    // check('contact_no','This field is required').isString().notEmpty().withMessage('This field is required'),

    check("contact_no").notEmpty().isString().withMessage("Invalid input").custom((input)=>{
        return userModel.findOne({phone:input, userType:'center'}).then(data=>{
            if(data){
                throw new Error("Try unique phone number-Phone number already exists")
            }
        })
    }),


    check('address','This field is required').isString(),
    check('state','This field is required').isString(),
    check('city','This field is required').isString(),
    check('pincode','This field is required').isString(),
    check('latitude','This field is required').notEmpty(),
    check('longitude','This field is required').notEmpty(),
    check('image','This field is required').notEmpty(),
    
]





exports.updateCenter = [

    check('name').notEmpty().withMessage('This field is required'),
    check('center_manager','This field is required'),
    // check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email id'),
    // check('contact_no','This field is required').isString(),
    check('email').notEmpty().isEmail().withMessage("invalid Email").custom((input,{req})=>{
        return userModel.findOne({email:input, UserType:'center', center_id : {$ne : req.params.id}}).then(data=>{
            if(data){
                console.log(data, "validation")
                throw new Error("Please try with a different Email Id.")
            }
        })
    }),


    // check('contact_no','This field is required').isString().notEmpty().withMessage('This field is required'),

    check("contact_no").notEmpty().isString().withMessage("Invalid phone no.").custom((input,{req})=>{
        return userModel.findOne({phone:input, UserType:'center', center_id : {$ne : req.params.id}}).then(data=>{
            console.log(data,'-----------------------------validation')
            if(data){
                throw new Error("Try unique phone number-Phone number already exists")
            }
            
        })
    }),


    check('address','This field is required').isString(),
    check('state','This field is required').isString(),
    check('city','This field is required').isString(),
    check('pincode','This field is required').isString(),
    check('latitude','This field is required').notEmpty(),
    check('longitude','This field is required').notEmpty(),
    // check('image','This field is required').notEmpty(),
    
]

// admin center validation
exports.adminCenterRegister = [

  

    check('name').notEmpty().withMessage('This field is required'),
    check('center_manager','This field is required').notEmpty().withMessage('This field is required'),
    // check('email','This field is required').isEmail().notEmpty().withMessage('This field is required'),

    check('email').notEmpty().isEmail().withMessage("invalid Email").custom((input)=>{
        return userModel.findOne({email:input, userType:'center'}).then(data=>{
            if(data){
                throw new Error("Please try with a different Email Id.")
            }
        })
    }),


    // check('contact_no','This field is required').isString().notEmpty().withMessage('This field is required'),

    check("contact_no").notEmpty().isString().withMessage("Invalid input").custom((input)=>{
        return userModel.findOne({phone:input, userType:'center'}).then(data=>{
            if(data){
                throw new Error("Try unique phone number-Phone number already exists")
            }
        })
    }),

    check('address','This field is required').isString().notEmpty().withMessage('This field is required'),
    check('state','This field is required').isString().notEmpty().withMessage('This field is required'),
    check('city','This field is required').isString().notEmpty().withMessage('This field is required'),
    check('pincode','This field is required').isString().notEmpty().withMessage('This field is required'),
    check('latitude','This field is required').notEmpty().withMessage('This field is required'),
    check('longitude','This field is required').notEmpty().withMessage('This field is required'),
    check('introduction','This field is required'),
    // check('image','This field is required').isString().notEmpty().withMessage('This field is required'),
    check('times.*.day').notEmpty().withMessage('This field is required').isIn(centerTimeWeek).withMessage(`${centerTimeWeek}`),
    check('times.*.opening_time').notEmpty().withMessage('This field is required'),
    check('times.*.closing_time').notEmpty().withMessage('This field is required'),
    check('times.*.status').optional().notEmpty().withMessage('This field is required'),
    
]


exports.testiMonial = [
    check("review").notEmpty().withMessage('This field is required').isLength({min:3}).withMessage('Please enter atleast 30 characters')
]
exports.AdmintestiMonial = [
    param('id').customSanitizer(value => {
        //console.log(value)
        return testimonialModel.findOne({'_id':value}).then(err=>{
            if(err) {
                //console.log(err.CastError,'--------')
                return Promise.reject('try valid id')
            }
        })
      }),
    check("verify_status").notEmpty().withMessage('This field is required'),
    check("status").notEmpty().withMessage('This field is required')
]

// verify_status: 
//     status:
exports.centerAppLogin = [
    check('email','This field is required').isString().notEmpty(),
    check('password','This field is required').isString().notEmpty(),
]
exports.appointmentSlot = [
    // check('center_id','This field is required').custom((value,{req} )=> {
    //     return centerModel.findOne({_id:value}).catch(function(center) {
    //         if (center) {
    //             throw new Error('invalid center id');
    //         }
    //     })
    // }),
   
    check('day','This field is required').isIn(centerTimeWeek).notEmpty(),
    check('start_time','This field is required').notEmpty().custom((value,{req} )=> {
        return appointmentSlotsModel.findOne({day:req.body.day,end_time:req.body.end_time,start_time:req.body.start_time}).then(function(center) {
            if (center) {
                throw new Error('unique star time');
            }
          
        })
    }),
    check('end_time','This field is required').notEmpty().custom((value,{req} ) => {
        return appointmentSlotsModel.findOne({day:value,end_time:req.body.end_time,start_time:req.body.start_time}).then(function(center) {
            if (center) {
                throw new Error('unique end time');
            }
          
        })
    }),
    check('total_beds','This field is required').notEmpty(),

]

exports.adminAppointmentSlot = [
    // check('center_id','This field is required').custom((value,{req} )=> {
    //     return centerModel.findOne({_id:value}).catch(function(center) {
    //         if (center) {
    //             throw new Error('invalid center id');
    //         }
    //     })
    // }),
   
    check('day','This field is required').isIn(centerTimeWeek).notEmpty(),
    check('start_time','This field is required').notEmpty().custom((value,{req} )=> {
        return appointmentSlotsModel.findOne({day:req.body.day,end_time:req.body.end_time,start_time:req.body.start_time, center_id:req.params.center_id}).then(function(center) {
            if (center) {
                throw new Error('unique star time');
            }
          
        })
    }),
    check('end_time','This field is required').notEmpty().custom((value,{req} ) => {
        return appointmentSlotsModel.findOne({day:value,end_time:req.body.end_time,start_time:req.body.start_time, center_id:req.params.center_i}).then(function(center) {
            if (center) {
                throw new Error('unique end time');
            }
          
        })
    }),
    check('total_beds','This field is required').notEmpty(),

]


exports.appointmentSlotUpdate = [
    // check('center_id','This field is required').custom((value,{req} )=> {
    //     return centerModel.findOne({_id:value}).catch(function(center) {
    //         if (center) {
    //             throw new Error('invalid center id');
    //         }
    //     })
    // }),
   
    // check('day','This field is required').isIn(centerTimeWeek).notEmpty(),
    check('start_time','This field is required').notEmpty().custom((value,{req} )=> {
        // //console.log(req.body,':gh');
        return appointmentSlotsModel.findOne({day:req.body.day,end_time:req.body.end_time,start_time:req.body.start_time, _id : {$ne :req.params.update}}).then(function(center) {
            if (center) {
                throw new Error('unique end_time');
            }
            // if(req.body.start_time === req.body.end_time){
            //     throw new Error('unique  start_time and endtime');  
            // }
        })
    }),
    check('end_time','This field is required').notEmpty().custom((value,{req} ) => {
        return appointmentSlotsModel.findOne({day:value,end_time:req.body.end_time,start_time:req.body.start_time, _id : {$ne :req.params.update}}).then(function(center) {
            //console.log(req.body);
            //console.log(center);
            if (center) {
                throw new Error('unique end_time');
            }
           
            // if(req.body.start_time === req.body.end_time){
            //     throw new Error('unique  start_time and endtime');  
            // }
        })
    }),
    check('total_beds','This field is required').notEmpty(),

]

exports.centerDocumentsUpload = [
    check('title','check').notEmpty,
    check('document','check').notEmpty
]



exports.centerTime = [
    
    check('day', 'This field is required').isIn(centerTimeWeek).withMessage("accpt value "+centerTimeWeek).notEmpty().custom((input,{req})=>{
        console.log(req.centerId?req.centerId : req.params.id,">>>>ID<<<<<<<<<<")
        return centerModel.findOne({_id:req.centerId?req.centerId : req.params.id,'times.day':input}).then((day=>{
            console.log(req.centerId,">>>>ID<<<<<<<<<<")
            console.log(day,">>>>>>>");
    
           if(day){
                    return Promise.reject('Day already exsits')

           }
            console.log(day)
        }))
    }),
    check('opening_time', 'This field is required').notEmpty(),
    check('closing_time', 'This field is required').notEmpty()
]



exports.centerTimeUpdate = [
    check('day', 'This field is required').isIn(centerTimeWeek).notEmpty(),
    check('opening_time', 'This field is required').isString().notEmpty(),
    check('closing_time', 'This field is required').isString().notEmpty()
]


exports.centerTimeParam = [
    param('id').customSanitizer(value => {
        //console.log(value)
        return centerModel.findOne({'times._id':value}).then(err=>{
            if(err) {
                //console.log(err.CastError,'--------')
                return Promise.reject('try valid id')
            }
        })
      }),
]



exports.centerProfileUpdate = [
    check('center_manager').notEmpty().withMessage('This field is required').isString().withMessage('invalid input type'),
    check('insurance_billing_facility').notEmpty().withMessage( 'This field is required'),
    check('total_beds', 'This field is required').notEmpty().withMessage( 'This field is required'),
    check('number_of_technician', 'This field is required').notEmpty().isString(),
    check('charges', 'This field is required').notEmpty(),
    check('doctor_availability', 'This field is required').notEmpty().isString().isIn(['Yes','No']),
    check('sitting_area', 'This field is required').notEmpty().isString().isIn(['Yes','No']),
    check('availability_pharmancy', 'This field is required').isString().isIn(['Yes','No']),
    check('life_saving_drug', 'This field is required').notEmpty().isString().isIn(['Yes','No']),
    check('dialysis_per_month', 'This field is required').notEmpty().isString(),
   
]

exports.demo =[
    check('image', 'Please upload an image Jpeg, Png').isString().notEmpty(),
    check('demo','check').isString().notEmpty()
//     check('image', 'Please upload an image Jpeg, Png').custom((value, {req}) => {
//         if(req.files.mimetype === 'application/jpg'){
//             return '.pdf'; // return "non-falsy" value to indicate valid data"
//         }else{
//             return false; // return "falsy" value to indicate invalid data
//         }
//     })
// .withMessage('Please only submit pdf documents.'), 
    
]


exports.patientsRegister  =[
    check('name').isString().withMessage("accept only string").notEmpty().withMessage('This fields is required'),
    check('email').isEmail().withMessage("Invalid Email.").notEmpty().withMessage('This fields is required').custom((input,{req})=>{
        return userModel.findOne({email:input}).then(email=>{
            if(email){
                return  Promise.reject('This email is already exists')
            }
        })
    }),
    check('phone').isMobilePhone().withMessage('valid  Mobile Number').notEmpty().withMessage('This fields is required'),
    check('password','This fields is required').isString().withMessage("invalid Input").notEmpty().withMessage("This fields is required"),
    check('confirmPassword').isString().withMessage("invalid Input").notEmpty().withMessage("This fields is required").custom(async (confirmPassword, {req}) => {
        const password = req.body.password
     
        if(password !== confirmPassword){
          throw new Error('Passwords must be same')
        }
      }),
    check('address','This fields is required').isString(),
    check('dob').notEmpty().withMessage('This fields is required').isDate().withMessage('invalid Date time'),
    check('gender').notEmpty().withMessage("This field is required").isIn(['Male','Female']).withMessage("blood Group invalid ."),
    check('profile_photo_path','This field is required'),
    check('blood_group').notEmpty().withMessage('This field is required').isIn(bloodGorup).withMessage("blood Group invalid .")
]



exports.familyMamber =[
    check('user_id').notEmpty().withMessage('This fields is required').custom((input,{req})=>{
     return userModel.findOne({_id:input}).then(day=>{
         if(!day){
             return Promise.reject('invalid UserId')
         }
     })
    }),
    check('name').isString().withMessage("accept only string").notEmpty().withMessage('This fields is required'),
    check('status').isString(),
    check('phone').notEmpty().withMessage('This fields is required'),
    check('address','This fields is required').isString(),
    check('dob').notEmpty().withMessage('This fields is required'),
    check('gender').notEmpty().withMessage("This field is required").isIn(['Male','Female']).withMessage("blood Group invalid ."),
    check('profile_photo_path','This field is required'),
    check('blood_group').notEmpty().withMessage('This field is required').isIn(bloodGorup).withMessage("blood Group invalid ."),
    check('dialysis_suhedule').notEmpty().withMessage('This field is required'),
    check('dis').isString().withMessage('This field is required')
]

exports.book_appointment = [
    check('date').isString().withMessage('This field is required').notEmpty().withMessage('Invalid Input Type'),
    check('slot_id').isString().withMessage('This field is required').notEmpty().withMessage('Invalid Input Type'),
    // check('charges').isString().withMessage('This field is required').notEmpty().withMessage('This field is required'),
    // check('date').isString().withMessage('This field is required').notEmpty().withMessage('Invalid Input Type'),
    // check('patient').isString().withMessage('').notEmpty().withMessage('').custom((input,{req})=>{
    //     return patientModel.findOne({_id:input}).then((data)=>{
    //         if(!data){
    //             return userModel.findOne({_id:input}).then((data)=>{
    //                 if(!data){
    //                     return Promise.reject('invalid patient and user id')
    //                 }
    //             })
    //         }
    //     })
    // }),
    // check('payment_status').notEmpty().withMessage('This field is required').isString().withMessage('Invalid Input Type'),
    // check('appointment_status').notEmpty().withMessage('This field is required').isString('Invalid Input Type'),
    // check('weight').notEmpty().withMessage('This field is required').isString('Invalid Input Type'),
    // check('after').notEmpty().withMessage('This field is required').isString('Invalid Input Type'),
    // check('bookBy').notEmpty().withMessage('This field is required').isString('Invalid Input Type')
]



exports.morbiditie = [
    check('title').isString().withMessage('invalid  value').notEmpty().withMessage('This field is required').custom((input,{req})=>{
        return morbiditiesModel.findOne({title:input}).then((err)=>{
            if(err){
                return  Promise.reject('This field is required')
            }
        })
    }),
]

exports.centerDocumentCategory = [
    check('title').isString().withMessage('invalid input type').notEmpty().withMessage('This field is required')
    .custom((input,{req})=>{
        return centerDocumentCategoryModel.findOne({title:input}).then(data=>{
            if(data){
                return Promise.reject('unique  fields')
            }
        })
    })
]


// {
//     "image":"kjhgfd",
//     "email":"sachin@gmail.com",
//     "phone":"987654876",
//     "dob":"12/09/1998",
//     "gender":"male",
//     "insurance_no":"89765"
// }

exports.RegisterPatients =[
    check('image').optional(),
    check('email').notEmpty().isEmail().withMessage("invalid Email").custom((input)=>{
        return userModel.findOne({email:input, userType:'patients'}).then(data=>{
            if(data){
                throw new Error("Please try with a different Email Id.")
            }
        })
    }),
    check("phone").notEmpty().isString().withMessage("Invalid input").custom((input)=>{
       
        return userModel.findOne({phone:input, userType:'patients'}).then(data=>{
            if(data){
                console.log(input, "input phone")
                throw new Error("Try unique phone number-Phone number already exists")
            }
        })
    }),
    check("dob").notEmpty().toDate().withMessage("invalid date type"),
    // check("gender").isIn(['male,female']).withMessage("invalid input"),
    check('gender').notEmpty().withMessage("This field is required"),
    // .isIn(['Male','Female']).withMessage("Invalid input"),

    check("insurance_no").optional(),
    check('password','This fields is required').isString().withMessage("invalid Input").notEmpty().withMessage("This fields is required").isLength({min:6, max:50}),

]


exports.enquireForm =[
    // name, email, subject, message
    // check('name').notEmpty().withMessage("This field is required").isString().withMessage("invalid input").isLength({min:2}),
    // check('email').notEmpty().withMessage("This field is required").isEmail().withMessage("invalid email"),
    check('subject').notEmpty().withMessage("This field is required").isString().withMessage("invalid subject"),
    check('message').notEmpty().withMessage("This field is required").isString().withMessage("invalid input").isLength({min:2}),
]


exports.patnerForm = [
    check('name').notEmpty().withMessage("This field is required").isString().withMessage("invalid input").isLength({min:2}),
    check("image").notEmpty().withMessage("This field is required")
]

// {\"slot_id\":\"61d19626f4270ecc2f90ba54\",\"patient_id\":\"\",\"payment_type\":\"cash\"}
exports.bookAppointmentPatients = [
    check('slot_id').notEmpty().withMessage("This field is required"),
    check('patient_id').optional().notEmpty().withMessage("This field is required").custom((input,{req})=>{
        return familyMemberModel.findById({_id:input}).then(data=>{
            if(!data){
                throw new Error('try valid patients id')
            }
        })
    }),
    check('payment_type').notEmpty().withMessage("This field is required")
]

// user_id:
// relation:
// insurance_no:
// name:
// profile_photo_path: 
// status:

// blood_group:

// phone: 

// dob: 
// gender: 

exports.patientfamilyMamber = [
    check('name').notEmpty().isString().withMessage("invalid relation"),
    check('relation').notEmpty().isString().withMessage("invalid relation"),
    // check('email').notEmpty().isEmail().withMessage("invalid email"),
    // check('profile_photo_path').notEmpty().isString().withMessage("invalid profile_photo_path"),
    // check("phone").notEmpty().isString().withMessage("Invalid input"),
    check('blood_group').notEmpty().withMessage('This field is required').isIn(bloodGorup).withMessage("blood Group invalid "+bloodGorup),
    check("dob").notEmpty().isString().withMessage("invalid date type"),
    check('gender').notEmpty().withMessage("This field is required"),
    // .isIn(['male','female', 'prefer not to say']).withMessage("Invalid input"),
    check("insurance_no").optional(),
]
exports.patientUpdatefamilyMamber = [
    check('name').optional().notEmpty().isString().withMessage("invalid relation"),
    check('relation').optional().notEmpty().isString().withMessage("invalid relation"),
    // check('email').notEmpty().isEmail().withMessage("invalid email"),
    check('profile_photo_path').optional().notEmpty().isString().withMessage("invalid profile_photo_path"),
    check("phone").optional().notEmpty().isString().withMessage("Invalid input"),
    check('blood_group').optional().notEmpty().withMessage('This field is required').isIn(bloodGorup).withMessage("blood Group invalid "+bloodGorup),
    check("dob").optional().notEmpty().isString().withMessage("invalid date type"),
    check('gender').optional().notEmpty().withMessage("This field is required"),
    // .isIn(['male','female', 'prefer not to say']).withMessage("Invalid input"),
    check("insurance_no").optional().optional(),
]

// user_id
// patient_id
// file
// title
exports.patientsReports = [
    check('patientId').notEmpty().isString().withMessage("invalid relation")
    .custom((input,{req})=>{
        return familyMemberModel.findOne({_id:input}).then(data=>{
            if(!data){
                return Promise.reject('invalid patientId')
            }
        }).catch((err)=>{
            if(err){
                return Promise.reject('invalid patientId')
            }
        })
    }),
    check('file').notEmpty().isString().withMessage("invalid file"),
    check("title").notEmpty().isString().withMessage("Invalid input"),

]

exports.updateUserProfile =[
    check('image').optional(),
    check('email').notEmpty().isEmail().withMessage("invalid Email").custom((input,{req})=>{
             return userModel.findOne({email:input, _id: { $ne: req.activeUser.userId }, UserType:'patients' }).then(data=>{
            if(data){
                throw new Error("Please try with a different Email Id." )
            }
        })
    }),
    // .custom((input)=>{
    //     return userModel.findOne({email:input, _id: { $ne:  } }).then(data=>{
    //         if(data){
    //             throw new Error("try unique email")
    //         }
    //     })
    // }),
    check("phone").notEmpty().isString().withMessage("Invalid input").custom((input,{req})=>{
        return userModel.findOne({phone:input, _id: { $ne: req.activeUser.userId }, UserType:'patients' }).then(data=>{
            if(data){
                throw new Error("Try unique phone number-Phone number already exists")
            }
        })
    }),
    check("dob").notEmpty().toDate().withMessage("invalid date type"),
    // check("gender").isIn(['male,female']).withMessage("invalid input"),
    check('gender').notEmpty().withMessage("This field is required").isIn(['male','female']).withMessage("Invalid input"),

    check("insurance_no").optional(),
    // check('house_no').notEmpty().withMessage("This field is required"),
    // check('city').notEmpty().withMessage("This field is required"),
    // check('state').notEmpty().withMessage("This field is required"),
    // check('pincode').notEmpty().withMessage("This field is required"),
   
]

exports.rating = [
    check('center_id').notEmpty().withMessage('This field is required').custom((input)=>{
       return centerModel.findOne({_id:input}).then((data)=>{
           if(!data){
               return Promise.reject("center not exit")
           }
       })
    }),
    check('review').notEmpty().withMessage('This field is required').isString().withMessage("Invalid input type"),
    check('Cleanliness_rating').notEmpty().withMessage('This field is required').isString().withMessage("Invalid input type"),
    check('Hygiene_rating').notEmpty().withMessage('This field is required').isString().withMessage("Invalid input type"),
    check('Service_rating').notEmpty().withMessage('This field is required').isString().withMessage("Invalid input type"),
]



exports.patientsForgotPassword  =[
    check('otp', 'This fields is required').notEmpty().withMessage('This fields is required'),
    check('phone').isMobilePhone().withMessage('valid  Mobile Number').notEmpty().withMessage('This fields is required'),
    check('password','This fields is required').isString().withMessage("invalid Input").notEmpty().withMessage("This fields is required"),
    check('confirmPassword').isString().withMessage("invalid Input").notEmpty().withMessage("This fields is required").custom(async (confirmPassword, {req}) => {
        const password = req.body.password
     
        if(password !== confirmPassword){
          throw new Error('Passwords must be same')
        }
      }),
   
]

exports.patientsReview  =[
    check('review', 'This fields is required').notEmpty().withMessage('This fields is required'),
    check('cleanliness_rating', 'This fields is required').notEmpty().withMessage('This fields is required'),
    check('service_rating', 'This fields is required').notEmpty().withMessage('This fields is required'),
    check('hygiene_rating', 'This fields is required').notEmpty().withMessage('This fields is required')
   
   
   
]




exports.appointmentDateSlotUpdate = [
 
    check('start_time','This field is required').notEmpty(),
    check('end_time','This field is required').notEmpty(),
    check('total_bed','This field is required').notEmpty()

]


exports.addBlog = [
    check("image").notEmpty().withMessage('This field is required'),
    check("short_description").notEmpty().withMessage('This field is required'),
    check("description").notEmpty().withMessage('This field is required'),
    check("title").notEmpty().withMessage('This field is required')
]

exports.editBlog = [
    // check("image").notEmpty().withMessage('This field is required'),
    check("short_description").notEmpty().withMessage('This field is required'),
    check("description").notEmpty().withMessage('This field is required'),
    check("title").notEmpty().withMessage('This field is required')
]


exports.centerEnquiryValidation =[
    check("name").notEmpty().withMessage('This field is required'),
    check("phone").notEmpty().withMessage('This field is required').isNumeric({min:10,max:10}).withMessage("invalid Mobile Bumber"),
    check("email").notEmpty().withMessage('This field is required').isEmail().withMessage("invalid email address"),
    check("address").notEmpty().withMessage('This field is required'),
    check("message").notEmpty().withMessage('This field is required'),
]
// name:{
//     type:String
// },
// phone:{
//     type:String
// },
// email:{
//     type:String
// },
// address:{
//     type:String
// },
// message:{
//     type:String
// },
// enquiryNumber:{
//     type:Number
// }