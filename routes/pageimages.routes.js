const router = require("express").Router();
const pageImages = require("../controllers/pageimages.controllers");
const { upload } = require("../middlewares/mediatool.middlewares");
const passport = require("passport");
require("../config/passport.config")(passport);

router
  .route("/")
  .get(pageImages.listAllImages)
  .post(passport.authenticate('jwt', { session: false }), upload("images", "image"), pageImages.uploadImage);
router.get("/listimages", pageImages.listImages);
router.get('/totalimages', passport.authenticate('jwt', { session: false }), pageImages.totalImages);
router.route("/:id")
  .delete(passport.authenticate('jwt', { session: false }), pageImages.deleteImage);

module.exports = router;