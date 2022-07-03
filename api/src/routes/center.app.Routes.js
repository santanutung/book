const router = require('express').Router();
const appointmentSlotController = require('../controller/appointmentSlotController');
const validation = require('../utilities/validation');
const centerController = require('../controller/centersController');
const upload = require('../utilities/pdfconvert');
const pdfupload = require('../utilities/fileupload');
const { ImageValidate } = require('../service/helper');
const bookAppointmentController = require('../controller/bookAppointmentController');

const dashboardController = require('../controller/dashboardController');
// const  
const morbiditiesModel= require('../model/morbiditiesModel');
const patientsController = require('../controller/patientsController');

const SettingController = require('../controller/settingContontroller');

const RatingController = require('../controller/ratingController');
const appointmentController = require('../controller/appointmentSlotController');
const notificationController = require('../controller/NotificationController');
const GalleryController = require('../controller/galleryController');
const enquiryController = require('../controller/enquiryController')
const chatController = require('../controller/ChatController')


router.post('/setting',SettingController.addSetting)
router.get('/setting/:type',SettingController.settingTypes)
router.get('/gallery',GalleryController.centerGallery)
router.post('/upload-gallery',validation.uploadGallery,GalleryController.updateImages) //imageId
router.delete('/upload-gallery/:imageId',GalleryController.deleteImage) 
router.post('/make-primary-gallery',GalleryController.updatePrimaryImages) //imageId



router.get('/center/patient/:id',patientsController.patientsDetails)


router.get('/morbiditie',async(req,res)=>{
        try {
            
            const data = await morbiditiesModel.find()
            return res.status(200).json({data:data})
        }
         catch (error) {
            return res.status(500).json({error:error})
        }
    });




router.get('/center/dashboard',dashboardController.dashboardApi)
// router.get('/center/dashboard-appointment-status',dashboardController.dashboardAppointmentStatus)

/*
:::::::::::::::::::::::: Appointment Slots :::::::::::::::::::::::::::::::::::
*/
router.get('/appointment/slot-details/:day',
        appointmentSlotController.appointmentSlotsDetails   //list 
);
router.get('/appointment/slot-detail/:id',
        appointmentSlotController.appointmentSlotsDetailsById   //list 
);
router.post('/appointment/slot-create',
        validation.appointmentSlot, // create
        appointmentSlotController.create_appointment_slots
);
router.delete('/appointment/slot/delete/:delete', // delete
        appointmentSlotController.appointmentSlotsDelete
);
router.put('/appointment/slot/update/:update', 
validation.appointmentSlotUpdate, // create// update
        appointmentSlotController.appointmentSlotsUpdate
);

router.post('/appointment-book',bookAppointmentController.bookAppointment);
/*
:::::::::::::::::::::::: End Appointment Slots :::::::::::::::::::::::::::::::::::
*/





/*
:::::::::::::::::::::::: Center Time :::::::::::::::::::::::::::::::::::
*/
router.post('/center/center-time-add',
        validation.centerTime,
        centerController.centerTimeCreate // center time update
);
router.get('/center/center-time',
        
        centerController.centerTimedDetails // list center time
);
router.put('/center/center-time-update/:id',
                validation.centerTimeUpdate,
        centerController.centerTimeUpdate // list center time
);

router.delete('/center/center-time-delete/:slot',

        centerController.centerTimeDelete  // delete center time 
);
/*
:::::::::::::::::::::::: End Center Time :::::::::::::::::::::::::::::::::::
*/


/*
:::::::::::::::::::::::: Start Center Document :::::::::::::::::::::::::::::::::::
*/
router.post('/center/document', 

// pdfupload.single('document'), // upload image to pdf 
   
        centerController.CenterDocumentsUpload,
);
router.post('/center/document-pdf', 

pdfupload.single('document'), // upload image to pdf 
   
        centerController.CenterPdfDocumentsUpload,
);

router.get('/center/documents',

    centerController.centerDocumentList
);
router.get('/center/documents-check/:id',

    centerController.centerDocumentCheck1
);
router.delete('/center/document/:id',
    centerController.centerDocumentDelete
);

/*
:::::::::::::::::::::::: End Center Document :::::::::::::::::::::::::::::::::::
*/



router.post('/center/profile-update' , validation.centerProfileUpdate, centerController.centerProfileEdit)

router.get('/center-document-category',centerController.centerDocumentCategoryList);
router.get('/center-document-category-details/:id',centerController.centerDocumentCategoryDetails);



router.get('/dates',appointmentSlotController.dateSlotsList);

router.get('/appointments',bookAppointmentController.bookAppointmentList);
router.put('/appointment-cancel/:id',bookAppointmentController.bookAppointmentCancelled);
router.put('/center/appointment/:id',bookAppointmentController.bookAppointmentdemo);


router.get('/center/patients',
      centerController.patientsList
)

router.get('/center/reviews',
RatingController.centerReviewList
)

//router.get('/center-document-category',centersController.centerDocumentCategoryList);


// router.post('/center/enquiry' , notificationController.centerEnquiry)




router.get('/center/notifications' , notificationController.getNotifications)



/*--------------------------------------date slot--------------------------------------*/

router.delete('/appointment/date-slot/delete/:delete', // delete
        appointmentSlotController.appointmentDateSlotsDelete
);


router.put('/appointment/date-slot/update/:update', 
// validation.appointmentDateSlotUpdate, // create// update
        appointmentSlotController.appointmentDateSlotsUpdate
);
router.post('/appointment/date-slot' , 
validation.appointmentDateSlotUpdate, // create// update
appointmentSlotController.addDateSlots)
router.get('/slots' , appointmentController.createDateSlots)

/*--------------------------------------end date slot-----------------------------------*/


//-------------------------------------enquiry-------------------------------------------
router.post('/enquiry', validation.enquireForm,enquiryController.centerEnquiry)
router.get('/enquiry',enquiryController.centerEnquiryList)
// router.get('/enquiry/:id', jwtToken,enquiryController.getEnquiry)
// router.put('/enquiry/:id', jwtToken,enquiryController.updateEnquiry)
router.post('/send-message', chatController.centerMessage)
router.get('/chats', chatController.centerChat)

//-------------------------------------end enquiry----------------------------------------
module.exports = router;