var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'm.guy@smt.com',
        pass: 'snflynqfbnszcqwg'
    }
});

var mailOptions = {
  from: 'm.guy@smt.com',
  to: 'masondguy@gmail.com',
  subject: 'JOB TEST',
  text: 'This is a test of the emailer job'
};


async function ExecutePfxDaily(){
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
}

module.exports = {
    ExecutePfxDaily 
 };