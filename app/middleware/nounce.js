// const uuidv4 = require('uuid/v4')

module.exports = (req, res, next) => {
  // export nonce somehow
  // res.locals.nonce = uuidv4()
  next()
}
