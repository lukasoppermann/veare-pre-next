const deepAssign = require('deep-assign')
let modifiers = {
  h1: {
    class: 'o-headline o-headline--h2',
    fn: (token) => { token.tag = 'h2' }
  },
  h2: {
    class: 'o-headline o-headline--h3',
    fn: (token) => { token.tag = 'h3' }
  },
  h3: {
    class: 'o-headline o-headline--h4',
    fn: (token) => { token.tag = 'h4' }
  },
  blockquote: {
    class: 'o-blockquote'
  },
  p: {
    class: 'o-paragraph'
  },
  ul: {
    class: 'o-list'
  },
  ol: {
    class: 'o-list o-list--ordered'
  },
  figure: {
    class: 'o-figure'
  },
  figcaption: {
    class: 'o-figure__caption'
  },
  img: {
    class: 'o-figure__img'
  }
}

const md = require('markdown-it')('commonmark', {
  html: true,
  typographer: true,
  modifyToken: (token, env) => {
    let modifier = modifiers[token.tag]
    if (modifier !== undefined) {
      if (modifier.class !== undefined) {
        token.attrObj.class = (token.attrObj.class || '') + ' ' + modifier.class
        token.attrObj.class = token.attrObj.class.trim()
      }
      if (modifier.fn !== undefined) {
        modifier.fn(token, env)
      }
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
