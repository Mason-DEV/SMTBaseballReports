const express = require('express');
const router = express.Router();

//User Model
const User = require('../../models/User');


//  API for registering a user
// This API is exposed, but currently not registering users
// The usernames are hard coded, there is no current need to add new users
router.route('/register').post(function (req, res) {
    var new_user = new User({
        username: req.body.username,
    });
    new_user.password = new_user.generateHash(req.body.password);
    // console.log(new_user);
    //     new_user.save().then(new_user => {
    //         res.sendStatus(200).send();
    //         // res.json(req.body.pickAdd);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(400).send(err);
    //     });
});

//API for taking in a user id then the returning an userObject 

router.route('/userByID').get(function (req, res) {
    let _id = req.headers.user;
    User.findById(_id, function(err, user) {
            if (!user){
                res.status(404).send("Can not find this User in the DB");
            }
            else
            //Just returning username until more fields are added
            res.status(200).send({"username": user.username});

            })
    });
    //Mongo call for user OBject based on _ID


   
    // console.log(new_user);
    //     new_user.save().then(new_user => {
    //         res.sendStatus(200).send();
    //         // res.json(req.body.pickAdd);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(400).send(err);
    //     });


//API for logging in a user
// 
// router.post('/login', function(req, res) {
//     var user_name = req.body.username;
//     User.findOne({username: user_name}, function(err, user) {
//         if (!user.validPassword(req.body.password)) {
//             console.log("didnt match");
//             //password did not match
//         } else {
//             console.log("did match");
//             //password matched. proceed forward
//         }
//   });
// });



module.exports = router;