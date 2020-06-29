const express = require('express')
const router = express();
const Product = require('../models/product/index');
const {jwt} = require('../middlewares/jwt');
const checkProducts = require('../middlewares/validator/checkProducts');
const images = require('../helpers/images/google');

router
  // /READ Product by slug
  .get('/:slug', function ({params}, res) {
    Product
      .findBySlug(params.slug)
      .populate('author', '-password')
      .then((prop) => {
        if (!prop) {
          res
            .status(204)
            .send()
        } else {
          res
            .json(prop)
        }
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
  // /PUT Update Product by id
  .put('/:id', jwt, images.multer.single('file'), checkProducts.update, images.sendUploadToGCS, function ({params, body}, res) {
    delete body['_id'];
    delete body['author'];
    Product
      .findOne({
        _id: params.id,
        author: res.locals.user.id
      })
      .then((product) => {
        if (!product) {
          throw new Product().invalidate('product', 'Not found', '');
        }
        delete body['author'];
        product.updated_at = new Date();
        Object.assign(product, body);
        return product.save();
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
            message: `Internal Server Error`
          })
      })
  })
  // /DELETE DELETE Product by id
  .delete('/:id', jwt, function ({params, body}, res,) {
    Product
      .findOne({
        _id: params.id,
        author: res.locals.user.id
      })
      .then((product) => {
        if (!product) {
          res
            .status(204)
            .send()
        }
        if (product.picture) {
          let filename = product.picture.split('/');
          filename = filename[filename.length - 1];
          images.deleteFileInGCS(filename)
        }
        return product.remove()
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
            message: `Internal Server Error`
          })
      })
  });

router
  // /GET List Product
  .get('/', function (req, res, next) {
    Product
      .find()
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
  })
  // /POST Create New Product
  .post('/', jwt, images.multer.single('file'), checkProducts.create, images.sendUploadToGCS, function (req, res, next) {
    const {body} = req;
    if (req.file && req.file.cloudStoragePublicUrl) {
      body['picture'] = req.file.cloudStoragePublicUrl;
    }
    body['author'] = res.locals.user.id;
    (new Product(body))
      .save((err, data) => {
        if (err) {
          console.error(err);
          res
            .status(422)
            .json(err)
        } else {
          res
            .status(201)
            .json(data)
        }
      })
  });

module.exports = router;
