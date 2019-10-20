const express = require('express');
const router = express.Router();

//User Model
const User = require('../../models/User');

//Logger
const logger = require('../../config/logger');

//User API for Registering a new user
//This is not accessesable from the APP
router.route('/register').post(function (req, res) {
    var new_user = new User({
        username: req.body.username,
    });
    new_user.password = new_user.generateHash(req.body.password);
    new_user.save().then(new_user => {
            logger.info("Registering new User " +JSON.stringify(new_user.username));
            res.sendStatus(200).send();
        })
        .catch(err => {
            logger.error("Registering error " +err.stack);
            res.status(400).send(err);
        });
});

//User API for taking in a user id then the returning an userObject 
router.route('/userByID').get(function (req, res) {
    let _id = req.headers.user;
    User.findById(_id, function(err, user) {
            if (!user){
                logger.info("Could not find a User " +_id)
                res.status(404).send("Can not find this User");
            }
            else if(err){
                logger.error("userByID error " +err.stack);
                res.status(404).send("Can not find this User");
            }
            else{ //Just returning username until more fields are added
                logger.info("Sending user " +user.username);
                res.status(200).send({"username": user.username});
            }})
    });
  
module.exports = router;