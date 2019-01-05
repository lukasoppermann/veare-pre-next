const uuidv4 = require('uuid/v4')

module.exports = (req, res, next) => {
  res.locals.nonce = uuidv4()
  next()
}
