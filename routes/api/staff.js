const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const passport = require('passport');

//User Model
const Staff = require("../../models/Staff");

//Logger
const logger = require("../../config/logger");

//User API for getting all the staff memebers
router.route("/").get(function(req, res) {
	let id = uuid();
	logger.info(id + " === Requesting Staff");
	Staff.find(function(err, staff) {
		if (err) {
			logger.error("Error on / " + err.stack);
		} else {
			// console.log(staff);
			res.json(staff);
			logger.info(id + " === Staff Returned");
		}
	});
});

//User API for getting a staff memeber from _id
router.route("/staffByID").get(function(req, res) {
	let _id = req.headers.id;
	Staff.findById(_id, function(err, staff) {
		if (!staff) {
			logger.info("Could not find a Staff " + _id);
			res.status(404).send("Can not find this Staff");
		} else if (err) {
			logger.error("staffByID error " + err.stack);
			res.status(404).send("Can not find this Staff");
		} else {
			logger.info("Sending staff " + staff._id);
			res.status(200).send(staff);
		}
	});
});

//User API for updating a staff memeber from _id
router.route("/update/:id").put(function(req, res) {
    let _id = req.params.id;
	let uid = uuid();
	Staff.findById(_id, function(err, staff) {
		if (!staff) {
			logger.info("Could not find staff with id " + _id);``
			res.status(404).send("Can not find this staff in the DB");
		} else if (err) {
			logger.warn("Could not find an staff" + err.stack);
			res.status(404).send("Can not find this staff in the DB");
		} else {
			try {
                logger.warn(uid + " Modifying staff from === " + staff);
                staff.name = req.body.name;
                staff.email = req.body.email;
                staff.roles.auditor = req.body.roles.auditor;
                staff.roles.support = req.body.roles.support;
                staff.roles.operator = req.body.roles.operator;
                logger.warn(uid + " Modifying staff to === " + staff);
              }
              catch(error) {
                  logger.error(uid + " Error on update " + error);
                  res.status(404).send(error);
              }
			staff
				.save()
				.then(staff => {
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

// //User API for taking in a user id then the returning an userObject
// router.route('/userByID').get(function (req, res) {
//     let _id = req.headers.user;
//     User.findById(_id, function(err, user) {
//             if (!user){
//                 logger.info("Could not find a User " +_id)
//                 res.status(404).send("Can not find this User");
//             }
//             else if(err){
//                 logger.error("userByID error " +err.stack);
//                 res.status(404).send("Can not find this User");
//             }
//             else{ //Just returning username until more fields are added
//                 logger.info("Sending user " +user.username);
//                 res.status(200).send({"username": user.username});
//             }})
//     });

module.exports = router;
