//Settings schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
	{
		configType: {
			type: String,
			required: true
        },
		
		details: {
            type: Object,
            required: true
        }
	},
	{
        strict: false,
		collection: "settings"
	}
);

module.exports = mongoose.model("settings", settingsSchema);
