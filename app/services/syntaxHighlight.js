const Prism = require('prismjs')
const Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace')
const loadLanguages = require('prismjs/components/index')
loadLanguages(['yaml', 'php', 'markdown', 'bash', 'nginx', 'git', 'json'])
const normalizer = new Normalizer({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  'tabs-to-spaces': 2
})

module.exports = (code, language = 'javascript') => {
  code = normalizer.normalize(code)
  return Prism.highlight(code, Prism.languages[language], language)
}
