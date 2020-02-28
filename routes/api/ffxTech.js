const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const FFxTech = require("../../models/FFxTech");

//Logger
const logger = require("../../config/logger");

// @route   GET api/ffxtech/
// @desc    Get All ffxtech reports
// @access  Private
router.route("/").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting FFxTech");
	FFxTech.find({})
		.sort({ date: "desc" })
		.exec(function(err, FFxTech) {
			if (err) {
				logger.error("Error on FFxTech/ " + err.stack);
			} else {
				res.json(FFxTech);
				logger.info(id + " === FFxTech Returned");
			}
		});
});

// @route   GET api/ffxtech/today
// @desc    Get All of todays ffxtech reports
// @access  Private
router.route("/today").get(function(req, res) {
	let id = uuid();
	//Gets todays date in ISO format
	var curr = new Date();
	curr.setHours(curr.getHours() - 11);
	curr.setDate(curr.getDate());
	const searchDate = curr.toISOString().substr(0, 10);
	logger.info(id + " === Requesting Today's FFxTech " + searchDate);
	FFxTech.find({ date: searchDate })
		.sort({ venue: "asc" })
		.exec(function(err, FFxTech) {
			if (err) {
				logger.error("Error on FFxTech/Today " + err.stack);
			} else {
				res.json(FFxTech);
				logger.info(id + " === Today's FFxTech Returned");
			}
		});
});

// @route   GET api/ffxtech/todayDaily
// @desc    Get All of todays ffxtech reports
// @access  Private
router.route("/todayDaily").get(function(req, res) {
	let id = uuid();
	//Gets todays date in ISO format
	var curr = new Date();
	curr.setHours(curr.getHours() - 11);
	curr.setDate(curr.getDate());
	const searchDate = curr.toISOString().substr(0, 10);
	logger.info(id + " === Requesting Today's FFxTech Daily " + searchDate);
	FFxTech.find({ date: searchDate })
		.sort({ venue: "asc" })
		.exec(function(err, FFxTech) {
			if (err) {
				logger.error("Error on FFxTech Today Daily" + err.stack);
			} else {
				const data = FFxTech.map(game =>({
					operator: game.operator,
					gameStatus: game.gameStatus,
					gameID: game.gameID,
					supportNotes: game.supportNotes
				}))
			
				res.json(data);
				logger.info(id + " === Today's FFxTech Daily Returned");
			}
		});
});

// @route   Get api/ffxtech/ffxReportByID
// @desc    Get A Single ffxtech Report
// @access  Private
router.route("/ffxReportByID").get(function(req, res) {
	let _id = req.headers.id;
	FFxTech.findById(_id, function(err, ffxTech) {
		if (!ffxTech) {
			logger.info("Could not find a ffxTech " + _id);
			res.status(404).send("Can not find this ffxTech");
		} else if (err) {
			logger.error("ffxReportByID error " + err.stack);
			res.status(404).send("Can not find this ffxTech");
		} else {
			logger.info("Sending ffxTech " + ffxTech._id);
			res.status(200).send(ffxTech);
		}
	});
});

