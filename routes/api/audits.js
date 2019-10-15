const express = require('express');
const router = express.Router();

//Audit Model
const Audit = require('../../models/Audit');


//Test new way to get
// Defined get data(index or listing) route
router.route('/').get(function (req, res) {
    Audit.find(function(err, audit){
    if(err){
      console.log(err);
    }
    else {
      res.json(audit);
    }
  });
});


//  Defined update route
router.route('/update/:id').put(function (req, res) {
    let _id = req.params.id;
    console.log(_id);
    Audit.findById(_id, function(err, audit) {
        if (!audit)
            res.status(404).send("Can not find this Audit in the DB");
        else
    
            audit.gamestring = req.body.gamestring;
            audit.auditor = req.body.auditor;
            audit.operator = req.body.operator;
            audit.ffxPitches = req.body.ffxPitches;
            audit.gdPitches = req.body.gdPitches;
            audit.missedPitches = req.body.missedPitches;
            audit.missedBIP = req.body.missedBIP;
            audit.pitchesAdd = req.body.pitchesAdd;
            audit.pickAdd = req.body.pickAdd;
            audit.save().then(audit => {
                res.sendStatus(200).send(req.body.pickAdd);
                res.json(req.body.pickAdd);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
        })
});



// // @route   GET api/audits
// // @desc    Get all audits
// // @access  Public
// router.get('/', (req, res) => {
//     Audit.find()
//         //.sort({date: -1})
//         .then(items => res.json(items))

// });

// @route   POST api/audits
// @desc    Create An Audit
// @access  Public
// router.route('/', (req, res) => {
//     const newAudit = new Audit({
//        // gameID: req.body.gameID
//     });

//     newAudit.save().then(audit => res.json(audit));
// });

// @route   PUT api/audits
// @desc    Update An Audit Data
// @access  Public
// router.put('/:id', (req, res) => {
//     let _id = req.params.id;
//     Audit.findById(_id, function(err, audit) {
//         if (!audit)
//             res.status(404).send("Can not find this Audit in the DB");
//         else
//             audit.gamestring = req.body.gamestring;
//             audit.auditor = req.body.auditor;
//             audit.operator = req.body.operator;
//             audit.ffxPitches = req.body.ffxPitches;
//             audit.gdPitches = req.body.gdPitches;
//             audit.missedPitches = req.body.missedPitches;
//             audit.missedBIP = req.body.missedBIP;
//             audit.pitchesAdd = req.body.pitchesAdd;
//             audit.pickAdd = req.body.pickAdd;
//             audit.save().then(audit => {
//                 res.json('Audit updated!');
//             })
//             .catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//     });
      
// });


// // // @route   Delete api/items/:id
// // // @desc    Delete A Item
// // // @access  Public
// // router.delete('/:id', (req, res) => {
// //     Item.findById(req.params.id)
// //         .then(item => item.remove().then(() => res.json({success: true})))
// //         .catch(err => res.status(404).json({success: false}));
// // })

module.exports = router;