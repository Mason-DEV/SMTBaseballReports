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
    if(process.env.NODE_ENV === "production"){
        await axios.get(`http://localhost:${process.env.PORT}/api/staff/staffByName`, {
            headers: { Authorization: devToken, name: operator } 
        }).then(res => {
            logger.info(id + " === getOperatorEmail returning");
            data = res.data
        }).catch(err => {
            logger.error(id + " === getOperatorEmail Error");
            logger.error(err);
        })
    }else{
        await axios.get(`http://localhost:5000/api/staff/staffByName`, {
            headers: { Authorization: devToken, name: operator } 
        }).then(res => {
            logger.info(id + " === getOperatorEmail returning");
            data = res.data
        }).catch(err => {
            logger.error(id + " === getOperatorEmail Error");
            logger.error(err);
        })
    }
	return data
}

// @route   POST documents/auditEmailSend/
// @desc
// @access  Private
router.route("/auditOpEmailSend").post(async function(req, res) {
    let id = uuid();
    var data = null;
    const blobPDF = req.body.opPDF;
	logger.info(id + " === auditOpEmailSend Started");
    const opInfo = await getOperatorEmail(req.body.ffxAudit.operator);
    var mailOptions = null;

    if (process.env.NODE_ENV === "production") {
    mailOptions = {
        from: 'm.guy@smt.com',
        to: opInfo.email.toString(),
        subject: 'OP Audit Report for ' +req.body.ffxAudit.gamestring.toString(),
        attachments: [
            {   
                filename: "OP Audit Report.pdf",
                path: blobPDF
            },
        ]
      };
    }
    else {
        mailOptions = {
            from: 'm.guy@smt.com',
            to: opInfo.email.toString(),
            subject: 'OP Audit Report for ' +req.body.ffxAudit.gamestring.toString(),
            attachments: [
                {   
                    filename: "OP Audit Report.pdf",
                    path: blobPDF
                },
            ]
          };
        }

    transporter.sendMail(mailOptions).then(info => {
            logger.info(id + " === auditOpEmailSend Completed");
            res.status(200).send(info.response);
        }).catch((e) => {
            logger.error(id + " === auditOpEmailSend Error");
            res.status(400).send(e.message)
        })
    });


// @route   POST documents/auditSupportEmailSend
// @desc
// @access  Private
router.route("/auditSupportEmailSend").post(async function(req, res) {
    let id = uuid();
    var data = null;
    const blobPDF = req.body.supportPDF;
	logger.info(id + " === auditSupportEmailSend Started");
    const opInfo = await getOperatorEmail(req.body.ffxAudit.operator);
    var mailOptions = null;

    if (process.env.NODE_ENV === "production") {
        mailOptions = {
        from: 'm.guy@smt.com',
        to:'p.mclaughlin@smt.com, s.king@smt.com',
        subject: 'Full Audit Report for ' +req.body.ffxAudit.gamestring.toString(),
        attachments: [
            {   
                filename: "Full Audit Report.pdf",
                path: blobPDF
            },
        ]
      }
    } else {
        logger.warn("DEV ENV");
        mailOptions = {
            from: 'm.guy@smt.com',
            to:'masondguy@gmail.com',
            subject: 'Full Audit Report for ' +req.body.ffxAudit.gamestring.toString(),
            attachments: [
                {   
                    filename: "Full Audit Report.pdf",
                    path: blobPDF
                },
            ]
          }
      }

    transporter.sendMail(mailOptions).then(info => {
            logger.info(id + " === auditSupportEmailSend Completed");
            res.status(200).send(info.response);
        }).catch((e) => {
            logger.error(id + " === auditSupportEmailSend Error");
            res.status(400).send(e.message)
        })
    });

module.exports = router;
