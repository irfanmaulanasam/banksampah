const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'safnfi!@$!#%@$%12';

module.exports = {
  sign: function (payload) {
    return jwt.sign(payload, secret)
  },
  verify: function (payload) {
    return jwt.verify(payload, secret)
  }
};