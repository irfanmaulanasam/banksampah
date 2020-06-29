const faker = require('faker');

module.exports = {
  data: {
    seller: {
      username: `userseller`,
      password: `userseller`,
      email: `user@seller.com`
    },
    buyer: {
      username: `userbuyer`,
      password: `userbuyer`,
      email: `user@buyer.com`
    }
  },
  methods: {
    register(app, chai, payload) {
      const {expect} = chai;
      describe('/POST /auth/register', function () {
        it(`should create new user ${payload.username} and have token, email, username, fullname, id`, function (done) {
          chai
            .request(app)
            .post('/auth/register')
            .send(Object.assign(payload))
            .end(function (err, res) {
              console.log(res.body);
              expect(res).have.status(201);
              expect(res).to.be.a('object');
              expect(res.body).to.have.all.keys('id', 'username', 'email', 'fullname', 'token');
              expect(res.body).to.not.have.property('password');
              done();
            })
        });
      });
    },
    login(app, chai, payload, cb) {
      const {expect} = chai;
      describe('/POST /auth/login', function () {
        it(`should ${payload.username} login success and have token, email, username, fullname, id`, function (done) {
          chai
            .request(app)
            .post('/auth/login')
            .send({user: payload.username, password: payload.password})
            .end(function (err, res) {
              console.log(res.body);
              expect(res).have.status(200);
              expect(res.body).to.have.all.keys('id', 'username', 'email', 'fullname', 'token');
              cb(err, res, done);
            })
        });
      });
    }
  },
  success: {
    register: {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    },
  },
  fail: {}
};