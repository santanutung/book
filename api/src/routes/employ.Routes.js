const employController = require('../controller/employController');
const router = require('express').Router();
const upload = require('../utilities/multer');



router.post('/register',upload.single('profile_photo_path'),employController.resgiter);
router.get('/',employController.employeeList);
router.get('/details/:id',employController.employeeDetails);
router.put('/:id',upload.single('profile_photo_path'),employController.employeeUpdate);
router.get('/filter',employController.employeeFilter);
router.delete('/:id',employController.employeeDelete)


module.exports = router;

