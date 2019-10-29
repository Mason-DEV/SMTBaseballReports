const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ffxAuditSchema = new Schema(
	{
		gamestring: {
			type: String,
			required: true
		},
		operator: {
			type: String,
			required: true
		},
		auditor: {
			type: String,
			required: true
		},
		logIn: {
			type: String,
			required: true
		},
		logOut: {
			type: String,
			required: true
		},
		numPitchesAdded: {
			type: String,
			required: false
		},
		commentsMisc: {
			type: String,
			required: false
		},
		commentsPlayer: {
			type: String,
			required: false
		},
		commentsBall: {
			type: String,
			required: false
		},
		numPicksAdded: {
			type: String,
			required: false
		},
		numBIPasPC: {
			type: String,
			required: false
		},
		numFBasPC: {
			type: String,
			required: false
		},
		missedPitchesVidGaps: {
			type: String,
			required: false
		},
		missedBIPVidGaps: {
			type: String,
			required: false
		},
		ffxPitches: {
			type: String,
			required: false
		},
		gdPitches: {
			type: String,
			required: false
		},
		readyShare: {
			type: String,
			required: false
		},
		stepAccuracy: {
			type: Boolean,
			required: false
		},
		stepCompletion: {
			type: Boolean,
			required: false
		},
		stepResolving: {
			type: Boolean,
			required: false
		},
		timeAccuracy: {
			type: String,
			required: false
		},
		timeCompletion: {
			type: String,
			required: false
		},
		timeResolving: {
			type: String,
			required: false
		}
	},
	{
		collection: "ffxAudit"
	}
);

module.exports = mongoose.model("ffxAudit", ffxAuditSchema);
