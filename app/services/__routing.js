let env = process.env.NODE_ENV
const PORT = process.env.NODE_PORT || 8080

module.exports = (app) => {
  return (response) => {
    // ---------------------------------- //
    // MIDDLEWARE
    app.use(require('../middleware'))
    // ---------------------------------- //
    // ROUTES
    app.use(require('../routes'))
    // open port
    app.listen(PORT)
    if (env !== 'testing') {
      console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
    }
  }
}
