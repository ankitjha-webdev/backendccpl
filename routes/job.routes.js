const router = require("express").Router();
const job = require("../controllers/job.controllers");
const passport = require("passport");
require("../config/passport.config")(passport);

/* 
* Private Routes
*/

router
  .route('/')
  .get(job.listJobs)
  .post(passport.authenticate('jwt', {session:false}), job.createJob);

router
  .route('/:id')
  .put(passport.authenticate('jwt', {session:false}), job.updateJob)
  .delete(passport.authenticate('jwt', {session:false}), job.deleteJob);
  
module.exports = router;