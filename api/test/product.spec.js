require('./config/test');

const app = require('../app');
const chai = require('chai');
const fs = require('fs');

const drop = require('../helpers/drop');
var auth = require('./dummy/auth');
const {data, methods, success, fail} = require('./dummy/product');

const {expect} = chai;

chai.use(require('chai-http'));

describe('routes Products', function () {

  before(function () {
    drop.collection('product')
  });

  describe('Success', function () {
    auth
      .methods
      .login(app, chai, auth.data.seller, (err, res, done) => {
        auth.data.seller['id'] = res.body.id;
        auth.data.seller['token'] = res.body.token;
        done();
      });

    describe('/POST products HEAD Authorization', function () {
      it('should created product', function (done) {
        this.timeout(10000);

        chai
          .request(app)
          .post('/products')
          .set('Authorization', auth.data.seller.token)
          .field(success.create)
          .attach('file', __dirname + '/dummy/images/dummy.png')
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.have.all.keys(
              'picture',
              'slug',
              'description',
              'weight',
              'condition',
              'notes',
              'created_at',
              'updated_at',
              '_id',
              'title',
              'price',
              'stock',
              'author',
              '__v',
            );

            data.product.id = res.body._id;
            data.product.slug = res.body.slug;
            done()
          })
      });
    });

    describe('/GET products', function () {
      it('should list product', function (done) {
        chai
          .request(app)
          .get('/products')
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(200);
            done()
          })
      });
    });

    describe('/GET products/:slug', function () {
      it('should read product with slug ', function (done) {
        chai
          .request(app)
          .get('/products/' + data.product.slug)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys(
              'picture',
              'slug',
              'description',
              'weight',
              'condition',
              'notes',
              'created_at',
              'updated_at',
              '_id',
              'title',
              'price',
              'stock',
              'author',
              '__v',
            );
            done();
          })
      });
    });

    describe('/PUT products/:id HEAD Authorization', function () {
      it('should update product with id ', function (done) {
        chai
          .request(app)
          .put('/products/' + data.product.id)
          .set('Authorization', auth.data.seller.token)
          .send({title: success.create.title + ' Update'})
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(200);
            done()
          })
      });
    });

    describe('/DELETE products/:id HEAD Authorization', function () {
      it('should delete product with id', function (done) {
        chai
          .request(app)
          .delete('/products/' + data.product.id)
          .set('Authorization', auth.data.seller.token)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(200);
            done()
          })
      });
    });
  });

  describe('Fail', function () {

    describe('/POST products', function () {
      it('should created product fail', function (done) {
        chai
          .request(app)
          .post('/products')
          .set('Authorization', auth.data.seller.token)
          .send(fail.create)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.have.property('errors');
            expect(res.body.message.errors).to.have.all.keys('file', 'price', 'stock', 'weight');

            expect(res.body.message.errors.file).to.have.property('message');
            expect(res.body.message.errors.file.message).to.equal('Invalid Input');

            expect(res.body.message.errors.price).to.have.property('message');
            expect(res.body.message.errors.price.message).to.equal('Invalid Input');

            expect(res.body.message.errors.stock).to.have.property('message');
            expect(res.body.message.errors.stock.message).to.equal('Invalid Input');

            expect(res.body.message.errors.weight).to.have.property('message');
            expect(res.body.message.errors.weight.message).to.equal('Invalid Input');
            done()
          })
      });

      it('should create product unauthorized', function (done) {
        chai
          .request(app)
          .post('/products')
          .send(success.create)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Unauthorized');
            done();
          })
      });
    });

    describe('/PUT products/:id', function () {
      it('should update product unauthorized', function (done) {
        chai
          .request(app)
          .put('/products/' + data.product.id)
          .send(success.create)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Unauthorized');
            done();
          })
      });
    });

    describe('/GET products/:slug', function () {
      it('should missing product with slug', function (done) {
        chai
          .request(app)
          .get('/products/' + data.product.slug)
          .end(function (err, res) {
            console.log(res.body);
            expect(res).to.have.status(204);
            done();
          })
      });
    });
  });
});