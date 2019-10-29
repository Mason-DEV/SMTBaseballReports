//FFXTech schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ffxTechSchema = new Schema(
	{
		venue: {
			type: String,
			required: true
		},
		operator: {
			type: String,
			required: true
		},
		support: {
			type: String,
			required: true
		},
		date: {
			type: Date,
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
		firstPitch: {
			type: String,
			required: true
		},
		gameID: {
            type: String,
            required: true
		},
		bitMode: {
            type: String,
            required: true
		},
		gameStatus: {
            type: String,
            required: true
		},
		ipCamIssues: {
			type: String,
			default: "None"
		},
		fgdIssues: {
			type: String,
			default: "None"
		},
		resolverIssues: {
			type: String,
			default: "None"
		},
		hardwareIssues: {
			type: String,
			default: "None"
		},
		miscNotes: {
			type: String,
			default: "None"
		},
		supportNotes: {
			type: String,
			default: "No Issues"
		},
		bisonSet: {
			type: String
		},
		backupTask: {
			type: String
		},
		backupNote: {
			type: String
		}
	},
	{
		strict: false,
		collection: "ffxTech"
	}
);

module.exports = mongoose.model("ffxTech", ffxTechSchema);
