const jwt = require('../helpers/jwt');

module.exports = {jwt:function (req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
      try {
        let decode = jwt.verify(token.replace('Bearer ', ''));
        if (decode && decode.id) {
          res.locals.user = {
            id: decode.id
          };
          return next()
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      res
        .status(403)
        .json({
          message: "Unauthorized"
        })
    }
  }
}