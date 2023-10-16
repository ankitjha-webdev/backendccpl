const service = require("../controllers/servicerequest.controllers");
const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.status(200).json({ message: "Service API Called!!" });
  })
  .post(service.create);

module.exports = router;
