const nodemailer = require('nodemailer');
class MailSender {
  constructor(){
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // server para enviar mail desde gmail
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'lhazuca@gmail.com',
        pass: 'mugiwaranokaizoku40307822',
      },
    });
  }
  sendMail(to,subject,message,from){
    const mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: subject,
      text: message, // plain text body
    };
    this.transporter.sendMail(mailOptions);
  }
}

module.exports = {
  MailSender,
};