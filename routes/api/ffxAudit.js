const express = require("express");
const router = express.Router();
const logger = require("../../config/logger");
const uuid = require("uuid");
const axios = require("axios");
const devToken = require("../../config/keys").SECERT_JWT;
const auditEmailService = require('../../services/auditEmailService');

//Audit Model
const FFxAudit = require("../../models/FFxAudit");

sendAuditEmail = async (blobPDF, ffxAudit, ) =>{
	let id = uuid();
	logger.info(id + " === sendAuditEmail Started");
	var data = null;
	if(process.env.NODE_ENV === "production"){
			await axios.post(`http://localhost:${process.env.PORT}/api/AuditEmailSender/auditEmailSend/`, {blobPDF, ffxAudit}, {
				headers: { Authorization: devToken  } 
			}).then(res => {
				logger.info(id + " === sendAuditEmail returning");
				data = res.data
			}).catch(err => {
				logger.error(id + " === sendAuditEmail Error");
				data = err
		})
	}else{
		await axios.post(`http://localhost:5000/api/AuditEmailSender/auditEmailSend/`, {blobPDF, ffxAudit}, {
			headers: { Authorization: devToken  } 
		}).then(res => {
			logger.info(id + " === sendAuditEmail returning");
			data = res.data
		}).catch(err => {
			logger.error(id + " === sendAuditEmail Error");
			data = err
	})}

	return data
}

const currentDate =() => {
	var curr = new Date();
	curr.setDate(curr.getDate());
	return curr.toISOString();
}

// @route   GET api/FFxAudit/
// @desc    Get All audits reports
// @access  Private
router.route("/").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting Audits");
	FFxAudit.find({})
		.sort({ gamestring: "desc" })
		.exec(function(err, audit) {
			if (err) {
				logger.error("Error on / " + err.stack);
			} else {
				res.json(audit);
				logger.info(id + " === Audits Returned");
			}
		});
});

// @route   GET api/FFxAudit/missedBIP
// @desc    Get All audits reports
// @access  Private
router.route("/missedBIP").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting missedBIP");
	FFxAudit.find({}, 'missedBIPVidGaps')
		.exec(function(err, audit) {
			if (err) {
				logger.error("Error on missedBIP " + err.stack);
			} else {
				var data = 0;
				audit.forEach(element => {
					if(element.missedBIPVidGaps != undefined){
						data += +element.missedBIPVidGaps
					}
				});
				res.json(data);
				logger.info(id + " === Audits missedBIP");
			}
		});
});

// @route   GET api/FFxAudit/missedPitches
// @desc    Get All audits reports
// @access  Private
router.route("/missedPitches").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting missedPitches");
	FFxAudit.find({}, 'missedPitchesVidGaps')
		.exec(function(err, audit) {
			if (err) {
				logger.error("Error on missedBIP " + err.stack);
			} else {
				var data = 0;
				audit.forEach(element => {
					if(element.missedBIPVidGaps != undefined){
					data += +element.missedBIPVidGaps
				}
				});
				res.json(data);
				logger.info(id + " === Audits missedPitches");
			}
		});
});

// @route   GET api/FFxAudit/missedPitches
// @desc    Get All audits reports
// @access  Private
router.route("/totalPlays").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting totalPlays");
	FFxAudit.find({}, 'ffxPitches')
		.exec(function(err, audit) {
			if (err) {
				logger.error("Error on totalPlays " + err.stack);
			} else {
				var data = 0;
				audit.forEach(element => {
					if(element.ffxPitches != undefined && element.ffxPitches != ''){
						data += +element.ffxPitches
						console.log(element.ffxPitches)
					}
				});
				res.json(data);
				logger.info(id + " === Audits totalPlays");
			}
		});
});

// @route   Get api/FFxAudit/ffxReportByID
// @desc    Get A Single FFxAudit Report
// @access  Private
router.route("/ffxReportByID").get(function(req, res) {
	let _id = req.headers.id;
	FFxAudit.findById(_id, function(err, ffxAudit) {
		if (!ffxAudit) {
			logger.info("Could not find a ffxAudit " + _id);
			res.status(404).send("Can not find this ffxAudit");
		} else if (err) {
			logger.error("ffxReportByID error " + err.stack);
			res.status(404).send("Can not find this ffxAudit");
		} else {
			logger.info("Sending ffxAudit " + ffxAudit._id);
			res.status(200).send(ffxAudit);
		}
	});
});

