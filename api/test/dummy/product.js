const faker = require('faker');

module.exports = {
  data: {
    product: {
      id: ``,
      slug: ``
    }
  },
  methods: {
    create(app, chai, payload, cb) {
      const {expect} = chai;
      it('should created product', function (done) {
        chai
          .request(app)
          .post('/products')
          .set('Authorization', payload.authorization)
          .send(payload.body)
          .end(function (err, res) {
            console.log(res.body);
            console.log('create', payload);
            expect(res).to.have.status(201);
            cb(err, res, done)
          })
      });
    }
  },
  success: {
    create: {
      title: faker.commerce.productName(),
      description: faker.name.jobDescriptor(),
      price: faker.random.number(),
      stock: faker.random.number(),
      weight: faker.random.number(),
      condition: 0,
      notes: faker.name.jobDescriptor()
    }
  },
  fail: {
    create: {
      title: faker.commerce.productName(),
      description: faker.name.jobDescriptor(),
      price: 0 - faker.random.number(),
      stock: 0 - faker.random.number(),
      weight: 0 - faker.random.number(),
      condition: 0,
      notes: faker.name.jobDescriptor()
    }
  }
};