const mergeOptions = require('merge-options')
let modifiers
const md = require('markdown-it')('commonmark', {
  html: true,
  typographer: true,
  quotes: '“”‘’',
  modifyToken: (token, env) => {
    let modifier = modifiers[token.tag]
    if (modifier !== undefined && (modifier.istype === undefined || modifier.istype === token.type)) {
      Object.keys(modifier).forEach((key) => {
        if (key === 'istype') {
          // ignore
        } else if (key === 'fn') {
          modifier.fn(token, env)
        } else {
          token.attrObj[key] = ((token.attrObj[key] || '') + ' ' + modifier[key]).trim()
        }
      })
    }
  }
})
  .use(require('markdown-it-modify-token'))
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-implicit-figures'), { figcaption: true })
  .use(require('markdown-it-expand-tabs'))
  .use(require('markdown-it-attrs'))

md.renderer.rules.image = (tokens, idx, opts, _, slf) => '<div class="o-figure__image">' + slf.renderToken(tokens, idx, opts) + '</div>'
md.renderer.rules.hr = (tokens, idx, opts, _, slf) => '<div class="horizontal-rule">' + slf.renderToken(tokens, idx, opts) + '</div>'

module.exports = (content, mods = {}) => {
  modifiers = mergeOptions({}, mods)

  if (typeof content !== 'string') return content
  return md.render(content)
}
