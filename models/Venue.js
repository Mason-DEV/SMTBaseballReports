//Venue schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema(
	{
		name: {
			type: String,
			required: true
        },
		fieldFx: {
			type: Boolean,
			default: false
		},
		pitchFx: {
			type: Boolean,
			default: false
		}
	},
	{
		collection: "venue"
	}
);

module.exports = mongoose.model("venue", venueSchema);
