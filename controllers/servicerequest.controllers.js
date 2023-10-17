const db = require("../config/sequalize.config");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const msg = require("../config/responsecatalog.config.json");
const sendMail = require("../utils/emailHandler");
const fs = require("fs");

exports.isEmailExists = asyncErrorHandler(async (req, res, next) => {
    const email = req.body.email;
    const result = await db.serviceRequest.findOne({ where: { email: email } });
    console.log(result);
    next();
});

exports.create = asyncErrorHandler(async (req, res, next) => {
    const { full_name, email, phone, company, subject, message } = req.body;
    const uniqueTicketNumber = generateRandomTicketNumber();
    // check if request time exceed
    const existingTicket = await db.serviceRequest.findOne({ where: { email } });
    if (existingTicket) {
        const timeSinceFirstRequest =
            Date.now() - existingTicket.createdAt.getTime();
        const hoursSinceFirstRequest = timeSinceFirstRequest / (60 * 60 * 1000);
        if (hoursSinceFirstRequest < 24) {
            const error = new CustomError(
                "Your request has been received, and one of our team members will promptly reach out to you. Should you not receive a response within 24 hours, please feel free to submit another request at your convenience.",
                403
            );
            // return next(error);
           return res.status(200).json({
                status: 200,
                success: true,
                message: "Request received. We'll contact you shortly. Resubmit after 24 hours if no response."
            });
        }
    }
    let data;
    if (!existingTicket) {
        data = await db.serviceRequest.create({
            full_name,
            email,
            phone,
            company,
            subject,
            message,
            ticket_number: uniqueTicketNumber,
        });
        const FILE_SERVER_PATH =
            process.env.FILE_SERVER_PATH + "/servicerequest.html";
        const emailTemplate = await fs.promises.readFile(FILE_SERVER_PATH, "utf-8");
        const firstName = data.full_name.split(" ")[0];
        const emailBody = emailTemplate
            .replace("[XYZ]", firstName)
            .replace("[TICKETNUMBER]", data.ticket_number);

        const emailOptions = {
            to: data.email,
            subject: `Service Request - Ticket #${data.ticket_number}`,
            text: `
Hello ${data.full_name},

Thank you for your service request with Ticket #${data.ticket_number}. We're on it and will keep you updated on its status. If you have any urgent questions or additional information to provide, please feel free to reach out to us.

Thank you,
Team Cable Care
    `,
            html: emailBody,
        };
        const PROVICER_FILE_SERVER_PATH =
            process.env.FILE_SERVER_PATH + "/serviceproviderrequest.html";
        const provicerEmailTemplate = await fs.promises.readFile(
            PROVICER_FILE_SERVER_PATH,
            "utf-8"
        );
        const providerEmailBody = provicerEmailTemplate
            .replace("[TICKETNUMBER]", data.ticket_number)
            .replace("[PSERVICE]", data.subject)
            .replace("[PFULLNAME1]", data.full_name)
            .replace("[PFULLNAME2]", data.full_name)
            .replace("[PFULLNAME3]", data.full_name)
            .replace("[PEMAIL]", data.email)
            .replace("[PCOMPANY]", data.company)
            .replace("[PTICKETNUMBER]", data.ticket_number)
            .replace("[PMESSAGE]", data.message)
            .replace("[PPHONE]", data.phone);

        const providerEmailOptions = {
            to: "190101120091@cutm.ac.in",
            subject: `Service Request Notification - Ticket #${data.ticket_number}`,
            text: `
Hey,

You have received a service request with the ticket number #${data.ticket_number}. Kindly reach out to the requestor as soon as possible to assist with the following details:

Subject: ${data.subject}

Full Name: ${data.full_name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Ticket Number: ${data.ticket_number}

Message: ${data.message}

Thank you,
Team Cable Care
    `,
            html: providerEmailBody,
        };
        if (data) {
            sendMail(emailOptions);
            sendMail(providerEmailOptions);
        }
    }

    res.status(201).json({
        status: 201,
        success: true,
        message: "Request received. We'll contact you shortly. Resubmit after 24 hours if no response.",
    });
});

exports.getById = asyncErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    const enquiry = await db.serviceRequest.findByPk(id);
    if (!enquiry) {
        const error = new CustomError(
            `We couldn't find any service request with the ID ${req.params.id} you provided. Please double-check the ID and try again.`,
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

function generateRandomTicketNumber() {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

