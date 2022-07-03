const multer = require('multer');
const path  = require("path")

// ------------ multer ------------------
const storage = multer.diskStorage({
    destination:'./upload/pdf/',
   
    filename:(req,file,cd)=>{
        return cd(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage:storage,
    limit:{fileSize:1}
})
// --------------- End multer ---------------

module.exports = upload