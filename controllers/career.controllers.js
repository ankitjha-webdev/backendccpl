const db = require("../config/sequalize.config");
const CustomError = require("../utils/CustomError");
const multer = require('multer');
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const msg = require('../config/responsecatalog.config.json');

exports.isEmailExists = asyncErrorHandler( async (req, res, next) => {
    const email = req.body.email;
    const result = await db.career.findOne({where: {email: email}});
    console.log(result);
    next()
});


exports.create = asyncErrorHandler(async (req, res, next) => {
  const { full_name, email, phone } = req.body;
  const resume = req.file.filename;
  const data = await db.career.create({
    full_name,
    email,
    phone,
    resume
  });

  

  res.status(201).json({
    status: 201,
    success: true,
    message: msg.common_save,
    data: data,
  });
});

// exports.getById = asyncErrorHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const enquiry = await db.businessEnquiry.findByPk(id);
//   if (!enquiry) {
//     const error = new CustomError(
//       `We couldn't find any enquiry with the ID ${req.params.id} you provided. Please double-check the ID and try again.`,
//       404
//     );
//     return next(error);
//   }

//   res.status(200).json({
//     status: 200,
//     success: true,
//     data: enquiry,
//   });
// });
