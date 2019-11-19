const fs = require('fs')
const expressHandlebars = require('express-handlebars')
// const SVGO = require('svgo')
//
// const svgo = new SVGO({
//   plugins: [
//     { removeDesc: true },
//     { removeTitle: true }, // pass it an argument to enable
//     { removeComments: true }, // does enable default plugins. (using { full: true } )
//     { removeMetadata: true },
//     { removeViewBox: false },
//     { cleanupIDs: { remove: false, minify: false } }
//   ]
// })

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
      const args = Array.from(Object.values(arguments)).slice(0, -1)
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
      if (path === undefined) {
        console.log('ERROR: No path provided to inline_css function')
        return
      }
      path = `public/${path}`
      const js = fs.readFileSync(path, 'utf8')
      return `<script>${js}</script>`
    },
    inline_css: (path) => {
      if (path === undefined) {
        console.log('ERROR: No path provided to inline_css function')
        return
      }
      path = path.substring(0, 1) !== '/' ? `public/${path}` : path.substring(1)
      const css = fs.readFileSync(path, 'utf8')
      return `<style>${css}</style>`
    },
    inline_svg: (path, options) => {
      // optimizing fn
      // const svgoOptimizeSync = async (svgo, path) => {
      //   const svg = fs.readFileSync(path, 'utf8')
      //   return svgo.optimize(svg, { path: path }).then(result => result.data)
      // }
      const svg = fs.readFileSync(path, 'utf8')
      // prep attributes
      const attrs = Object.keys(options.hash || {}).map(function (key) {
        return key + '="' + options.hash[key] + '"'
      }).join(' ')
      // const optimizedSvg = await svgoOptimizeSync(svgo, path).replace(/<svg/g, `<svg ${attrs}`)
      // return optimizedSvg
      return svg.replace(/<svg/g, `<svg ${attrs}`)
    }
  }
})
