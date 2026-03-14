const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
// this is a gmail app system 
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or Brevo, SendGrid, etc.
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // this for smtp mail service with middle men
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT),
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//     },
// });

    // Define the email options
    const mailOptions = {
        from: `CodeLearn <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
