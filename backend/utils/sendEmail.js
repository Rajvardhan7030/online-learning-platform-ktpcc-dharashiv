const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    if (!process.env.RESEND_API_KEY) {
        const error = new Error('RESEND_API_KEY is not configured');
        if (process.env.NODE_ENV === 'production') {
            throw error;
        }
        console.error(error.message);
    }

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
        text: options.text || options.subject,
        html: options.html,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);

        // If not in production, log the email content so the developer can still get the OTP/link
        if (process.env.NODE_ENV !== 'production') {
            console.log('\n==================================================');
            console.log('DEVELOPMENT NOTIFICATION: Email Content');
            console.log('==================================================');
            console.log(`To:      ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log('--------------------------------------------------');
            console.log('HTML Content:');
            console.log(options.html);
            console.log('--------------------------------------------------');
            console.log('TEXT Content:');
            console.log(options.text || 'No text content provided');
            console.log('==================================================\n');
            
            // Return instead of throwing so the calling function can proceed
            return;
        }

        // In production, we want to know if email fails
        throw error;
    }
};

module.exports = sendEmail;