// @route   PUT api/ffxAudit/update/:id
// @desc    Update A FFxAudit Report
// @access  Private
router.route("/update/:id").put(function(req, res) {
	let _id = req.params.id;
	let uid = uuid();
	let isReadyForShare = req.body.readyShare;
	let emailSent = false;
	if(isReadyForShare === "Yes"){
		emailSent = true;
	}
	//Find Report for this ID
	FFxAudit.findById(_id, function(err, ffxAudit) {
		if (!ffxAudit) {
			logger.info("Could not find ffxAudit with id " + _id);
			res.status(404).send("Can not find this ffxAudit in the DB");
		} else if (err) {
			logger.warn("Could not find an ffxAudit" + err.stack);
			res.status(404).send("Can not find this ffxAudit in the DB");
		} else {
			if(ffxAudit.emailSent == true){
				emailSent = false;
			}
			try {
				logger.warn(uid + " Modifying ffxAudit from === " + ffxAudit);
				ffxAudit.gamestring = req.body.gamestring;
				ffxAudit.commentsBall = req.body.commentsBall;
				ffxAudit.commentsMisc = req.body.commentsMisc;
				ffxAudit.commentsPlayer = req.body.commentsPlayer;
				ffxAudit.logIn = req.body.logIn;
				ffxAudit.logOut = req.body.logOut;
				ffxAudit.missedBIPVidGaps = req.body.missedBIPVidGaps;
				ffxAudit.vidGaps = req.body.vidGaps;
				ffxAudit.missedPitchesVidGaps = req.body.missedPitchesVidGaps;
				ffxAudit.numBIPasPC = req.body.numBIPasPC;
				ffxAudit.numFBasPC = req.body.numFBasPC;
				ffxAudit.numPicksAdded = req.body.numPicksAdded;
				ffxAudit.numPitchesAdded = req.body.numPitchesAdded;
				ffxAudit.operator = req.body.operator;
				ffxAudit.auditor = req.body.auditor;
				ffxAudit.readyShare = req.body.readyShare;
				ffxAudit.stepAccuracy = req.body.stepAccuracy;
				ffxAudit.stepCompletion = req.body.stepCompletion;
				ffxAudit.stepResolving = req.body.stepResolving;
				ffxAudit.timeAccuracy = req.body.timeAccuracy;
				ffxAudit.timeCompletion = req.body.timeCompletion;
				ffxAudit.timeResolving = req.body.timeResolving;
				ffxAudit.ffxPitches = req.body.ffxPitches;
				ffxAudit.gdPitches = req.body.gdPitches;
				logger.warn(uid + " Modifying ffxAudit to === " + ffxAudit);
			} catch (error) {
				logger.error(uid + " Error on update " + error);
				res.status(404).send(error);
			}
			ffxAudit
				.save()
				.then(ffxAudit => {
					logger.warn(uid + " Modifying Complete");
					res.status(200).send(ffxAudit);
					//Audit was saved, call email send if needed
					if(emailSent){
						auditEmailService.ExecuteAuditEmail(ffxAudit);
					}
				})
				.catch(err => {
					logger.error(uid + " Error on update " + err);
					res.sendStatus(404);
				});
		}
	});
});


// @route   PUT api/ffxAudit/update/:id
// @desc    Update A FFxAudit Report
// @access  Private
router.route("/updateEmailStatus").put(function(req, res) {
	let _id = req.body.ffxAudit._id;
	let uid = uuid();
	//Find Report for this ID
	FFxAudit.findById(_id, function(err, ffxAudit) {
		if (!ffxAudit) {
			logger.info("Could not find ffxAudit with id " + _id);
			res.status(404).send("Can not find this ffxAudit in the DB");
		} else if (err) {
			logger.warn("Could not find an ffxAudit" + err.stack);
			res.status(404).send("Can not find this ffxAudit in the DB");
		} else {
			try {
				logger.warn(uid + " Modifying ffxAudit from === " + ffxAudit);
				ffxAudit.gamestring = req.body.ffxAudit.gamestring;
				ffxAudit.commentsBall = req.body.ffxAudit.commentsBall;
				ffxAudit.commentsMisc = req.body.ffxAudit.commentsMisc;
				ffxAudit.commentsPlayer = req.body.ffxAudit.commentsPlayer;
				ffxAudit.logIn = req.body.ffxAudit.logIn;
				ffxAudit.logOut = req.body.ffxAudit.logOut;
				ffxAudit.missedBIPVidGaps = req.body.ffxAudit.missedBIPVidGaps;
				ffxAudit.vidGaps = req.body.ffxAudit.vidGaps;
				ffxAudit.missedPitchesVidGaps = req.body.ffxAudit.missedPitchesVidGaps;
				ffxAudit.numBIPasPC = req.body.ffxAudit.numBIPasPC;
				ffxAudit.numFBasPC = req.body.ffxAudit.numFBasPC;
				ffxAudit.numPicksAdded = req.body.ffxAudit.numPicksAdded;
				ffxAudit.numPitchesAdded = req.body.ffxAudit.numPitchesAdded;
				ffxAudit.operator = req.body.ffxAudit.operator;
				ffxAudit.auditor = req.body.ffxAudit.auditor;
				ffxAudit.readyShare = req.body.ffxAudit.readyShare;
				ffxAudit.stepAccuracy = req.body.ffxAudit.stepAccuracy;
				ffxAudit.stepCompletion = req.body.ffxAudit.stepCompletion;
				ffxAudit.stepResolving = req.body.ffxAudit.stepResolving;
				ffxAudit.timeAccuracy = req.body.ffxAudit.timeAccuracy;
				ffxAudit.timeCompletion = req.body.ffxAudit.timeCompletion;
				ffxAudit.timeResolving = req.body.ffxAudit.timeResolving;
				ffxAudit.ffxPitches = req.body.ffxAudit.ffxPitches;
				ffxAudit.gdPitches = req.body.ffxAudit.gdPitches;
				ffxAudit.emailSent =  req.body.updateData.emailSent,
				ffxAudit.dateEmailSent = req.body.updateData.dateEmailSent,
				ffxAudit.emailNotSentReason = req.body.updateData.emailNotSentReason
				logger.warn(uid + " Modifying ffxAudit to === " + ffxAudit);
			} catch (error) {
				logger.error(uid + " Error on update " + error);
				res.status(404).send(error);
			}
			ffxAudit
				.save()
				.then(ffxAudit => {
					logger.warn(uid + " Modifying Complete");
					res.sendStatus(200);
				})
				.catch(err => {
					logger.error(uid + " Error on update " + err);
					res.sendStatus(404);
				});
		}
	});
});




