const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const PFxTech = require("../../models/PFxTech");

//Logger
const logger = require("../../config/logger");

// @route   GET api/pfxTech/
// @desc    Get All PFxTech reports
// @access  Public
router.route("/").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting PFxTech");
	PFxTech.find({}).exec(function(err, PFxTech) {
		if (err) {
			logger.error("Error on PFxTech/ " + err.stack);
		} else {
			res.json(PFxTech);
			logger.info(id + " === PFxTech Returned");
		}
	});
});

// @route   GET api/pfxTech/staffByID
// @desc    Get A Single Staff
// @access  Public

// @route   PUT api/pfxTech/update/:id
// @desc    Update A Staff
// @access  Public

// @route   POST api/pfxTech/create
// @desc    Create A New Staff
// @access  Public
router.route("/create/").post(function(req, res) {
	let uid = uuid();
	let length = Object.keys(req.body.corrections).length;
	logger.info(uid + " Recieved PFxTech with " + length + " corrections");
	var corrections = {};
	for (var i = 0; i < length; i++) {
    let correct = JSON.stringify(req.body.corrections[i]);
    corrections[i] = correct;
	}
  // console.log(corrections);
	logger.info(uid + " Corrections " + corrections);
	const pfxTech = new PFxTech({
		venue: req.body.venue,
		operator: req.body.operator,
		date: req.body.date,
		logIn: req.body.logIn,
		logOut: req.body.logOut,
		firstPitch: req.body.firstPitch,
		hwswIssues: req.body.hwswIssues,
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
// @desc    Delete A Staff
// @access  Public

module.exports = router;
