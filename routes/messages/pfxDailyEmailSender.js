const nodemailer = require('nodemailer');
const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const devToken = require("../../config/keys").SECERT_JWT;
const axios = require("axios");

//Logger
const logger = require("../../config/logger");
const PdfPrinter = require("pdfmake/src/printer");
const blobStream = require("blob-stream");
const fs = require("fs");
const fonts = {
	Roboto: {
		normal: "routes/documents/fonts/Roboto-Regular.ttf",
		bold: "fonts/Roboto-Medium.ttf",
		italics: "fonts/Roboto-Italic.ttf",
		bolditalics: "fonts/Roboto-MediumItalic.ttf"
	}
};




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

const mailOptions = {
  from: 'm.guy@smt.com',
  to: 'masondguy@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};



// @route   GET documents/testPDF/
// @desc
// @access  Private
router.route("/pfxDailEmailSend").post(async function(req, res) {
    
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
});

module.exports = router;
