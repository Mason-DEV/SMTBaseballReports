const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AuditSchema = new Schema({
        gameID: {
            type: String,
            required: true
        },
        // operator: {
        //     type: String,
        //     required: true,
        //     default: "Test Operator"
        // },
        // auditor: {
        //     type: String,
        //     required: true,
        //     default: "Test Auditor"
        // },
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
        // numberPitchesAdded: {
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
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
        // numberPickoffs: {
        //     type: Number,
        //     required: false,
        //     default: 0
        // },
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