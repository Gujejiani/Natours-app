const nodemailer = require('nodemailer');
const pug = require('pug')
const {htmlToText} = require('html-to-text')



// new Email(user, url).sendWelcome()

module.exports = class Email {
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Kakha  Gujejiani  <${process.env.EMAIL_FROM}>`
    }

   createTransport(){
       console.log(process.env.NODE_ENV)
       console.log('does it happening or not')
     if(5>4){
         console.log('here we go again')
        return nodemailer.createTransport({
          //  service: 'SendGrid',
            host: 'in.mailsac.com',
            port: 25,
            secure: false, // use SSL
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
              }
        })
        
     }
     
     return nodemailer.createTransport({
            // service: 'Gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
    
            // activate in gmail "less secure app" option
        })
    }

   async send(template, subject){
        //  Send the actual email
        // 1) Render HTML based on a pug template  
           const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
               firstName: this.firstName,
               url: this.url,
               subject
           })

        // 2) define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html,
            text: htmlToText(html),
            // html: 
        }

        // 3) create a transport and send email
      await  this.createTransport().sendMail(mailOptions)
    }

   async sendWelcome(){
        await this.send('welcome', 'welcome to the Natours Family')
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token valid for only 10 minutes')
    }
}


















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

// module.exports = sendEmail