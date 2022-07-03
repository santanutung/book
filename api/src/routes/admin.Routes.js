const centersController = require('../controller/centersController');
const upload = require('../utilities/multer');
const patientsController = require('../controller/patientsController');
const userPermissionsController = require('../controller/userPermissionsController');
const userController = require('../controller/userController');
const router = require('express').Router();
const morbiditiesModel = require('../model/morbiditiesModel');
const validation = require('../utilities/validation')
const { validationResult } = require('express-validator')
const book_appointmentController = require('../controller/bookAppointmentController')
const dashboardController = require('../controller/dashboardController')
const enquiryController = require('../controller/enquiryController')
const partnerController = require('../controller/partnerController')
const SettingController = require('../controller/settingContontroller');
const appointmentSlotController = require('../controller/appointmentSlotController');
const testimonialController = require('../controller/testimonialController')
// router.post('/center',centersController.registerCenter);
const notificationController = require('../controller/NotificationController');
const GalleryController = require('../controller/galleryController');
const BlogController = require('../controller/BlogsController');
const chatController = require('../controller/ChatController')

const centerEnquiryController = require('../controller/centerEnquiryController');

//partnerCOntroller list
// router.get('/gallery/:id',GalleryController.centerGallery)
// router.post('/upload-gallery/:id',validation.uploadGallery,GalleryController.updateImages) //imageId
// router.delete('/upload-gallery/:id/:imageId',GalleryController.deleteImage) 
// router.put('/upload-gallery/:id/:imageId',validation.updateGallery,GalleryController.updateImage) 
router.get('/partner', partnerController.AdminListPartner)
router.post('/partner', validation.patnerForm, partnerController.AdminaddPartner)
router.put('/partner/:id', partnerController.AdminupdatePartner)
router.delete('/partner/:id', partnerController.AdmindeletePartner)
router.get('/setting/:type', SettingController.settingTypes)
router.post('/setting', SettingController.addSetting)
// end partnerCOntroller

router.get('/center/stats/:id', dashboardController.dashboardApi)
router.get('/stats', dashboardController.adminDashboardApi)
// router.post('center',(req,res)=>{
//     req.send('kjhgfd')
// })


