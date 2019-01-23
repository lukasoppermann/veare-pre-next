const fs = require('fs')
const expressHandlebars = require('express-handlebars')
const SVGO = require('svgo')
const deasync = require('deasync')

const svgo = new SVGO({
  plugins: [
    { removeDesc: { removeAny: true } },
    { removeTitle: {} }, // pass it an argument to enable
    'removeComments', // does enable default plugins. (using { full: true } )
    'removeMetadata',
    { removeViewBox: false },
    { cleanupIDs: { remove: false, minify: false } }
  ]
})

module.exports = expressHandlebars.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: './resources/templates/partials/layouts',
  partialsDir: './resources/templates/partials',
  compilerOptions: {
    preventIndent: true
  },
  helpers: {
    log: (value) => {
      console.log(value)
    },
    url_safe: function (url) {
      url = url.replace(/[`:]/g, '').replace(/[\W_]+/g, '-')
      return escape(url)
    },
    join: function () {
      let args = Array.from(Object.values(arguments)).slice(0, -1)
      return args.join('')
    },
    eq: (...params) => {
      return params[0] === params[1]
    },
    gt: (...params) => {
      return params[0] > params[1]
    },
    or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
    },
    ifDefined: (value, returnValue, defaultValue) => {
      if (value) {
        return returnValue
      }
      return typeof defaultValue === 'string' ? defaultValue : ''
    },
    in_array: function (element, array) {
      return array.indexOf(element) > -1
    },
    conditional: (param, test, value, defaultValue) => {
      if (param === test) {
        return value
      }
      return defaultValue
    },
    year: function () {
      return new Date().getFullYear()
    },
    inline_js: function (path) {
      path = `public/` + path
      let js = fs.readFileSync(path, 'utf8')
      return `<script>${js}</script>`
    },
    inline_css: (path) => {
      path = path.substring(0, 1) !== '/' ? `public/${path}` : path.substring(1)
      let css = fs.readFileSync(path, 'utf8')
      return `<style>${css}</style>`
    },
    inline_svg: function (path, options) {
      // optimizing fn
      function svgoOptimizeSync (svgo, path) {
        let res = null
        let svg = fs.readFileSync(path, 'utf8')
        svgo.optimize(svg, { path: path }).then(result => { res = result })
        deasync.loopWhile(() => !res)
        return res.data
      }
      // prep attributes
      let attrs = Object.keys(options.hash || {}).map(function (key) {
        return key + '="' + options.hash[key] + '"'
      }).join(' ')

      return svgoOptimizeSync(svgo, path).replace(/<svg/g, `<svg ${attrs}`)
    }
  }
})
