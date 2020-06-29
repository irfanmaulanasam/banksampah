require('./config/test');

const app = require('../app');
const chai = require('chai');
const drop = require('../helpers/drop');
const {data, methods, success, fail} = require('./dummy/auth');

const {expect} = chai;

chai.use(require('chai-http'));

describe('routes Auth', function () {

  before(function () {
    drop.collection('user')
  });

  describe('Success', function () {
    methods.register(app, chai, {
      ...success.register,
      email: data.seller.email,
      username: data.seller.username,
      password: data.seller.password
    });
    methods.register(app, chai, {
      ...success.register,
      email: data.buyer.email,
      username: data.buyer.username,
      password: data.buyer.password
    });

    methods.login(app, chai, data.seller, (err, res, done) => {
      data.seller['id'] = res.body.id;
      data.seller['token'] = res.body.token;
      done();
    });
    methods.login(app, chai, data.buyer, (err, res, done) => {
      data.buyer['id'] = res.body.id;
      data.buyer['token'] = res.body.token;
      done();
    });
  });

  describe('Fail', function () {
    describe('/POST /auth/register', function () {
      it('should duplicate email/username register', function (done) {
        chai
          .request(app)
          .post('/auth/register')
          .send({
            first_name: `Seller`,
            last_name: `Seller`,
            email: data.seller.email,
            username: data.seller.username,
            password: data.seller.password
          })
          .end(function (err, res) {
            console.log(res.body);
            expect(res).have.status(422);
            expect(res).to.be.a('object');
            expect(res.body.message.errors).to.have.all.keys('email', 'username');
            done();
          })
      });
    });

    describe('/POST /auth/login', function () {
      it(`should post login fail and have message "Username/Email/Password Invalid"`, function (done) {
        chai
          .request(app)
          .post('/auth/login')
          .send({user: data.seller.username, password: data.seller.password + Math.random()})
          .end(function (err, res) {
            console.log(res.body);
            expect(res).have.status(400);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Username/Email/Password Invalid');
            done();
          })
      });

      it(`should post login fail and have message "User is required"`, function (done) {
        chai
          .request(app)
          .post('/auth/login')
          .send({password: data.seller.password})
          .end(function (err, res) {
            console.log(res.body);
            expect(res).have.status(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.errors).to.have.property('user');
            expect(res.body.message.errors.user.message).to.equal('User is required');
            done();
          })
      });

      it('should post login fail and have message "Password is required"', function (done) {
        chai
          .request(app)
          .post('/auth/login')
          .send({user: data.seller.username})
          .end(function (err, res) {
            console.log(res.body);
            expect(res).have.status(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.errors).to.have.property('password');
            expect(res.body.message.errors.password.message).to.equal('Password is required');
            done();
          })
      });
    });
  })
});
