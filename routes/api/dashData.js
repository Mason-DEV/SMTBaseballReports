const express = require("express");
const router = express.Router();
const logger = require("../../config/logger");
const uuid = require("uuid");

//Audit Model
const FFxAudit = require("../../models/FFxAudit");
const FFxTech = require("../../models/FFxTech");

//Returns date to match form of Gamestrings
const getGSDate = removeDays => {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate() - removeDays;
	date.get;
	if (day < 9) {
		day = "0" + date.getDate();
	}
	let formated = year + "_" + month + "_" + day;
	return formated;
};

// @route   GET api/dashData/TurnOver
// @desc    Get Calculation of TurnOver Time on Audits
// 		Calculation for this is Game Report Log Out -> Audit Report Ready For Share
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

// @route   GET api/dashData/PlaysResolved
// @desc    Get Calculation of Total Plays Resolved on Audits
// @Calc    Get summazation of all FFx Plays from Audit Reports
// @access  Public
router.route("/PlaysResolved").get(function(req, res) {
	let id = uuid();
	let Resolved = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find({})
		.select({ ffxPitches: 1, _id: 0 })
		.exec(function(err, Plays) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Plays.map((op, idx) => {
					Resolved += +op.ffxPitches;
                });
                Resolved = Resolved || 0;
				res.json(Resolved);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/AvgAuditTime
// @desc    Get Calculation of Average Audit Time on Audits
// @Calc    Calcuation of Audit (timeAccuracy + timeCompletion) / Number of Games ; ONLY when Ready for Share === Yes
// @access  Public
router.route("/AvgAuditTime").get(function(req, res) {
	let id = uuid();
	let AverageTime = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find({ readyShare: "Yes" })
		.select({ timeAccuracy: 1, timeCompletion: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				let gameCount = Games.length;
				let gameTime = 0;
				Games.map((game, idx) => {
					gameTime += +game.timeAccuracy + +game.timeCompletion;
				});
                AverageTime = gameTime / gameCount;
                AverageTime = AverageTime || 0;
				res.json(AverageTime);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/TimeSpentResolving
// @desc    Get Calculation of Time Spent Resolving on Audits
// @Calc    Summazation of all timeResolving from Audit Reports
// @access  Public
router.route("/TimeSpentResolving").get(function(req, res) {
	let id = uuid();
	let TotalTime = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ timeResolving: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					TotalTime += +game.timeResolving;
                });
                TotalTime = TotalTime || 0;
				res.json(TotalTime);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/MissedPitchesVidGaps
// @desc    Get Calculation of Total Missed Pitches from VidGaps on Audits
// @Calc    Summazation of all Missed Pitches due to VideGaps from Audit Reports
// @access  Public
router.route("/MissedPitchesVidGaps").get(function(req, res) {
	let id = uuid();
	let TotalPitchesMissed = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ missedPitchesVidGaps: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					TotalPitchesMissed += +game.missedPitchesVidGaps;
                });
                TotalPitchesMissed = TotalPitchesMissed || 0;
				res.json(TotalPitchesMissed);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/MissedBIPVidGaps
// @desc    Get Calculation of Total Missed Pitches from VidGaps on Audits
// @Calc    Summazation of all Missed Pitches due to VideGaps from Audit Reports
// @access  Public
router.route("/MissedBIPVidGaps").get(function(req, res) {
	let id = uuid();
	let TotalBIPMissed = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ missedPitchesVidGaps: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					TotalBIPMissed += +game.missedBIPVidGaps;
                });
                TotalBIPMissed = TotalBIPMissed || 0;
				res.json(TotalBIPMissed);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/TotalPitches
// @desc    Get Calculation of Pitches Added for Season/Month/Week
// @Calc    Summazation of each Item(Season/Month/Week) Returned as an Object
// @Calc    Season is Day1(Oldest Audit Report in DB) -> Today+1; Month is Today+1 -> Minus 30 days; Week is Today+1 -> Minus 7 Days
// @Calc    We used +1 on days due to JavaScripts comparing the gamestring formats
// @access  Public
router.route("/TotalPitches").get(function(req, res) {
	let id = uuid();
	let SeasonAdded = 0;
	let MonthAdded = 0;
	let WeekAdded = 0;
	let date = getGSDate(-1);
	let date7Ago = getGSDate(7);
	let date30Ago = getGSDate(30);

	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ gamestring: 1, numPitchesAdded: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					//All games are apart of season
					SeasonAdded += +game.numPitchesAdded;
					//Grab all games from last 30 days
					if (date > game.gamestring && date30Ago <= game.gamestring) {
						MonthAdded += +game.numPitchesAdded;
					}
					//Grab all games from last week
					if (date > game.gamestring && date7Ago <= game.gamestring) {
						WeekAdded += +game.numPitchesAdded;
					}
				});
				const TotalPitches = {
					SeasonAdded,
					MonthAdded,
					WeekAdded
				};
				res.json(TotalPitches);
				// logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/AvgOPResolve
// @desc    Get Calculation of Average OP Resolve Percent at End of Game
// @Calc    Average of all resolve %
// @Calc    Ready for Share -> ommitted; Ready for Audit -> 100%; All P/Cs done -> 90%;
// @Calc    80% -> 80%; 70% -> 70%; 60% -> 60%; 50% -> 50%; > 40% -> 40%; 30% -> 30%;
// @Calc    20% -> 20%; 10% -> 10%;  Recorded Only -> Omitted;
// @access  Public
router.route("/AvgOPResolve").get(function(req, res) {
	let id = uuid();
	let total = 0;
	let gameCount = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxTech.find()
		.select({ gameStatus: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					switch (game.gameStatus) {
						case "Ready for Audit":
							gameCount++;
							total += 100;
							break;
						case "All P/C's Done":
							total += 90;
							gameCount++;
							break;
						case "80% Resolved":
							gameCount++;
							total += 80;
							break;
						case "70% Resolved":
							gameCount++;
							total += 70;
							break;
						case "60% Resolved":
							gameCount++;
							total += 60;
							break;
						case "50% Resolved":
							gameCount++;
							total += 50;
							break;
						case "40% Resolved":
							gameCount++;
							total += 40;
							break;
						case "30% Resolved":
							gameCount++;
							total += 30;
							break;
						case "20% Resolved":
							gameCount++;
							total += 20;
							break;
						case "10% Resolved":
							gameCount++;
							total += 10;
							break;
						default:
							break;
					}
				});
				const Average = total / gameCount;
				res.json(Average);
				logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/TotalAudits
// @desc    Get Calculation of Total Audits for Season/Month/Week
// @Calc    Summazation of each Item(Season/Month/Week) Returned as an Object
// @Calc    Season is Day1(Oldest Audit Report in DB) -> Today+1; Month is Today+1 -> Minus 30 days; Week is Today+1 -> Minus 7 Days
// @Calc    We used +1 on days due to JavaScripts comparing the gamestring formats
// @access  Public
router.route("/TotalAudits").get(function(req, res) {
	let id = uuid();
	let SeasonAudit = 0;
	let MonthAudit = 0;
	let WeekAudit = 0;
	let date = getGSDate(-1);
	let date7Ago = getGSDate(7);
	let date30Ago = getGSDate(30);

	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ gamestring: 1, readyShare: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
					if (game.readyShare === "Yes") {
						//All games are apart of season
						SeasonAudit++;
						//Grab all games from last 30 days
						if (date > game.gamestring && date30Ago <= game.gamestring) {
							MonthAudit++;
						}
						//Grab all games from last week
						if (date > game.gamestring && date7Ago <= game.gamestring) {
							WeekAudit++;
						}
					}
				});
				const TotalAudit = {
					SeasonAudit,
					MonthAudit,
					WeekAudit
				};
				res.json(TotalAudit);
				// logger.info(id + " === Staff Auditors Returned");
			}
		});
});

// @route   GET api/dashData/GamesInBacklog
// @desc    Get Calculation of Games Not Ready For Share
// @Calc    Summazation of each Game not marked as readyShare
// @access  Public
router.route("/GamesInBacklog").get(function(req, res) {
	let id = uuid();
	let GamesInBacklog = 0;
	logger.info(id + " === Requesting Plays Resolved");
	FFxAudit.find()
		.select({ readyShare: 1, _id: 0 })
		.exec(function(err, Games) {
			if (err) {
				res.json(0);
				logger.error("Error on / " + err.stack);
			} else {
				Games.map((game, idx) => {
                    if(game.readyShare === "No"){
                        GamesInBacklog++
                    }
                });
				res.json(GamesInBacklog);
				// logger.info(id + " === Staff Auditors Returned");
			}
		});
});

module.exports = router;
