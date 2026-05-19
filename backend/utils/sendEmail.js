const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Resend SMTP Configuration
    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        auth: {
            user: 'resend', // This is literally "resend"
            pass: process.env.RESEND_API_KEY,
        },
    });

    /*
    //  GMAIL SMTP CONFIGURATION (Backup)
    //  If you want to switch back to Gmail, comment out the Resend block above and uncomment this.
     
     const transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
             user: process.env.EMAIL_USERNAME,
             pass: process.env.EMAIL_PASSWORD,
         },
    });
    */
     

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_FROM || `CodeLearn <onboarding@resend.dev>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
