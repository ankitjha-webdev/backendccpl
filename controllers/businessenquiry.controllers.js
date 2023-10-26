const db = require("../config/sequalize.config");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const msg = require("../config/responsecatalog.config.json");
const fs = require("fs");
const sendMail = require("../utils/emailHandler");

const checkRequestTime = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const checkExistingRequest = await db.businessEnquiry.findOne({
    where: { email },
  });
  if (checkExistingRequest) {
    const timeSinceFirstRequest =
      Date.now() - checkExistingRequest.createdAt.getTime();
    const hoursSinceFirstRequest = timeSinceFirstRequest / (60 * 60 * 1000);
    if (hoursSinceFirstRequest < 24) {
      const error = new CustomError(
        "Your request has been received, and one of our team members will promptly reach out to you. Should you not receive a response within 24 hours, please feel free to submit another request at your convenience.",
        403
      );
      return next(error);
    }
  }
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() * 10);
  console.log(currentTime, "currentTime");
  const checkTime = new Date(result.createdAt);
  console.log(checkTime.getTime(), "Check Time");
  if (checkTime.getTime() <= currentTime.getTime()) {
    console.log("Here we're!!");
    next(
      new CustomError(
        "Thank you for your request! We have received it and our team will reach out to you shortly.",
        400
      )
    );
    return false;
  }
  return true;

  //   next();
});

exports.create = asyncErrorHandler(async (req, res, next) => {
  const { full_name, email, phone, company, subject, message } = req.body;
  const checkExistingRequest = await db.businessEnquiry.findOne({
    where: { email },
  });
  if (checkExistingRequest) {
    const timeSinceFirstRequest =
      Date.now() - checkExistingRequest.createdAt.getTime();
    const hoursSinceFirstRequest = timeSinceFirstRequest / (60 * 60 * 1000);
    if (hoursSinceFirstRequest < 24) {
      const error = new CustomError(
        "Your request has been received, and one of our team members will promptly reach out to you. Should you not receive a response within 24 hours, please feel free to submit another request at your convenience.",
        200
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message:
          "Request received. We'll contact you shortly. Resubmit after 24 hours if no response."
      });
    }
  }

  let data;
  if (!checkExistingRequest) {
    data = await db.businessEnquiry.create({
      full_name,
      email,
      phone,
      company,
      subject,
      message,
    });

    if (data) {
      const FILE_SERVER_PATH =
        process.env.FILE_SERVER_PATH + "/contactenquery.html";
      const emailTemplate = await fs.promises.readFile(
        FILE_SERVER_PATH,
        "utf-8"
      );
      const firstName = data.full_name.split(" ")[0];
      const emailBody = emailTemplate.replace("[XYZ]", firstName);

      const emailOptions = {
        to: data.email,
        subject: `Business Inquiry`,
        text: `
Hello ${data.full_name},

Thank you for your business inquiry. We appreciate your interest in our products/services. Rest assured, your message has been received and our team is currently reviewing it. We will respond promptly with the information and assistance you need to make an informed decision.

If you have any immediate questions or specific requirements, please feel free to share them with us at support@cablecare.co. We value your interest and look forward to the possibility of collaborating with you. Expect to hear from us soon.

Thank you,
Team Cable Care
`,
        html: emailBody,
      };

      const isEmailSent = await sendMail(emailOptions);
      if (!isEmailSent) {
        const err = new CustomError(msg.common_failed, 500);
        return next(err);
      }

      if (isEmailSent) {
        const FILE_SERVER_PATH =
          process.env.FILE_SERVER_PATH + "/contactenqueryprovider.html";
        const emailTemplate = await fs.promises.readFile(
          FILE_SERVER_PATH,
          "utf-8"
        );

      const firstName = data.full_name.split(" ")[0];
        const emailBody = emailTemplate
          .replace("[PFULLNAME1]", firstName)
          .replace("[PFULLNAME2]", firstName)
          .replace("[PFULLNAME3]", firstName)
          .replace("[PSERVICE]", data.subject)
          .replace("[PEMAIL]", data.email)
          .replace("[PPHONE]", data.phone)
          .replace("[PCOMPANY]", data.company)
          .replace("[PMESSAGE]", data.message);
        const emailOptions = {
          to: "190101120091@cutm.ac.in",
          subject: `${data.subject} Inquiry`,
          text: `
Hey,

I hope this message finds you well. I wanted to inform you about an inquiry we received from ${firstName}. Here are the details:

Subject: ${data.subject}

Full Name: ${firstName}

Email: ${data.email}

Phone: ${data.phone}

Company: ${data.company}


${firstName} has reached out to us with the following message:

${data.message}


Thank you for your attention to this matter.
Best Regards,
Team Cable Care
`,
          html: emailBody,
        };

        const isEmailSent = await sendMail(emailOptions);
        if (!isEmailSent) {
          const err = new CustomError(msg.common_failed, 500);
          return next(err);
        }
      }
    }
  }

  res.status(201).json({
    status: 201,
    success: true,
    message:
      "Thank you for your request! We have received it and our team will reach out to you shortly."
  });
});

exports.getById = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const enquiry = await db.businessEnquiry.findByPk(id);
  if (!enquiry) {
    const error = new CustomError(
      `We couldn't find any enquiry with the ID ${req.params.id} you provided. Please double-check the ID and try again.`,
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: 200,
    success: true,
    data: enquiry,
  });
});
