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

        pitchesAdd: {
            type: String,
            required: false,
            default: "0"
        },
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
        }
    },
    {
        collection: 'audits'
    }

);

module.exports = mongoose.model('audit', AuditSchema);