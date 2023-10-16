const business = require("../controllers/businessenquiry.controllers");
const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.status(200).json({ message: "Business API Called!!" });
  })
  .post(business.create);

router.route("/:id").get(business.getById);

module.exports = router;