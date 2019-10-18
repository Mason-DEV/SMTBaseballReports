// My user schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
//const logger = require('../config/logger');

const userSchema = new Schema({
  username: String,
  password: String
});

// hash the password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
     return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('user', userSchema);