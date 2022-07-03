const multer = require('multer')


const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/image/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
    
})

const fileUpload = multer({ storage: diskStorage, limits: 1000000 ,
    
})

module.exports = { fileUpload }