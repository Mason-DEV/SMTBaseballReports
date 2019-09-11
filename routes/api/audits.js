const express = require('express');
const router = express.Router();

//Audit Model
const Audit = require('../../models/Audit');

// @route   GET api/audits
// @desc    Get all audits
// @access  Public
router.get('/', (req, res) => {
    Audit.find()
        .sort({date: -1})
        .then(items => res.json(items))
});

// @route   POST api/audits
// @desc    Create An Audit
// @access  Public
router.post('/', (req, res) => {
    const newAudit = new Audit({
        gameID: req.body.gameID
    });

    newAudit.save().then(audit => res.json(audit));
});

// // @route   Delete api/items/:id
// // @desc    Delete A Item
// // @access  Public
// router.delete('/:id', (req, res) => {
//     Item.findById(req.params.id)
//         .then(item => item.remove().then(() => res.json({success: true})))
//         .catch(err => res.status(404).json({success: false}));
// })

module.exports = router;