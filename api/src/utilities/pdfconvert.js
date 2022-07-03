const multer = require('multer');
const path  = require("path")

// ------------ multer ------------------
const storage = multer.diskStorage({
    destination:'./upload/pdfconvert/',
    filename:(req,file,cd)=>{
        return cd(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage:storage,
    limit:{fileSize:1},
    fileFilter: (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    console.log('---------yes---------------------',req)
    cb(null, true);
  } else {
    cb(null, false);
    console.log('---------no---------------------',req)
    return Promise.reject('Only .png, .jpg and .jpeg format allowed!')
  }
}
   
})
// --------------- End multer ---------------

module.exports = upload

// cb(new Error('Only .png, .jpg and .jpeg format allowed!'));