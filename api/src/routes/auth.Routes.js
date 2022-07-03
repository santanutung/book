const userController = require('../controller/userController');
const router = require('express').Router();
const validation = require('../utilities/validation');
const petientsRoutes = require('../controller/patientsController');
const upload = require('../utilities/multer');
const centerController  = require('../controller/centersController');

// const patientsController = require('../controller/patientsController');


router.post('/center/login',
validation.centerAppLogin,
centerController.centerLogin
);

// router.post('/patient/register',
// validation.registerPatients,
// patientsController.registerPatients
// );

router.post('/register',
      userController.register
);

router.post('/login',
      validation.login,
      userController.login
);
router.post('/refresh-token',
      userController.userRefreshToken
);

router.post('/petients-register',
      upload.single('profile_photo_path'),
      petientsRoutes.registerPatients
)
router.get('/user',
      userController.userList,
    
);
router.post('/user-login',validation.Userlogin, userController.UserLogin)

router.post('/petient/register',
upload.single('profile_photo_path'),
validation.patientsRegister,
petientsRoutes.patientsRegister)

//forgot password
router.post('/forgot-password/send-otp',userController.forgotPasswordSendOTP);

router.post('/forgot-password/verify-otp',validation.patientsForgotPassword,userController.forgotPasswordVerifyOTP);

router.post('/center/forgot-password/send-otp',userController.centerForgotPasswordSendOTP);

router.post('/center/forgot-password/verify-otp',validation.patientsForgotPassword,userController.centerForgotPasswordVerifyOTP);


//end forgot password



module.exports = router

