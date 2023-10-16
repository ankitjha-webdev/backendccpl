const career = require("../controllers/career.controllers");
const router = require("express").Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/resumes')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage })

router
  .route("/")
  .get((req, res, next) => {
    res.status(200).json({ message: "career API Called!!" });
  })
  .post(upload.single("file"),career.create);

// router.route("/:id").get(career.getById);

module.exports = router;