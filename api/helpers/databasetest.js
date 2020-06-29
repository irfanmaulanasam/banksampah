const chai = require('chai'),
    test = process.env.NODE_ENV
    mongoose = require('mongoose'),
    should = chai.should(),
    chaihttp = require('chai-http'),
    app = require('../app')

module.exports = {
    chai, chaihttp, should, app, mongoose,
    clearDB(done) {
        mongoose.connect(`mongodb://localhost:27017/${test}`, { useNewUrlParser: true }, function () {
            mongoose.connection.db.dropDatabase();
            done();
        })
    },
    collection(name){
      var db = new Db('test', new Server('localhost', 27017));
      console.log(typeof(db))
      // Establish connection to db
      db.open(function(err, db) {
        assert.equal(null, err);

        // Execute ping against the server
        db.command({ping:1}, function(err, result) {
          assert.equal(null, err);
        
            // Drop the collection from this world
            db.dropCollection(name, function(err, result) {
              assert.equal(null, err);

              // Verify that the collection is gone
              db.collectionNames(name, function(err, names) {
                assert.equal(0, names.length);

                db.close();
              });
            });
        });
      });
    }
}