router.post('/morbiditie', validation.morbiditie, async (req, res) => {
    try {
        // console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            await morbiditiesModel.create(req.body).catch(err => {
                return res.status(500).json({ error: err })
            });
            return res.status(200).json({ message: "create morbiditie" })
        }
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
})
router.get('/morbiditie', async (req, res) => {
    try {

        const data = await morbiditiesModel.find()
        return res.status(200).json({ data: data })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
});

router.delete('/morbiditie/:id', async (req, res) => {
    try {
        var id = req.params.id;
        await morbiditiesModel.deleteOne({ _id: id });
        return res.status(200).json({ message: "delete morbiditie !" })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
});
router.put('/morbiditie/:id', validation.morbiditie, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.msg,
                errors: errors.errors
            });
        }
        else {
            var id = req.params.id || [];
            await morbiditiesModel.updateOne({ _id: id }, req.body, { upsert: true })
            return res.status(200).json({ message: "update morbiditie !" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
});



router.put('/coordinatesupdate/:id',centersController.coordinatesUpdate)
//
router.get('/center', centersController.centerList);
router.post('/center-image', upload.single('image'), centersController.centerImageUpload);
router.post('/patients', upload.single('profile_photo_path'), patientsController.registerPatients);
router.get('/user-permission', userPermissionsController.createPermission);
router.post('/patients', upload.single('profile_photo_path'), patientsController.registerPatients);
router.get('/patient-list', patientsController.patientsList);
// router.get('/patient-profile/:id',patientsController.patientsDetails);
router.get('/patient-profile/:id', patientsController.patientProfile);
router.get('/patient-appointments/:id', patientsController.patientAppointment);



router.get('/center/appointment/:id', book_appointmentController.bookAppointmentList)

// 
router.post('/center-document-category', validation.centerDocumentCategory, centersController.centerDocumentCategory);
router.get('/center-document-category', centersController.centerDocumentCategoryList);
router.get('/center-document-category-details/:id', centersController.centerDocumentCategoryDetails);
router.delete('/center-document-category/:id', centersController.centerDocumentCategoryDelete);
router.put('/center-document-category/:id', validation.centerDocumentCategory, centersController.centerDocumentCategoryupdate);
router.get('/center/appointments', book_appointmentController.adminBookAppointmentList)


//center slots routes
router.get('/appointment/slot-details/:center_id/:day',
    appointmentSlotController.adminAppointmentSlotsDetails   //list 
);

// router.get('/appointment/slot-detail/:id',
//     appointmentSlotController.appointmentSlotsDetailsById   //list 
// );
router.post('/appointment/slot-create/:center_id',
    validation.adminAppointmentSlot, // create
    appointmentSlotController.adminCreateAppointmentSlots
);
router.delete('/appointment/slot/delete/:center_id/:delete', // delete
    appointmentSlotController.adminAppointmentSlotsDelete
);
router.put('/appointment/slot/update/:center_id/:update',
    validation.appointmentSlotUpdate, // create// update
    appointmentSlotController.adminAppointmentSlotsUpdate
);

//end center slots routes


router.get('/slots/:center_id' , appointmentSlotController.adminCreateDateSlots)

//-----------------------------------------------------------testimonial-----------------------------------------------------------
router.get('/testimonials', testimonialController.adminTestimonialList)
router.post('/testimonials/update-status/:id', testimonialController.adminUpdateTestimonial)

router.delete('/testimonials/:id', testimonialController.adminDeleteTestimonial)


//-----------------------------------------------------------end testimonial-------------------------------------------------------



//-----------------------------------------------------------enquiry-----------------------------------------------------------

router.get('/enquiry-list', enquiryController.AdminEnquiryList)
router.post('/enquiry/:id', enquiryController.adminUpdateEnquiry)
router.get('/enquiry/:id', enquiryController.adminGetEnquiry)
router.put('/enquiry/:id', enquiryController.adminUpdateStatusEnquiry)


router.get('/notifications' , notificationController.getAdminNotifications)


router.put('/notification-read' , notificationController.getAdminNotificationsRead)


//-----------------------------------------------------------end enquiry-------------------------------------------------------

router.get('/appointment/date-slots/:centerId',
        appointmentSlotController.adminDateSlotsList   //list 
);

router.post('/appointment/date-slot' , 
validation.appointmentDateSlotUpdate, // create// update
appointmentSlotController.addDateSlots)
module.exports = router


router.delete('/appointment/date-slot/delete/:delete', // delete
        appointmentSlotController.appointmentDateSlotsDelete
);


router.put('/appointment/date-slot/update/:update', 
// validation.appointmentDateSlotUpdate, // create// update
        appointmentSlotController.appointmentDateSlotsUpdate
);



// ---------------------------------blogs------------------------------
router.get('/blogs',BlogController.index) 
router.get('/blog/:id',BlogController.get) 
router.post('/add-blog',validation.addBlog,BlogController.add) 

router.put('/edit-blog/:id',validation.editBlog,BlogController.update) 


router.delete('/blog/:id',validation.editBlog,BlogController.delete) 
//----------------------------------end blogs---------------------------

//-----------------------------------chat---------------------------------

router.get('/center-chat/:centerId', chatController.adminChat)
router.post('/center-chat/:centerId', chatController.adminMessage)
router.get('/chat-unread-message', chatController.getUnreadMessage)


router.put('/chat-read/:centerId', chatController.markReadMessage)



//-------------------------------------end chat-------------------------


//----------------------------------center gallery------------------------------
router.get('/gallery/:centerId',GalleryController.centerGallery)
router.post('/upload-gallery/:centerId',validation.uploadGallery,GalleryController.updateImages) //imageId
router.delete('/upload-gallery/:centerId/:imageId',GalleryController.deleteImage) 
router.post('/make-primary-gallery/:centerId',GalleryController.updatePrimaryImages) //imageId

//---------------------------------end center gallery-------------------------


//----------------------------------center enquiry----------------------------

// router.get('/center-enquiry-list', centerEnquiryController.centerEnquiryGet)
// router.post('/center-enquiry/:id', centerEnquiryController.adminUpdateEnquiry)
// router.get('/center-enquiry/:id', centerEnquiryController.adminGetEnquiry)
// router.put('/center-enquiry/:id', centerEnquiryController.adminUpdateStatusEnquiry)

router.get('/center-enquiry',centerEnquiryController.centerEnquiryGet)
router.get('/center-enquiry/:id',centerEnquiryController.centerEnquiryDetails)
router.post('/center-enquiry/:id',centerEnquiryController.adminUpdateEnquiry)
router.put('/center-enquiry/:id', centerEnquiryController.adminUpdateStatusEnquiry)
//-----------------------------------end center enquiry------------------------
// 1263