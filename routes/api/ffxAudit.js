const express = require("express");
const router = express.Router();
const logger = require("../../config/logger");
const uuid = require("uuid");

//Audit Model
const FFxAudit = require("../../models/FFxAudit");

// @route   GET api/FFxAudit/
// @desc    Get All audits reports
// @access  Public
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

// @route   Get api/FFxAudit/ffxReportByID
// @desc    Get A Single FFxAudit Report
// @access  Public
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

//  Defined update route
router.route("/update/:id").put(function(req, res) {
	let _id = req.params.id;
	FFxAudit.findById(_id, function(err, audit) {
		if (!audit) {
			logger.info("Could not find an audit with id " + _id);
			res.status(404).send("Can not find this Audit in the DB");
		} else if (err) {
			logger.warn("Could not find an audit" + err.stack);
			res.status(404).send("Can not find this Audit in the DB");
		} else audit.gamestring = req.body.gamestring;
		audit.auditor = req.body.auditor;
		audit.operator = req.body.operator;
		audit.ffxPitches = req.body.ffxPitches;
		audit.gdPitches = req.body.gdPitches;
		audit.missedPitches = req.body.missedPitches;
		audit.missedBIP = req.body.missedBIP;
		audit.pitchesAdd = req.body.pitchesAdd;
		audit.pickAdd = req.body.pickAdd;
		audit
			.save()
			.then(audit => {
				logger.error("Saving audit / " + audit);
				res.sendStatus(200).send(req.body.pickAdd);
				res.json(req.body.pickAdd);
			})
			.catch(err => {
				logger.error("Error on update " + err.stack);
				res.status(400).send(err);
			});
	});
});

// @route   POST api/FFxAudit/create
// @desc    Create A New FFxAudit
// @access  Public
router.route("/create/").post(function(req, res) {
	let uid = uuid();
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
				gdPitches: req.body.gdPitches
			});
			logger.info(uid + " Creating ffxAudit === " + ffxAudit);
			ffxAudit
				.save()
				.then(done => res.sendStatus(200))
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

// @route   POST api/audits
// @desc    Create An Audit
// @access  Public
// router.route('/', (req, res) => {
//     const newAudit = new Audit({
//        // gameID: req.body.gameID
//     });

//     newAudit.save().then(audit => res.json(audit));
// });

// @route   PUT api/audits
// @desc    Update An Audit Data
// @access  Public
// router.put('/:id', (req, res) => {
//     let _id = req.params.id;
//     Audit.findById(_id, function(err, audit) {
//         if (!audit)
//             res.status(404).send("Can not find this Audit in the DB");
//         else
//             audit.gamestring = req.body.gamestring;
//             audit.auditor = req.body.auditor;
//             audit.operator = req.body.operator;
//             audit.ffxPitches = req.body.ffxPitches;
//             audit.gdPitches = req.body.gdPitches;
//             audit.missedPitches = req.body.missedPitches;
//             audit.missedBIP = req.body.missedBIP;
//             audit.pitchesAdd = req.body.pitchesAdd;
//             audit.pickAdd = req.body.pickAdd;
//             audit.save().then(audit => {
//                 res.json('Audit updated!');
//             })
//             .catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//     });

// });

// @route   Delete api/FFxAudit/delete/:id
// @desc    Delete A FFxAudit Report
// @access  Public
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
