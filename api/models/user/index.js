const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
  }
});

userSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('users', userSchema);
