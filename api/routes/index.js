var express = require('express');
var router = express.Router();
const {jwt} = require('../middlewares/jwt');
const Product = require('../models/product/index');

router
  .get('/my-products', jwt, function (req, res, next) {
    Product
      .find({
        author: res.locals.user.id
      })
      .populate('author', '-password')
      .then((props) => {
        res
          .json(props)
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({
            message: `Internal Server Error`
          })
      })
  });


module.exports = router;
