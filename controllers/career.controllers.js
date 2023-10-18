const db = require("../config/sequalize.config");
const CustomError = require("../utils/CustomError");
const multer = require('multer');
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const msg = require('../config/responsecatalog.config.json');
const sendMail = require("../utils/emailHandler");
const fs = require('fs');

exports.isEmailExists = asyncErrorHandler( async (req, res, next) => {
    const email = req.body.email;
    const result = await db.career.findOne({where: {email: email}});
    console.log(result);
    next()
});


exports.create = asyncErrorHandler(async (req, res, next) => {
  const { full_name, email, phone } = req.body;
  const jobTitle = "Project Manager"
  const resume = req.file.filename;

  const isJobApplied = await db.career.findOne({where:{email}});

  if (isJobApplied) {
    const error = new CustomError("You have already submitted an application for this role. We kindly request your patience as we will be reaching out to you in the near future. Thank you for your understanding.", 401);
    // return next(error);
    return  res.status(200).json({
      status: 200,
      success: true,
      message: "Your application is on file. Please await our contact soon. Thank you for understanding.",
    });
  }
  
  const data = await db.career.create({
    full_name,
    email,
    phone,
    resume
  });

  if (!data) {
    const error = new CustomError("Something went wrong while applying Job", 500);
    return next(error)
  }
  const SENDER_FILE_SERVER_PATH = process.env.FILE_SERVER_PATH + "/applicationsender.html";
  const RECEIVER_FILE_SERVER_PATH = process.env.FILE_SERVER_PATH + "/applicationrecever.html";
const senderEmailTemplate = await fs.promises.readFile(SENDER_FILE_SERVER_PATH, "utf-8");
const receiverEmailTemplate = await fs.promises.readFile(RECEIVER_FILE_SERVER_PATH, "utf-8");
const firstName = data.full_name.split(" ")[0];
const senderEmailBody = senderEmailTemplate
  .replace("[XYZ]", firstName);

  const receiverEmailBody = receiverEmailTemplate
  .replace("[JOBTITLE]", jobTitle)
  .replace("[FULLNAME]", data.full_name)
  .replace("[EMAIL]", data.email)
  .replace("[PHONE]", data.phone)
  .replace("[APPLICATIONDATE]", data.createdAt);
  
  const senderResume = await fs.promises.readFile(`${process.env.RESUME_FILE_SERVER_PATH}${data.resume}`);

  const attachments = {
    filename: data.resume,
    file: senderResume
  };

  const senderEmailOptions = {
    to: data.email,
    subject: `Application for ${jobTitle} Position`,
    text: `
Hello ${data.full_name},

We appreciate your application for the Project Manager position at Cable Care Private Limited. Your qualifications and experience have been duly noted, and we're currently in the process of reviewing all applications. The selection process is ongoing, and if your application advances, we will be in touch with you for the next steps.

Thank you for your interest in joining our team. We value your consideration of a career with Cable Care and your patience as we work through the hiring process. We will keep you informed of any developments.

Thank you,
Team Cable Care
`,
    html: senderEmailBody,
  };

  const receiverEmailOptions = {
    to: "190101120091@cutm.ac.in",
    subject: `Application Received for ${jobTitle} Position`,
    text: `
Hello,

I wanted to inform you that we have received an application for the ${jobTitle} position. The details of the applicant are as follows:

Applicant's Name:${data.full_name}
Email Address: ${data.email}
Phone Number: ${data.phone}
Application Date: ${data.createdAt}

The applicant has expressed a strong interest in joining our team and has submitted their resume and any other required documents. The Resume has attached to this mail.

Thank you for your attention to this matter.

Thank you,
Team Cable Care
`,
    html: receiverEmailBody,
    attachments: attachments
  };

  const senderSent = await sendMail(senderEmailOptions);
  const reciverSnet = await sendMail(receiverEmailOptions);

  res.status(201).json({
    status: 201,
    success: true,
    message: "Thank you for your application. Please be patient, we'll contact you soon.",
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
