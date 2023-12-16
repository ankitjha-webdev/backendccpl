const CustomError = require("../utils/CustomError")
const multer = require('multer');

exports.upload = (folderName, fieldName) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, `./public/uploads/${folderName}`)
            },
            filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
              cb(null, uniqueSuffix + '-' + file.originalname)
            }
          });
        return multer({ storage: storage }).single(fieldName);
    } catch (error) {
       next(new CustomError(error.message, 500)) 
    }
}
