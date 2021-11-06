const nodemailer = require('nodemailer');


const sendEmail = async options =>{
    // 1) Create a transporter
    console.log(process.env.EMAIL_HOST, process.env.EMAIL_PORT,process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD)
    const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        // activate in gmail "less secure app" option
    })
    //console.log(transporter)
    // 2)  Define the email  options
    const mailOptions = {
        from: 'Kakha Gujejiani <hello@jonas.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }
    // 3) Actually send the email 
    await   transporter.sendMail(mailOptions)
}

module.exports = sendEmail