// @route   PUT api/ffxtech/update/:id
// @desc    Update A FFxReport
// @access  Private
router.route("/update/:id").put(function(req, res) {
	let _id = req.params.id;
	let uid = uuid();
	//Find Report for this ID
	FFxTech.findById(_id, function(err, ffxTech) {
		if (!ffxTech) {
			logger.info("Could not find ffxTech with id " + _id);
			res.status(404).send("Can not find this ffxTech in the DB");
		} else if (err) {
			logger.warn("Could not find an ffxTech" + err.stack);
			res.status(404).send("Can not find this ffxTech in the DB");
		} else {
			try {
				logger.warn(uid + " Modifying ffxTech from === " + ffxTech);
				(ffxTech.venue = req.body.venue),
					(ffxTech.operator = req.body.operator),
					(ffxTech.support = req.body.support),
					(ffxTech.date = req.body.date),
					(ffxTech.logIn = req.body.logIn),
					(ffxTech.logOut = req.body.logOut),
					(ffxTech.firstPitch = req.body.firstPitch),
					(ffxTech.gameID = req.body.gameID),
					(ffxTech.bitMode = req.body.bitMode),
					(ffxTech.gameStatus = req.body.gameStatus),
					(ffxTech.ipCamIssues = req.body.ipCamIssues.trim() === "" ? "None" : req.body.ipCamIssues),
					(ffxTech.fgdIssues = req.body.fgdIssues.trim() === "" ? "None" : req.body.fgdIssues),
					(ffxTech.resolverIssues = req.body.resolverIssues.trim() === "" ? "None" : req.body.resolverIssues),
					(ffxTech.hardwareIssues = req.body.hardwareIssues.trim() === "" ? "None" : req.body.hardwareIssues),
					(ffxTech.miscNotes = req.body.miscNotes.trim() === "" ? "None" : req.body.miscNotes),
					(ffxTech.supportNotes = req.body.supportNotes),
					(ffxTech.bisonSet = req.body.bisonSet),
					(ffxTech.backupTask = req.body.backupTask),
					(ffxTech.backupNote = req.body.backupNote);
				logger.warn(uid + " Modifying ffxTech to === " + ffxTech);
			} catch (error) {
				logger.error(uid + " Error on update " + error);
				res.status(404).send(error);
			}
			ffxTech
				.save()
				.then(ffxTech => {
					logger.warn(uid + " Modifying Complete");
					res.status(200).send(ffxTech);
				})
				.catch(err => {
					logger.error(uid + " Error on update " + err);
					res.sendStatus(404);
				});
		}
	});
});
// @route   POST api/ffxtech/create
// @desc    Create A New Staff
// @access  Private
router.route("/create/").post(function(req, res) {
	let uid = uuid();
	//First we check to make sure this gamestring doesnt exist already
	FFxTech.findOne({ gameID: req.body.gameID }).then(function(report) {
		if (!report) {
			//No reports with this gameID so we can create
			const ffxTech = new FFxTech({
				venue: req.body.venue,
				operator: req.body.operator,
				support: req.body.support,
				date: req.body.date,
				logIn: req.body.logIn,
				logOut: req.body.logOut,
				firstPitch: req.body.firstPitch,
				gameID: req.body.gameID,
				bitMode: req.body.bitMode,
				gameStatus: req.body.gameStatus,
				ipCamIssues: req.body.ipCamIssues.trim() === "" ? "None" : req.body.ipCamIssues,
				fgdIssues: req.body.fgdIssues.trim() === "" ? "None" : req.body.fgdIssues,
				resolverIssues: req.body.resolverIssues.trim() === "" ? "None" : req.body.resolverIssues,
				hardwareIssues: req.body.hardwareIssues.trim() === "" ? "None" : req.body.hardwareIssues,
				miscNotes: req.body.miscNotes.trim() === "" ? "None" : req.body.miscNotes,
				supportNotes: req.body.supportNotes,
				bisonSet: req.body.bisonSet,
				backupTask: req.body.backupTask,
				backupNote: req.body.backupNote
			});
			logger.info(uid + " Creating ffxTech === " + ffxTech);
			ffxTech
				.save()
				.then(done => res.sendStatus(200))
				.catch(err => {
					logger.error(uid + " Error on create " + err);
					res.sendStatus(400);
				});
			logger.info(uid + " ffxTech Created");
		}
		//Throw an error one exist already
		else {
			logger.error(uid + " Error on create, duplicate game strings ");
			res.status(403).send("Can not create this report, a report with this gameID exist already.");
		}
	});
});

// @route   Delete api/ffxtech/delete/:id
// @desc    Delete A ffxtech Report
// @access  Private
router.delete("/delete/", (req, res) => {
	let uid = uuid();
	FFxTech.findById(req.headers.id)
		.then(ffxTech => {
			logger.info(uid + " Deleting ffxTech === " + ffxTech._id);
			ffxTech.remove().then(() => {
				logger.info(uid + " Deleting ffxTech Complete");
				res.sendStatus(200);
			});
		})
		.catch(err => {
			logger.error(uid + " Error on delete " + err);
			res.sendStatus(404);
		});
});

module.exports = router;
