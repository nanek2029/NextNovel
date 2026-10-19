// Omar - NextNovel - Sprint 1
// PBI #5
// Sends password recovery emails.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendPasswordResetEmail = async (email, resetToken) => {
    await transporter.sendMail({
        from: `"NextNovel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'NextNovel Password Reset',
        text:
            `You requested a password reset for your NextNovel account.\n\n` +
            `Your password reset token is:\n${resetToken}\n\n` +
            `This token expires in 15 minutes.\n\n` +
            `If you did not request this reset, you can ignore this email.`
    });
};

module.exports = {
    sendPasswordResetEmail
};