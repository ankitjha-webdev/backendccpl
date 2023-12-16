const nodemailer = require('nodemailer');
const msg = require("../config/responsecatalog.config.json");
const CustomError = require('./CustomError');

let mailConfig;
if(process.env.NODE_ENV === 'production'){
        mailConfig = {
        host: 'smtp.cablecare.co',
        port: 587,
        secure: false,
        auth: {
            user: "sudhir@cablecare.co", // generated ethereal user
            pass: "1WQwNx3yyVdBuzWCte"  // generated ethereal password
        }
    }
} else {
    mailConfig = {
        service: 'gmail',
        auth: {
            user: "190101120091@cutm.ac.in", // generated google user
            pass: "kocyflkscjmrctur"  // generated google password
        }

    }
}

let transporter = nodemailer.createTransport(mailConfig);

module.exports =  async (options) =>{
    try {
        let emailOptions = {}
        if(process.env.NODE_ENV === 'production') {
            emailOptions = {
                from: '"Cable Care" <190101120091@cutm.ac.in>', // sender address
                to: options.to, // list of receivers
                subject: options.subject, // Subject line
                text: options.text, // plain text body
                html: options.html, // html body,
            }
            if (options.attachments) {
                emailOptions.attachments = [{'filename': options.attachments.filename, 'content': options.attachments.file}]
            }
        } else {
            emailOptions = {
                from: '"Fred Foo 👻" <eldora.stokes19@ethereal.email>', // sender address
                to: "ankitkumarcse91@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            }
        }
       return await transporter.sendMail(emailOptions)
    } catch (error) {
       throw new CustomError(msg.common_failed, 500);
    }
};