//Staff schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    roles: {
      operator: {
        type: Boolean,
        default: false
      },
      support: {
        type: Boolean,
        default: false
        
      },
      auditor: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    collection: "staff"
  }
);

module.exports = mongoose.model("staff", staffSchema);