// @route   Get api/FFxAudit/ffxAuditNoEmail
// @desc    Get A Single FFxAudit Report
// @access  Private
router.route("/ffxAuditNoEmail").get(function(req, res) {
	FFxAudit.find({emailSent: false, readyShare: "Yes"}, function(err, ffxAudit) {
		if (!ffxAudit) {
			logger.info("Could not find a ffxAuditNoEmail");
			res.status(404).send("Can not find this ffxAuditNoEmail with emailSent : false");
		} else if (err) {
			logger.error("ffxAuditNoEmail error " + err.stack);
			res.status(404).send("Can not find this ffxAuditNoEmail with emailSent : false");
		} else {
			const data = ffxAudit.map(report =>({
					_id: report._id,
					emailSent: report.emailSent,
					dateEmailSent: report.dateEmailSent,
					emailNotSentReason: report.emailNotSentReason
				}))
				logger.info("Sending ffxAuditNoEmail");
				res.status(200).send(data);
			// res.status(200).send(ffxAudit);
		}
	});
});


// @route   POST api/FFxAudit/create
// @desc    Create A New FFxAudit
// @access  Private
router.route("/create/").post(function(req, res) {
	let uid = uuid();
	let isReadyForShare = req.body.readyShare;
	let emailSent = false;
	if(isReadyForShare === "Yes"){
		emailSent = true;
	}
	//First we check to make sure this gamestring doesnt exist already
	FFxAudit.findOne({ gamestring: req.body.gamestring }).then(function(report) {
		if (!report) {
			//No reports with this gameID so we can create
			const ffxAudit = new FFxAudit({
				gamestring: req.body.gamestring,
				commentsBall: req.body.commentsBall,
				commentsMisc: req.body.commentsMisc,
				commentsPlayer: req.body.commentsPlayer,
				logIn: req.body.logIn,
				logOut: req.body.logOut,
				vidGaps: req.body.vidGaps,
				missedBIPVidGaps: req.body.missedBIPVidGaps,
				missedPitchesVidGaps: req.body.missedPitchesVidGaps,
				numBIPasPC: req.body.numBIPasPC,
				numFBasPC: req.body.numFBasPC,
				numPicksAdded: req.body.numPicksAdded,
				numPitchesAdded: req.body.numPitchesAdded,
				operator: req.body.operator,
				auditor: req.body.auditor,
				readyShare: req.body.readyShare,
				stepAccuracy: req.body.stepAccuracy,
				stepCompletion: req.body.stepCompletion,
				stepResolving: req.body.stepResolving,
				timeAccuracy: req.body.timeAccuracy,
				timeCompletion: req.body.timeCompletion,
				timeResolving: req.body.timeResolving,
				ffxPitches: req.body.ffxPitches,
				gdPitches: req.body.gdPitches,
				emailSent: false,
				dateEmailSent: null,
				emailNotSentReason: "Not Attempted"
			});
			logger.info(uid + " Creating ffxAudit === " + ffxAudit);
			ffxAudit
				.save()
				.then(done =>{
					res.sendStatus(200);
					//Audit was saved, call email send if needed
					if(emailSent){
						auditEmailService.ExecuteAuditEmail(ffxAudit);
					}
				})
				.catch(err => {
					logger.error(uid + " Error on create " + err);
					res.sendStatus(400);
				});
			logger.info(uid + " ffxAudit Created");
		}
		//Throw an error one exist already
		else {
			logger.error(uid + " Error on create, duplicate game strings ");
			res.status(403).send("Can not create this report, a report with this gameID exist already.");
		}
	});
});

// @route   Delete api/FFxAudit/delete/:id
// @desc    Delete A FFxAudit Report
// @access  Private
router.delete("/delete/", (req, res) => {
	let uid = uuid();
	FFxAudit.findById(req.headers.id)
		.then(ffxAudit => {
			logger.info(uid + " Deleting ffxAudit === " + ffxAudit._id);
			ffxAudit.remove().then(() => {
				logger.info(uid + " Deleting ffxAudit Complete");
				res.sendStatus(200);
			});
		})
		.catch(err => {
			logger.error(uid + " Error on delete " + err);
			res.sendStatus(404);
		});
});
module.exports = router;
