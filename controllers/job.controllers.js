const db = require('../config/sequalize.config');
const { jobSchema } = require('../helpers/validationschems.helpers');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

// Create Job
exports.createJob = asyncErrorHandler(async (req, res, next) => {
  const { error, value } = jobSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  
  const {
    title,
    description,
    requirements,
    experience,
    location,
    desiredSkillsAndExperience,
    highlyDesiredSkills,
    preferredEducationalBackground,
    keyBenefits
  } = value;

  const job = await db.jobs.create({
    title,
    description,
    requirements,
    experience,
    location,
    desiredSkillsAndExperience,
    highlyDesiredSkills,
    preferredEducationalBackground,
    keyBenefits
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: "Job created successfully",
    data: job
  });
});

// Update Job
exports.updateJob = asyncErrorHandler(async (req, res, next) => {
  const { error, value } = jobSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  
  const job = await db.jobs.update(value, {
    where: {
      id: Number(req.params.id)
    }
  });

  if (!job || job[0] === 0) {
    return next(new CustomError('The job you are attempting to update cannot be found.', 404));
  }

  res.status(200).json({
    status: 204,
    success: true,
    message: "Job updated successfully"
  });
});

// Delete Job
exports.deleteJob = asyncErrorHandler(async (req, res, next) => {
  const job = await db.jobs.destroy({
    where: {
      id: Number(req.params.id)
    }
  });

  if (!job) {
    return next(new CustomError('No job found with this ID', 404));
  }

  res.status(200).json({
    status: 200,
    success: true,
    message: "Job deleted successfully"
  });
});

// List Jobs
exports.listJobs = asyncErrorHandler(async (req, res, next) => {
  const jobs = await db.jobs.findAll({ order: [['createdAt', 'DESC']] });

  if (!jobs || jobs.length === 0) {
    return next(new CustomError('No jobs found', 404));
  }

  res.status(200).json({
    status: 200,
    success: true,
    data: jobs
  });
});

// Total Job Posted
exports.totalJobs = asyncErrorHandler(async (req, res, next) => {
  const totalJob = await db.jobs.count();
  res.status(200).json({
    status: 1,
    success: true,
    message: "Total job fetched successfully",
    data: totalJob,
  });
});
