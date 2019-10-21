const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const passport = require("passport");

//User Model
const Staff = require("../../models/Staff");

//Logger
const logger = require("../../config/logger");

// @route   GET api/staff/
// @desc    Get All Staff returned in asc order by name
// @access  Public
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

// @route   GET api/staff/staffByID
// @desc    Get A Single Staff
// @access  Public
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
// @access  Public
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
        staff.roles.operator = req.body.roles.operator;
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
// @access  Public
router.route("/create/").post(function(req, res) {
  let uid = uuid();
  const staff = new Staff({
    name: req.body.name,
    email: req.body.email,
    roles: {
      auditor: req.body.roles.auditor,
      operator: req.body.roles.operator,
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
// @access  Public
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
