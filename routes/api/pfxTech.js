const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const PFxTech = require("../../models/PFxTech");

//Logger
const logger = require("../../config/logger");

// @route   GET api/pfxTech/
// @desc    Get All PFxTech reports
// @access  Private
router.route("/").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting PFxTech");
	PFxTech.find({})
		.sort({ date: "desc" })
		.exec(function(err, PFxTech) {
			if (err) {
				logger.error("Error on PFxTech/ " + err.stack);
			} else {
				res.json(PFxTech);
				logger.info(id + " === PFxTech Returned");
			}
		});
});

// @route   GET api/pfxTech/today
// @desc    Get All of todays PFxTech reports
// @access  Private
router.route("/today").get(function(req, res) {
	let id = uuid();
	//Gets todays date in ISO format
	var curr = new Date();
	curr.setHours(curr.getHours() - 11)
	curr.setDate(curr.getDate());
	const searchDate = curr.toISOString().substr(0, 10);
	logger.info(id + " === Requesting Today's PFxTech " + searchDate);
	PFxTech.find({ date: searchDate })
		.sort({ venue: "asc" })
		.exec(function(err, PFxTech) {
			if (err) {
				logger.error("Error on PFxTech/Today " + err.stack);
			} else {
				res.json(PFxTech);
				logger.info(id + " === Today's PFxTech Returned");
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
	curr.setHours(curr.getHours() - 11)
	curr.setDate(curr.getDate());
	const searchDate = curr.toISOString().substr(0, 10);
	logger.info(id + " === Requesting Today's PFxTech Daily " + searchDate);
	PFxTech.find({ date: searchDate })
		.sort({ venue: "asc" })
		.exec(function(err, PFxTech) {
			if (err) {
				logger.error("Error on PFxTech Today Daily " + err.stack);
			} else {
				const data = PFxTech.map(game =>({
					venue: game.venue,
					operator: game.operator,
					hwswIssues: game.hwswIssues,
					t1Notes: game.t1Notes
				}))
			
				res.json(data);
				logger.info(id + " === Today's PFxTech Daily Returned");
			}
		});
});

// // @route   Get api/pfxTech/pfxReportByID
// // @desc    Get A Single PfxTech Report
// // @access  Private
router.route("/pfxReportByID").get(function(req, res) {
	let _id = req.headers.id;
	PFxTech.findById(_id, function(err, pfxTech) {
		if (!pfxTech) {
			logger.info("Could not find a pfxTech " + _id);
			res.status(404).send("Can not find this pfxTech");
		} else if (err) {
			logger.error("pfxReportByID error " + err.stack);
			res.status(404).send("Can not find this pfxTech");
		} else {
			logger.info("Sending pfxTech " + pfxTech._id);
			res.status(200).send(pfxTech);
		}
	});
});

// @route   PUT api/pfxTech/update/:id
// @desc    Update A PFxReport
// @access  Private
router.route("/update/:id").put(function(req, res) {
	let _id = req.params.id;
	let uid = uuid();
	PFxTech.findById(_id, function(err, pfxTech) {
		if (!pfxTech) {
			logger.info("Could not find pfxTech with id " + _id);
			res.status(404).send("Can not find this pfxTech in the DB");
		} else if (err) {
			logger.warn("Could not find an pfxTech" + err.stack);
			res.status(404).send("Can not find this pfxTech in the DB");
		} else {
			try {
				logger.warn(uid + " Modifying pfxTech from === " + pfxTech);
				(pfxTech.venue = req.body.venue),
					(pfxTech.operator = req.body.operator),
					(pfxTech.date = req.body.date),
					(pfxTech.logIn = req.body.logIn),
					(pfxTech.logOut = req.body.logOut),
					(pfxTech.firstPitch = req.body.firstPitch),
					(pfxTech.hwswIssues = req.body.hwswIssues.trim() === "" ? "None" : req.body.hwswIssues),
					(pfxTech.t1Notes = req.body.t1Notes),
					(pfxTech.t1Corrections = req.body.t1Corrections),
					(pfxTech.corrections = req.body.corrections);
				logger.warn(uid + " Modifying pfxTech to === " + pfxTech);
			} catch (error) {
				logger.error(uid + " Error on update " + error);
				res.status(404).send(error);
			}
			pfxTech
			  .save()
			  .then(pfxTech => {
				logger.warn(uid + " Modifying Complete");
				res.status(200).send(pfxTech);
			  })
			  .catch(err => {
				logger.error(uid + " Error on update " + err);
				res.sendStatus(404);
			  });
		}
	});
});

// @route   POST api/pfxTech/create
// @desc    Create A New Staff
// @access  Private
router.route("/create/").post(function(req, res) {
	let uid = uuid();
	let length = Object.keys(req.body.corrections).length;
	logger.info(uid + " Recieved PFxTech with " + length + " corrections");
	
	var corrections = {};
	for (var i = 0; i < length; i++) {
		let correct = req.body.corrections[i];
		corrections[i] = correct;
	}
	logger.info(uid + " Corrections " + corrections);
	const pfxTech = new PFxTech({
		venue: req.body.venue,
		operator: req.body.operator,
		date: req.body.date,
		logIn: req.body.logIn,
		logOut: req.body.logOut,
		firstPitch: req.body.firstPitch,
		hwswIssues: req.body.hwswIssues.trim() === "" ? "None" : req.body.hwswIssues,
		t1Notes: req.body.t1Notes,
		corrections: corrections
	});
	logger.info(uid + " Creating pfxTech === " + pfxTech);
	pfxTech
		.save()
		.then(done => res.sendStatus(200))
		.catch(err => {
			logger.error(uid + " Error on create " + err);
			this.sendStatus(404);
		});
	logger.info(uid + " pfxTech Created");
});

// @route   Delete api/pfxTech/delete/:id
// @desc    Delete A PFxTech Report
// @access  Private
router.delete("/delete/", (req, res) => {
	let uid = uuid();
	PFxTech.findById(req.headers.id)
	  .then(pfxTech => {
		logger.info(uid + " Deleting pfxTech === " + pfxTech._id);
		pfxTech.remove().then(() => {
		  logger.info(uid + " Deleting pfxTech Complete");
		  res.sendStatus(200);
		});
	  })
	  .catch(err => {
		logger.error(uid + " Error on delete " + err);
		res.sendStatus(404);
	  });
  });

module.exports = router;
