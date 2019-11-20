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
            // type: Object,
            // required: true,
            AnnouncementText:{
                type: String,
                required:false
            },
            hidden:{
                type: Boolean,
                required:false
            },
            Emails:{
                type: Array,
                required:false
            },
            Fields:{
                type: Object,
                required:false
            },
        }
	},
	{
        strict: false,
		collection: "settings"
	}
);

module.exports = mongoose.model("settings", settingsSchema);
