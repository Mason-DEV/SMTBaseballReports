//PFXTech schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pfxTechSchema = new Schema(
	{
		venue: {
			type: String,
			required: true
		},
		operator: {
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
		hwswIssues: {
			type: String
		},
		t1Notes: {
			type: String
		},
		corrections: [Schema.Types.Mixed]
		
	},
	{
        strict: false,
		collection: "pfxTech"
	}
);

module.exports = mongoose.model("pfxTech", pfxTechSchema);
