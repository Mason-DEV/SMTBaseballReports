const uuid = require("uuid");
const express = require("express");
const router = express.Router();

//User Model
const PFxTech = require("../../models/PFxTech");

//Logger
const logger = require("../../config/logger");

// @route   GET api/pfxTech/
// @desc    Get All Staff returned in asc order by name
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

// @route   GET api/staff/staffByID
// @desc    Get A Single Staff
// @access  Public


// @route   PUT api/staff/update/:id
// @desc    Update A Staff
// @access  Public

// @route   POST api/staff/create
// @desc    Create A New Staff
// @access  Public


// @route   Delete api/staff/delete/:id
// @desc    Delete A Staff
// @access  Public


module.exports = router;
