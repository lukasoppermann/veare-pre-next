import { revisionedFiles } from './services/files'
const express = require('express')
const Fastify = require('fastify')
const fs = require('fs')
const app = express()

export const fastifyApp = async () => {
  const fastify = Fastify()

  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))

  await fastify.register(require('fastify-express'))
  // do you know we also have cors support?
  // https://github.com/fastify/fastify-cors
  fastify.use(require('./middleware'))

  if (process.env.NODE_ENV === 'development') {
    fastify.use(require('./middleware/dev.ts'))
  }

  fastify.use(require('./routes'))

  return fastify
}

export default async () => {
  // ---------------------------------- //
  // load files into revisioned files
  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))
  // disabled unneeded headers
  app.set('etag', false)
  app.set('x-powered-by', false)
  // works with caching
  app.set('view cache', false) // should be enabled by default if process.env.NODE_ENV === "production"
  // ---------------------------------- //
  // MIDDLEWARE
  app.use(require('./middleware'))
  // ---------------------------------- //
  // Dev Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(require('./middleware/dev.ts'))
  }
  // ---------------------------------- //
  // ROUTES
  app.use(require('./routes'))

  return app
}
