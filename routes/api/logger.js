const express = require('express');
const router = express.Router();

const logger = require('../../config/logger');


//API Logger, takes in logs from react and sends them to server
router.post ('/logger', function( req, res ) {
	let level = req.body.level;
	let message = req.body.message;
    logger.log(level, message, {source: "React"});
    return res.status(200).send('Logged');
  });

module.exports = router;