const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const Settings = require("../../models/Settings");

//Logger
const logger = require("../../config/logger");

// // @route   GET api/settings/
// // @desc    Get All Settings returned in asc order by name
// // @access  Public
router.route("/").get(function(req, res) {
  let id = uuid();
  logger.info(id + " === Requesting Settings");
  Settings.find({}).sort({}).exec(function(err, settings) { 
    if (err) {
      logger.error("Error on / " + err.stack);
    } else {
      res.json(settings);
      logger.info(id + " === Settings Returned");
    }
  });
});

// @route   GET api/settings/opAnnouncement
// @desc    Gets opAnnouncement Settings details
// @access  Public
router.route("/opAnnouncement").get(function(req, res) {
    let id = uuid();
    logger.info(id + " === Requesting Settings");
    Settings.findOne({'configType': "OPAnnouncement"}).sort({}).exec(function(err, settings) { 
      if (err) {
        logger.error("Error on / " + err.stack);
      } else {
        res.json(settings);
        logger.info(id + " === Settings Returned");
      }
    });
  });

// @route   PUT api/settings/update/:id
// @desc    Update An Announcement Settings
// @access  Public
router.route("/updateAnnouncement/:id").put(function(req, res) {
  let _id = req.params.id;
  let uid = uuid();
  Settings.findById(_id, function(err, settings) {
    if (!settings) {
      logger.info("Could not find settings with id " + _id);
      ``;
      res.status(404).send("Can not find this settings in the DB");
    } else if (err) {
      logger.warn("Could not find an settings" + err.stack);
      res.status(404).send("Can not find this settings in the DB");
    } else {
        try {
          logger.warn(uid + " Modifying settings from === " + settings);
          settings.details.hidden = req.body.details.hidden;
          settings.details.AnnouncementText = req.body.details.AnnouncementText;
          logger.warn(uid + " Modifying settings to === " + settings);
        } catch (error) {
          logger.error(uid + " Error on update " + error);
          res.status(404).send(error);
        }
      settings
        .save()
        .then(settings => {
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



// @route   GET api/settings/supportAnnouncement
// @desc    Gets supportAnnouncement Settings details
// @access  Public
router.route("/SupportAnnouncement").get(function(req, res) {
    let id = uuid();
    logger.info(id + " === Requesting Settings");
    Settings.findOne({'configType': "SupportAnnouncement"}).sort({}).exec(function(err, settings) { 
      if (err) {
        logger.error("Error on / " + err.stack);
      } else {
        res.json(settings);
        logger.info(id + " === Settings Returned");
      }
    });
  });

// @route   GET api/settings/pfxDailyEmail
// @desc    Gets pfxDailyEmail Settings details
// @access  Public
router.route("/pfxDailyEmail").get(function(req, res) {
    let id = uuid();
    logger.info(id + " === Requesting Settings");
    Settings.findOne({'configType': "PFxDailyEmail"}).sort({}).exec(function(err, settings) { 
      if (err) {
        logger.error("Error on / " + err.stack);
      } else {
        res.json(settings);
        logger.info(id + " === Settings Returned");
      }
    });
  });

// @route   PUT api/settings/updatePFxDaily/:id
// @desc    Update pfxDailyEmail Settings details
// @access  Public
router.route("/updatePFxDaily/:id").put(function(req, res) {
  let _id = req.params.id;
  let uid = uuid();
  Settings.findById(_id, function(err, settings) {
    if (!settings) {
      logger.info("Could not find settings with id " + _id);
      ``;
      res.status(404).send("Can not find this settings in the DB");
    } else if (err) {
      logger.warn("Could not find an settings" + err.stack);
      res.status(404).send("Can not find this settings in the DB");
    } else {
        try {
          logger.warn(uid + " Modifying settings from === " + settings);
          settings.details.Emails = req.body.details.Emails;
          settings.details.Fields = req.body.details.Fields;
          logger.warn(uid + " Modifying settings to === " + settings);
        } catch (error) {
          logger.error(uid + " Error on update " + error);
          res.status(404).send(error);
        }
      settings
        .save()
        .then(settings => {
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


// // @route   GET api/settings/fieldFx
// // @desc    Get All fieldFx Settings name and email returned in asc order by name
// // @access  Public
// router.route("/fieldFx").get(function(req, res) {
//   let id = uuid();
//   logger.info(id + " === Requesting Settings");
//   Settings.find({'fieldFx': true}, { 'name':1, '_id': 0}).sort({ name: 'asc' }).exec(function(err, settings) { 
//     if (err) {
//       logger.error("Error on / " + err.stack);
//     } else {
//       res.json(settings);
//       logger.info(id + " === Settings Returned");
//     }
//   });
// });

// // // @route   GET api/settings/settingsByID
// // // @desc    Get A Single Settings
// // // @access  Public
// router.route("/settingsByID").get(function(req, res) {
//   let _id = req.headers.id;
//   Settings.findById(_id, function(err, settings) {
//     if (!settings) {
//       logger.info("Could not find a Settings " + _id);
//       res.status(404).send("Can not find this Settings");
//     } else if (err) {
//       logger.error("settingsByID error " + err.stack);
//       res.status(404).send("Can not find this Settings");
//     } else {
//       logger.info("Sending settings " + settings._id);
//       res.status(200).send(settings);
//     }
//   });
// });

// // @route   PUT api/settings/update/:id
// // @desc    Update A Settings
// // @access  Public
// router.route("/update/:id").put(function(req, res) {
//   let _id = req.params.id;
//   let uid = uuid();
//   Settings.findById(_id, function(err, settings) {
//     if (!settings) {
//       logger.info("Could not find settings with id " + _id);
//       ``;
//       res.status(404).send("Can not find this settings in the DB");
//     } else if (err) {
//       logger.warn("Could not find an settings" + err.stack);
//       res.status(404).send("Can not find this settings in the DB");
//     } else {
//       try {
//         logger.warn(uid + " Modifying settings from === " + settings);
//         settings.name = req.body.name;
//         settings.fieldFx = req.body.fieldFx;
//         settings.pitchFx= req.body.pitchFx;
//         logger.warn(uid + " Modifying settings to === " + settings);
//       } catch (error) {
//         logger.error(uid + " Error on update " + error);
//         res.status(404).send(error);
//       }
//       settings
//         .save()
//         .then(settings => {
//           logger.warn(uid + " Modifying Complete");
//           res.sendStatus(200);
//         })
//         .catch(err => {
//           logger.error(uid + " Error on update " + err);
//           res.sendStatus(404);
//         });
//     }
//   });
// });

// // // @route   POST api/settings/create
// // // @desc    Create A New Settings
// // // @access  Public
// router.route("/create/").post(function(req, res) {
//   let uid = uuid();
//   const settings = new Settings({
//     name: req.body.name,
//     fieldFx: req.body.fieldFx,
//     pitchFx: req.body.pitchFx
//   });
//   logger.info(uid + " Creating settings === " + settings);
//   settings
//     .save()
//     .then(done => res.sendStatus(200))
//     .catch(err => {
//       logger.error(uid + " Error on create " + err);
//       res.sendStatus(404);
//     });
//   logger.info(uid + " Settings Created");
// });

// // // @route   Delete api/settings/delete/:id
// // // @desc    Delete A Settings
// // // @access  Public
// router.delete("/delete/", (req, res) => {
//   let uid = uuid();
//   Settings.findById(req.headers.id)
//     .then(settings => {
//       logger.info(uid + " Deleting settings === " + settings._id);
//       settings.remove().then(() => {
//         logger.info(uid + " Deleting settings Complete");
//         res.sendStatus(200);
//       });
//     })
//     .catch(err => {
//       logger.error(uid + " Error on delete " + err);
//       res.sendStatus(404);
//     });
// });

module.exports = router;
