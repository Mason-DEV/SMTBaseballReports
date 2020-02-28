const uuid = require("uuid");
const devToken = require("../../config/keys").SECERT_JWT;
const axios = require("axios");
const nodemailer = require('nodemailer');
const express = require("express");
const router = express.Router();
const logger = require("../../config/logger");

const getDate = () => {
	var date = new Date();
	var formated = date.toLocaleDateString();
	return formated;
};

const getTime = () => {
	var date = new Date();
	var time = date.getTime();
	return time;
}



const transporter = nodemailer.createTransport({
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

getOperatorEmail = async (operator) => {
    let id = uuid();
	logger.info(id + " === getOperatorEmail Started");
	var data = null;
	await axios.get("http://localhost:5000/api/staff/staffByName", {
		 headers: { Authorization: devToken, name: operator } 
	}).then(res => {
		logger.info(id + " === getOperatorEmail returning");
		data = res.data
	}).catch(err => {
		logger.error(id + " === getOperatorEmail Error");
		logger.error(err);
})
	return data
}

const sendAuditEmail = async (mailOptions) =>{
    var data = null;
    transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
          data = error
        } else {
          console.log('Email sent: ' + info.response);
          data = info.response;
        }
      });
      return data
} 

// @route   POST documents/auditEmailSend/
// @desc
// @access  Private
router.route("/auditEmailSend").post(async function(req, res) {
    let id = uuid();
    var data = null;
    const blobPDF = req.body.blobPDF;
	logger.info(id + " === auditEmailSend Started");
    const opEmailAddress = await getOperatorEmail(req.body.ffxAudit.operator);
    console.log("EMAIL SENDING")
    // console.log(req.body.ffxAudit)
    // console.log(opEmailAddress.email)
    
    const mailOptions = {
        from: 'm.guy@smt.com',
        to:'masondguy@gmail.com',
        subject: 'Audit Report for ' +req.body.ffxAudit.gamestring.toString(),
        attachments: [
            {   
                filename: "OP Audit Report.pdf",
                path: blobPDF
            },
        ]
      };
      
      data = await sendAuditEmail(mailOptions);
      res.status(200).send(data);
});

module.exports = router;
