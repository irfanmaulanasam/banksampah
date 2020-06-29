if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(process.env.DATABASE_URL);
require('mongoose')
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then((prop) => {
    console.log(`${process.env.DATABASE_URL} => ${prop.connection.name} connected, port ${prop.connection.port}.`)
  })
  .catch((err) => {
    console.error(err)
});

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

app
.use(require('cors')())
.use(logger('dev'))
.use(express.json())
.use(express.urlencoded({extended: true}))
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))
.use(require('./middlewares/customValidator'));

app
.use('/auth', require('./routes/auth'))
.use('/products', require('./routes/products'))
.use('/carts', require('./routes/carts'))
.use('/', require('./routes/index'));

module.exports = app;
