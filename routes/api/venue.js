const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const Venue = require("../../models/Venue");

//Logger
const logger = require("../../config/logger");

// // @route   GET api/venue/
// // @desc    Get All Venue returned in asc order by name
// // @access  Private
router.route("/").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Venue");
  Venue.find({}).sort({ name: 'asc' }).exec(function(err, venue) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(venue);
      logger.info(id + " === Venue Returned");
    }
  });
});

// @route   GET api/venue/pitchFx
// @desc    Get All pitchFx Venue name and email returned in asc order by name
// @access  Private
router.route("/pitchFx").get(function(req, res) {
    let id = uuid();
    logger.info(id + " === Requesting Venue");
    Venue.find({'pitchFx': true}, { 'name':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, venue) { 
      if (err) {
        logger.error("Error on / " + err.stack);
      } else {
        res.json(venue);
        logger.info(id + " === Venue Returned");
      }
    });
  });

// @route   GET api/venue/fieldFx
// @desc    Get All fieldFx Venue name and email returned in asc order by name
// @access  Private
router.route("/fieldFx").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Venue");
  Venue.find({'fieldFx': true}, { 'name':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, venue) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(venue);
      logger.info(id + " === Venue Returned");
    }
  });
});

// // @route   GET api/venue/venueByID
// // @desc    Get A Single Venue
// // @access  Private
router.route("/venueByID").get(function(req, res) {
  let _id = req.headers.id;
  Venue.findById(_id, function(err, venue) {
    if (!venue) {
      logger.info("Could not find a Venue " + _id);
      res.status(404).send("Can not find this Venue");
    } else if (err) {
      logger.error("venueByID error " + err.stack);
      res.status(404).send("Can not find this Venue");
    } else {
      logger.info("Sending venue " + venue._id);
      res.status(200).send(venue);
    }
  });
});

// @route   PUT api/venue/update/:id
// @desc    Update A Venue
// @access  Private
router.route("/update/:id").put(function(req, res) {
  let _id = req.params.id;
  let uid = uuid();
  Venue.findById(_id, function(err, venue) {
    if (!venue) {
      logger.info("Could not find venue with id " + _id);
      ``;
      res.status(404).send("Can not find this venue in the DB");
    } else if (err) {
      logger.warn("Could not find an venue" + err.stack);
      res.status(404).send("Can not find this venue in the DB");
    } else {
      try {
        logger.warn(uid + " Modifying venue from === " + venue);
        venue.name = req.body.name;
        venue.fieldFx = req.body.fieldFx;
        venue.pitchFx= req.body.pitchFx;
        logger.warn(uid + " Modifying venue to === " + venue);
      } catch (error) {
        logger.error(uid + " Error on update " + error);
        res.status(404).send(error);
      }
      venue
        .save()
        .then(venue => {
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

// // @route   POST api/venue/create
// // @desc    Create A New Venue
// // @access  Private
router.route("/create/").post(function(req, res) {
  let uid = uuid();
  const venue = new Venue({
    name: req.body.name,
    fieldFx: req.body.fieldFx,
    pitchFx: req.body.pitchFx
  });
  logger.info(uid + " Creating venue === " + venue);
  venue
    .save()
    .then(done => res.sendStatus(200))
    .catch(err => {
      logger.error(uid + " Error on create " + err);
      res.sendStatus(404);
    });
  logger.info(uid + " Venue Created");
});

// // @route   Delete api/venue/delete/:id
// // @desc    Delete A Venue
// // @access  Private
router.delete("/delete/", (req, res) => {
  let uid = uuid();
  Venue.findById(req.headers.id)
    .then(venue => {
      logger.info(uid + " Deleting venue === " + venue._id);
      venue.remove().then(() => {
        logger.info(uid + " Deleting venue Complete");
        res.sendStatus(200);
      });
    })
    .catch(err => {
      logger.error(uid + " Error on delete " + err);
      res.sendStatus(404);
    });
});

module.exports = router;
