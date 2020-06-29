const router = require('express').Router();
const Cart = require('../models/cart/index');
const {jwt} = require('../middlewares/jwt');

router
  .patch('/:id/quantity/:product/min', jwt, function ({params, body}, res) {
    Cart
      .findOne({
        buyer: res.locals.user.id,
        _id: params.id,
        status: 0,
      })
      .then(async (cart) => {
        if ((cart.quantity - 1) > 0) {
          cart.quantity -= 1;
        }
        res
          .json(await cart.save());
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: `Internal Server Error`
          })
      })
  })
  .patch('/:id/quantity/:product/plus', jwt, function ({params, body}, res) {
    Cart
      .findOne({
        buyer: res.locals.user.id,
        _id: params.id,
        status: 0,
      })
      .populate('product')
      .then(async (cart) => {
        if ((cart.quantity + 1) <= cart.product.stock) {
          cart.quantity += 1;
        }
        res
          .json(await cart.save());
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: `Internal Server Error`
          })
      })
  })
  .delete('/:id', jwt, function ({params}, res) {
    Cart
      .findOne({
        buyer: res.locals.user.id,
        _id: params.id
      })
      .then(async (cart) => {
        if (!cart) {
          res
            .status(204)
            .send();
        } else {
          res
            .json(await cart.remove());
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({
            message: `Internal Server Error`
          })
      })
  });

router
  .get('/', jwt, function (req, res) {
    Cart
      .find({
        buyer: res.locals.user.id,
        status: 0,
      })
      .populate({
        path: 'product',
        select: 'stock author',
        populate: {
          path: 'author',
          select: 'first_name last_name',
        }
      })
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
  })
  .post('/', jwt, function ({body}, res) {
    delete body['status'];
    body['buyer'] = res.locals.user.id;
    Cart
      .findOne({
        buyer: res.locals.user.id,
        status: 0,
        product: body.product
      })
      .then((cart) => {
        if (!cart) {
          return (new Cart(body)).save();
        } else {
          cart.quantity += body.quantity;
          return cart.save();
        }
      })
      .then((prop) => {
        res
          .json(prop)
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  });

module.exports = router;
