const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const FFxTech = require("../../models/FFxTech");

//Logger
const logger = require("../../config/logger");

// @route   GET api/ffxtech/
// @desc    Get All ffxtech reports
// @access  Public

// @route   GET api/ffxtech/today
// @desc    Get All of todays ffxtech reports
// @access  Public

// // @route   Get api/ffxtech/pfxReportByID
// // @desc    Get A Single ffxtech Report
// // @access  Public

// @route   PUT api/ffxtech/update/:id
// @desc    Update A PFxReport
// @access  Public

// @route   POST api/ffxtech/create
// @desc    Create A New Staff
// @access  Public
router.route("/create/").post(function(req, res) {
	let uid = uuid();
	const ffxTech = new FFxTech({
		venue: req.body.venue,
		operator: req.body.operator,
		support: req.body.support,
		date: req.body.date,
		logIn: req.body.logIn,
		logOut: req.body.logOut,
		firstPitch: req.body.firstPitch,
		gameID: req.body.gameID,
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
});

// @route   Delete api/ffxtech/delete/:id
// @desc    Delete A ffxtech Report
// @access  Public

module.exports = router;
