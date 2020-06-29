const {error} = require('../../helpers/msg');

module.exports = {
  create: (req, res, next) => {
    let img = req.file && req.file.originalname ? req.file.originalname : '';
    req.checkBody('file', `Invalid Input`).isImage(img);

    req.checkBody('title', error.isRequired('Title')).notEmpty();

    req.checkBody('price', error.isRequired('Price')).notEmpty();
    if (req.body && req.body.price) {
      req
        .checkBody('price', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('stock', error.isRequired('Stock')).notEmpty();
    if (req.body && req.body.stock) {
      req
        .checkBody('stock', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('weight', error.isRequired('Weight')).notEmpty();
    if (req.body && req.body.weight) {
      req
        .checkBody('weight', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('condition', error.isRequired('Condition')).notEmpty();
    if (req.body && req.body.condition) {
      req
        .checkBody('condition', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
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
  update: (req, res, next) => {
    req.checkBody('title', error.isRequired('Title')).notEmpty();

    req.checkBody('price', error.isRequired('Price')).notEmpty();
    if (req.body && req.body.price) {
      req
        .checkBody('price', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('stock', error.isRequired('Stock')).notEmpty();
    if (req.body && req.body.stock) {
      req
        .checkBody('stock', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('weight', error.isRequired('Weight')).notEmpty();
    if (req.body && req.body.weight) {
      req
        .checkBody('weight', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
    }

    req.checkBody('condition', error.isRequired('Condition')).notEmpty();
    if (req.body && req.body.condition) {
      req
        .checkBody('condition', `Invalid Input`)
        .isDecimal()
        .numberMustEqualGreaterZero()
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
};