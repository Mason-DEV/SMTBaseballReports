//Staff schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
    name: String,
    email: String,
    roles: {
      operator: Boolean,
      support: Boolean,
      auditor: Boolean
    }
},
{
  collection: 'staff'
}
);


module.exports = mongoose.model('staff', staffSchema);