const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AuditSchema = new Schema({
        gamestring: {
            type: String,
            required: true
        },
        operator: {
            type: String,
            required: true,
            default: "Test Operator"
        },
        auditor: {
            type: String,
            required: true,
            default: "Test Auditor"
        },
        // beginningStatus: {
        //     type: String,
        //     required: false
        // },
        // loginTime:{
        //     type: Date,
        //     required: false,
        // },
        // logoutTime:{
        //     type: Date,
        //     required: false,
        // },
        pitchesAdd: {
            type: String,
            required: false,
            default: "0"
        },
        // numberBIPasPitchCatch: {
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
        // numberFBasPitchCatch: {
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
        pickAdd: {
            type: String,
            required: false,
            default: "0"
        },
        missedPitches: {
            type: String,
            required: false,
            default: "0"
        },
        missedBIP: {
            type: String,
            required: false,
            default: "0"
        },
        ffxPitches: {
            type: String,
            required: false,
            default: "0"
        },
        gdPitches: {
            type: String,
            required: false,
            default: "0"
        },
        // timeResolving:{
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
        // timeCompletion:{
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
        // timeAccuracy:{
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
});

module.exports = Audit = mongoose.model('audit', AuditSchema);