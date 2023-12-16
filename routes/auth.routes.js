const router = require('express').Router();
const passport = require('passport');
require('../config/passport.config')(passport);
const { login, signup, forgotPassword, resetPassword } = require("../controllers/auth.controllers");

/* 
* Private Routes
*/

router.route('/register')
    .get((req, res, next) => {
        res.status(200).json({ message: "Auth Register API Called!!" });
    })
    .post(passport.authenticate('jwt', {session:false}),signup);

/* 
* Public Routes
*/
router
    .route("/login")
    .get((req, res, next) => {
        res.status(200).json({ message: "Auth Login API Called!!" });
    })
    .post(login);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword').post(resetPassword);


module.exports = router;