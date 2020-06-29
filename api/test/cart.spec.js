require('./config/test');

const app = require('../app');

var auth = require('./dummy/auth');
const product = require('./dummy/product');
const {data, methods, success, fail} = require('./dummy/cart');
const { chai, chaihttp, expect, app, clearDB, mongoose } = require('../helpers/databasetest');
mongoose.set('useFindAndModify', false);

chai.use(require('chai-http'));

describe('routes Carts', function () {

  chai.use(chaihttp)
  before(function (done) { clearDB(done) });
  after(function (done) { clearDB(done) });

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
          .field(product.success.create)
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
            product.data.product = res.body;
            product.data.product.id = res.body._id;
            product.data.product.slug = res.body.slug;
            done()
          })
      });
    });

    describe('/POST /carts HEAD Authorization', function () {
      it('should create carts', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('Authorization', auth.data.seller.token)
          .send({
            transactions: [{
              "product": product.data.product.id,
              "picture": product.data.product.picture,
              "title": product.data.product.title,
              "price": product.data.product.price,
              "weight": product.data.product.weight,
              "condition": product.data.product.condition,
              "quantity": 5
            }]
          })
          .end(function (err, res) {
            console.log(err);
            expect(res).to.have.status(201);
            data.cart.id = res.body._id;
            done()
          })
      });
    });

    describe('/PATCH /carts/:id/add HEAD Authorization', function () {
      describe('/POST products HEAD Authorization', function () {
        it('should created product', function (done) {
          this.timeout(10000);

          chai
            .request(app)
            .post('/products')
            .set('Authorization', auth.data.seller.token)
            .field(product.success.create)
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
              product.data.product = res.body;
              product.data.product.id = res.body._id;
              product.data.product.slug = res.body.slug;
              done()
            })
        });
      });

      it('should add products to carts', function (done) {
        chai
          .request(app)
          .patch('/carts/' + data.cart.id + '/add')
          .set('Authorization', auth.data.seller.token)
          .send({
            transactions: [{
              "product": product.data.product.id,
              "picture": product.data.product.picture,
              "title": product.data.product.title,
              "price": product.data.product.price,
              "weight": product.data.product.weight,
              "condition": product.data.product.condition,
              "quantity": 6
            }]
          })
          .end(function (err, res) {
            console.log(err);
            expect(res).to.have.status(201);
            data.cart.id = res.body._id;
            done()
          })
      });

      it('should remove products from carts', function (done) {
        chai
          .request(app)
          .delete('/carts/' + data.cart.id + '/remove/' + product.data.product.id)
          .set('Authorization', auth.data.seller.token)
          .end(function (err, res) {
            console.log(err);
            expect(res).to.have.status(200);
            data.cart.id = res.body._id;
            done()
          })
      });

    });

    describe('/DELETE /carts/:id HEAD Authorization', function () {
      it('should delete carts', function (done) {
        chai
          .request(app)
          .delete('/carts/' + data.cart.id)
          .set('Authorization', auth.data.seller.token)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            done()
          })
      });
    });
  });

  describe('Fail', function () {
    describe('/DELETE /carts/:id HEAD Authorization', function () {
      it('should missing carts', function (done) {
        chai
          .request(app)
          .delete('/carts/' + data.cart.id)
          .set('Authorization', auth.data.seller.token)
          .end(function (err, res) {
            expect(res).to.have.status(204);
            done()
          })
      });
    });
  });
});