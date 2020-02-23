const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const Staff = require("../../models/Staff");

//Logger
const logger = require("../../config/logger");

// @route   GET api/staff/
// @desc    Get All Staff returned in asc order by name
// @access  Private
router.route("/").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff");
  Staff.find({}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(staff);
      logger.info(id + " === Staff Returned");
    }
  });
});

// @route   GET api/staff/auditors
// @desc    Get All auditors Staff name and email returned in asc order by name
// @access  Private
router.route("/auditors").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff Auditors");
  Staff.find({'roles.auditor': true}, { 'name':1, 'email':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(staff);
      logger.info(id + " === Staff Auditors Returned");
    }
  });
});

// @route   GET api/staff/Operators
// @desc    Get All operators Staff name and email returned in asc order by name
// @access  Private
router.route("/Operators").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff PFx Operators");
  Staff.find({'roles.pfxOperator': true, 'roles.ffxOperator': true}, { 'name':1, 'email':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      // const staffToSend = [staff];
      res.json(staff);
      logger.info(id + " === Staff Pfx Operators Returned");
    }
  });
});
// @route   GET api/staff/pfxOperators
// @desc    Get All PFX operators Staff name and email returned in asc order by name
// @access  Private
router.route("/pfxOperators").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff PFx Operators");
  Staff.find({'roles.pfxOperator': true}, { 'name':1, 'email':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      // const staffToSend = [staff];
      res.json(staff);
      logger.info(id + " === Staff Pfx Operators Returned");
    }
  });
});
// @route   GET api/staff/ffxOperators
// @desc    Get All FFX operators Staff name and email returned in asc order by name
// @access  Private
router.route("/FfxOperators").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff FFx Operators");
  Staff.find({'roles.ffxOperator': true}, { 'name':1, 'email':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      // const staffToSend = [staff];
      res.json(staff);
      logger.info(id + " === Staff FFx Operators Returned");
    }
  });
});

// @route   GET api/staff/support
// @desc    Get All support Staff name and email returned in asc order by name
// @access  Private
router.route("/support").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Staff Support");
  Staff.find({'roles.support': true}, { 'name':1, 'email':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, staff) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(staff);
      logger.info(id + " === Staff Support Returned");
    }
  });
});

// @route   GET api/staff/staffByID
// @desc    Get A Single Staff
// @access  Private
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

// @route   PUT api/staff/update/:id
// @desc    Update A Staff
// @access  Private
router.route("/update/:id").put(function(req, res) {
  let _id = req.params.id;
  let uid = uuid();
  Staff.findById(_id, function(err, staff) {
    if (!staff) {
      logger.info("Could not find staff with id " + _id);
      ``;
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
        staff.roles.pfxOperator = req.body.roles.pfxOperator;
        staff.roles.ffxOperator = req.body.roles.ffxOperator;
        logger.warn(uid + " Modifying staff to === " + staff);
      } catch (error) {
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

// @route   POST api/staff/create
// @desc    Create A New Staff
// @access  Private
router.route("/create/").post(function(req, res) {
  let uid = uuid();
  const staff = new Staff({
    name: req.body.name,
    email: req.body.email,
    roles: {
      auditor: req.body.roles.auditor,
      pfxOperator: req.body.roles.pfxOperator,
      ffxOperator: req.body.roles.ffxOperator,
      support: req.body.roles.support
    }
  });
  logger.info(uid + " Creating staff === " + staff);
  staff
    .save()
    .then(done => res.sendStatus(200))
    .catch(err => {
      logger.error(uid + " Error on create " + err);
      res.sendStatus(404);
    });
  logger.info(uid + " Staff Created");
});

// @route   Delete api/staff/delete/:id
// @desc    Delete A Staff
// @access  Private
router.delete("/delete/", (req, res) => {
  let uid = uuid();
  Staff.findById(req.headers.id)
    .then(staff => {
      logger.info(uid + " Deleting staff === " + staff._id);
      staff.remove().then(() => {
        logger.info(uid + " Deleting staff Complete");
        res.sendStatus(200);
      });
    })
    .catch(err => {
      logger.error(uid + " Error on delete " + err);
      res.sendStatus(404);
    });
});

module.exports = router;
