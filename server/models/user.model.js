const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 8, maxlength: 64 },
  hash: { type: String, required: true },
  role: { type: String, required: true },
  created: { type: Date, required: true }
});

module.exports = mongoose.model('User', UserSchema);
