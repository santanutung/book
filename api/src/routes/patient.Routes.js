
const router = require('express').Router();
const validation = require('../utilities/validation')
const patientsController = require('../controller/patientsController');
const jwtToken = require('../middleware/jwtToken');
const enquiryController = require('../controller/enquiryController')
const partnerController = require('../controller/partnerController');
const patientsReportsController = require('../controller/patientsReportsController');
const ratingController = require('../controller/ratingController');
const testimonialController = require('../controller/testimonialController')
const notificationController = require('../controller/NotificationController');
const BlogController = require('../controller/BlogsController');


const centerEnquiryController = require('../controller/centerEnquiryController');


router.post('/center-enquiry',validation.centerEnquiryValidation,centerEnquiryController.centerEnquiryAdd)

router.get('/notifications',jwtToken,notificationController.getUserNotifications)


router.post('/review',jwtToken,validation.patientsReview, ratingController.addReview)
router.get('/review',jwtToken,ratingController.listReview)
router.delete('/review/:id',jwtToken,ratingController.deleteReview)
router.put('/review/:id',jwtToken,validation.patientsReview, ratingController.updateReview)
router.post('/reports',jwtToken,validation.patientsReports,patientsReportsController.addReports)
router.delete('/reports/:id',jwtToken,patientsReportsController.deleteReport)
router.put('/reports/:id',jwtToken,patientsReportsController.updateReport)
router.get('/reports',jwtToken,patientsReportsController.listReports)
router.post('/reports/:id',jwtToken,patientsReportsController.shareReport)
router.post('/share-reports',jwtToken,patientsReportsController.shareMultipleReport)
router.post('/appointment/upload-documents',jwtToken,patientsReportsController.appoitmentUploadDocument)
router.post('/appointment-attachment/:appointment_id',jwtToken,patientsReportsController.appoitmentAttachments)


router.get('/partner',partnerController.ListPartner)
router.post('/add-family',jwtToken,validation.patientfamilyMamber,patientsController.patientFamilyMamber);
router.put('/edit-family/:id',jwtToken,validation.patientfamilyMamber,patientsController.patientUpdateFamilyMamber);
router.get('/all-center',patientsController.getAllCenterList);
router.get('/center/:id',patientsController.getCenterDetails);
router.get('/center/slots/:id',patientsController.appointmentSlotsDetails);
router.get('/center/slot/dates/:id',patientsController.dateSlotsList);
router.get('/center/slot/:id',patientsController.slot);
router.post('/register-otp',validation.RegisterPatients,patientsController.SendRegisterOTP);
router.post('/register',validation.RegisterPatients,patientsController.newPatients);
router.get('/family-member-list',jwtToken,patientsController.patientFamilyMamberList)
router.post('/book-appointment',jwtToken,patientsController.bookAppointment)
router.get('/list-appointment',jwtToken,patientsController.bookAppointmentList)
router.get('/appointment/:appointmentId',jwtToken,patientsController.getAppointment)
router.post('/enquiry', validation.enquireForm,enquiryController.enquiry)
router.get('/enquiry', jwtToken,enquiryController.enquiryList)
router.get('/enquiry/:id', jwtToken,enquiryController.getEnquiry)
router.put('/enquiry/:id', jwtToken,enquiryController.updateEnquiry)


router.get('/profile',jwtToken,patientsController.userProfile)
router.put('/update/profile',jwtToken,validation.updateUserProfile,patientsController.updateProfile);
router.get('/center/:id/reviews',ratingController.centerReviews)
// router.get('razorpay', RazorpayController.createOrder)



// payment 
const paymentController = require('../controller/paymentController');
const webViewToken = require('../middleware/webViewToken')

router.get("/payment/:id",webViewToken,paymentController.createOrder)

router.post("/create-transaction",jwtToken,paymentController.createTransaction)

router.get("/transactions",jwtToken,paymentController.allTransactions)



// testimonialController routes
router.post('/testimonial',jwtToken,validation.testiMonial,testimonialController.addTestiMonial)
router.get('/testimonials',testimonialController.approvedTesimonialList)
router.get('/check-center-feedback',jwtToken, ratingController.checkCenterFeedback)
router.get('/check-testimonial',jwtToken, testimonialController.checkTestimonial)



router.post('/cancel-appointment/:id',jwtToken,patientsController.cancelAppointment)



router.post('/reschedule-appointment/:id',jwtToken,patientsController.rescheduleAppointment)


// router.get('/check-testimonial',jwtToken, testimonialController.checkTestimonial)


router.get('/appointment-centers',jwtToken,patientsController.patientCenters)


router.get('/blogs',BlogController.activeBlogs) 
router.get('/blog/:id',BlogController.getActiveBlog) 

router.get('/check-notification',patientsController.checkNotification)


router.get('/createUserToFamily',patientsController.createUserToFamily)

module.exports = router;
