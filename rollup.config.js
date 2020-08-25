import { terser } from 'rollup-plugin-terser' // uglify alternative
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
const glob = require('glob')

let plugins = {
  plugins: [
    replace({
      '$Fetch_Inject_Version': process.env.FETCHINJECTVERSION,
      '$googleFonts': 'Montserrat:700|Noto+Serif:400,400i,400b|Source+Sans+Pro:400,600|Source+Code+Pro:700&display=swap',
      delimiters: ['', '']
    }),
    nodeResolve({
      mainFields: ['module', 'jsnext:main'],
      browser: true,
      extensions: ['.js', '.json'],
      preferBuiltins: false
    }),
    typescript({
      target: 'ES6',
      typescript: require('typescript'), // use local version
      rootDir: './',
      module: 'es6',
      allowJs: true,
      declaration: false,
      removeComments: true,
      lib: [
        'dom',
        'es6',
        'es2016'
      ]
    }),
    terser()
  ]
}

// create config for each bundle
let configs = glob.sync('resources/js/*.ts').map(path => {
  return Object.assign({
    input: path,
    output: {
      format: 'iife',
      file: path.replace('resources', 'public').split('.')[0] + '.js',
      sourcemap: false
    } }, plugins)
})

export default configs
