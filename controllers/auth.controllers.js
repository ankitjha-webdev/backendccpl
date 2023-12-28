const asyncErrorHandler = require("../utils/asyncErrorHandler");
const db = require('../config/sequalize.config');
const CustomError = require("../utils/CustomError");
const sendMail = require("../utils/emailHandler");
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwtToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
};

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await db.users.findOne({ where: { email } });
    
    if (!user) {
        return next(new CustomError('Incorrect Email or Password', 400));
    }
    
    const isMatch = await user.validPassword(password);
    
    if (!isMatch) {
        return next(new CustomError('Incorrect Email or Password', 401));
    }
    
    // Send a jwt token
    const token = generateJwtToken(user.id);
    
    res.status(200).json({
        status: 200,
        success: true,
        message:"Login Success",
        token
    });
});

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const { email, password, full_name, phone, profile } = req.body;
    const existingUser = await db.users.findOne({ where: { email } });

    if (existingUser) {
        return next(new CustomError('User already exists', 400));
    }

    const newUser = await db.users.create({
        email,
        password,
        full_name,
        phone,
        profile
    });
    
    res.status(201).json({
        status: 201,
        success: true,
        message: "User created successfully",
        data: newUser
    });
});

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await db.users.findOne({ where: { email } });

    if (!user) {
        return next(new CustomError('User with this email does not exist', 400));
    }

    // Generate and set password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    // const RESETURL = req.protocol + '://' + req.get('host') + '/resetpassword?token=' + resetToken;
    const RESETURL = `${process.env.BASE_URL}/resetpassword?token=${resetToken}`;
    // Send email
    const RESET_FILE_SERVER_PATH = process.env.FILE_SERVER_PATH + "/resetpassword.html";
    const resetPasswordEmailTemplate = await fs.promises.readFile(RESET_FILE_SERVER_PATH, "utf-8");
    const firstName = user.full_name.split(" ")[0];
    const resetPasswordEmailBody = resetPasswordEmailTemplate
        .replace("[XYZ]", firstName)
        .replace("[RESETURL]",RESETURL );

    const resetPasswordEmailOptions = {
        to: user.email,
        subject: `Reset Password`,
        text: `
            Hello ${firstName},
            
            We received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link: ${RESETURL}
            If you have any questions, please don't hesitate to reach out.
            
            Thank you,
            Team Cable Care
            `,
        html: resetPasswordEmailBody,
    };

    const resetPasswordSent = await sendMail(resetPasswordEmailOptions);
    // Note: In a real application, you would send an email here
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Password reset token sent to email',
        // resetToken
    });
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    const { token, newPassword } = req.body;
    const user = await db.users.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
        return next(new CustomError('Invalid or expired password reset token', 400));
    }

    // Verify the reset token
    const isValidToken = user.verifyPasswordResetToken(token);

    if (!isValidToken) {
        return next(new CustomError('Invalid or expired password reset token', 400));
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
        status: 200,
        success: true,
        message: 'Password has been reset'
    });
});
