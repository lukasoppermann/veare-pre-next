'use strict'

const express = require('express')
const routes = require('./app/routes')
// Constants
const PORT = 8080
// App
const app = express()

app.use('/', routes)

app.listen(PORT)
console.log('Running on http://localhost:' + PORT)
