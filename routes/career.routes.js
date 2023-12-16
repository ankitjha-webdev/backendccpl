const career = require("../controllers/career.controllers");
const router = require("express").Router();
const { upload } = require('../middlewares/mediatool.middlewares');

/* 
* Public Routes
*/
router
  .route("/")
  .get((req, res, next) => {
    res.status(200).json({ message: "career API Called!!" });
  })
  .post(upload("resumes", "file"),career.applyJob);

// router.route("/:id").get(career.getById);

/* 
* Private Routes
*/

  
module.exports = router;