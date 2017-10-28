const deepAssign = require('deep-assign')
let modifiers = {
  h1: {
    class: 'o-headline--h2',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l',
    fn: (token) => { token.tag = 'h2' }
  },
  h2: {
    class: 'o-headline--h3',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l',
    fn: (token) => { token.tag = 'h3' }
  },
  h3: {
    class: 'o-headline--h4',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l',
    fn: (token) => { token.tag = 'h4' }
  },
  blockquote: {
    class: 'o-blockquote',
    columns: '16s 15m 14l',
    'start-column': '0s 2m 3l'
  },
  p: {
    class: 'o-paragraph',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l'
  },
  ul: {
    class: 'o-list type--xl',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l'
  },
  ol: {
    class: 'o-list o-list--ordered type--xl',
    columns: '16s 13m 10l',
    'start-column': '0s 4m 7l'
  },
  figure: {
    class: 'o-figure',
    columns: '16s'
  },
  figcaption: {
    class: 'o-figure__caption'
  },
  img: {
    class: 'o-figure__img'
  },
  code: {
    istype: 'fence',
    columns: '16s 16m 14l',
    'start-column': '0s 1m 4l',
    fn: (token) => {
      if (token.info === '') {
        token.info = 'bash'
      }
    }
  }
}

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
.use(require('markdown-it-implicit-figures'), {figcaption: true})
.use(require('markdown-it-expand-tabs'))
.use(require('markdown-it-attrs'))

md.renderer.rules.image = (tokens, idx, opts, _, slf) => '<div class="o-figure__image">' + slf.renderToken(tokens, idx, opts) + '</div>'

module.exports = (content, mods) => {
  modifiers = deepAssign(modifiers, mods)
  if (typeof content !== 'string') return content
  return md.render(content)
}
