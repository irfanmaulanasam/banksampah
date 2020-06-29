const {error} = require('../../helpers/msg');

module.exports = {
  register: (req, res, next) => {
    req.checkBody('first_name', error.isRequired('First name')).notEmpty();
    req.checkBody('last_name', error.isRequired('Last name')).notEmpty();

    req.checkBody('email', error.isRequired('Email')).notEmpty();
    if (req.body && req.body.email) {
      req
        .checkBody('email', `Email must have 6 - 30 character`)
        .len(6, 30);
      req
        .checkBody('email', `Email is not valid`)
        .isEmail();

      req
        .checkBody('email', `Email has already exist`)
        .emailIsAvailable();
    }

    req.checkBody('username', error.isRequired('Username')).notEmpty();
    if (req.body && req.body.username) {
      req
        .checkBody('username', `Username must have 6 - 30 character`)
        .len(6, 30);

      req
        .checkBody('username', `Username has already exist`)
        .usernameIsAvailable();
    }

    req.checkBody('password', error.isRequired('Password')).notEmpty();
    if (req.body && req.body.password) {
      req
        .checkBody('password', `Password must have 6 - 50 character`)
        .len(6, 50);
    }
    req
      .asyncValidationErrors()
      .then(next)
      .catch((err) => {
        res
          .status(422)
          .json(error.parser(err))
      })
  },
  login: (req, res, next) => {
    req.checkBody('user', error.isRequired('User')).notEmpty();
    req.checkBody('password', error.isRequired('Password')).notEmpty();
    req
      .asyncValidationErrors()
      .then(next)
      .catch((err) => {
        res
          .status(422)
          .json(error.parser(err))
      })
  }
};