const syntaxHighlight = require('../services/syntaxHighlight')
const md = require('markdown-it')('commonmark', {
  html: true,
  typographer: true,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    return `<pre class="language-${lang}"><div class="code">` + syntaxHighlight(str, lang) + `</div></pre>`
  }
})
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-implicit-figures'), { figcaption: true })
  .use(require('markdown-it-expand-tabs'))
  .use(require('markdown-it-attrs'))

md.renderer.rules.image = (tokens, idx, opts, _, slf) => '<div class="o-figure__image">' + slf.renderToken(tokens, idx, opts) + '</div>'
md.renderer.rules.hr = (tokens, idx, opts, _, slf) => '<div class="horizontal-rule">' + slf.renderToken(tokens, idx, opts) + '</div>'

module.exports = (content, mods = {}) => {
  if (typeof content !== 'string') return content
  return md.render(content)
}
