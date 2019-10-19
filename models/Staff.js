//Staff schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt-nodejs');
//const logger = require('../config/logger');

const staffSchema = new Schema({
    name: String,
    email: String,
    roles: {
      operator: Boolean,
      support: Boolean,
      auditor: Boolean
    }
});


module.exports = mongoose.model('staff', staffSchema);