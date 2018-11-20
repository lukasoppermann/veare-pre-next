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

module.exports = (content, mods = {}) => {
  const defaults = {
    h1: {
      class: 'o-headline--h2 c-article__headline',
      fn: (token) => { token.tag = 'h2' }
    },
    h2: {
      class: 'o-headline--h3 c-article__headline',
      fn: (token) => { token.tag = 'h3' }
    },
    h3: {
      class: 'o-headline--h4 c-article__headline',
      fn: (token) => { token.tag = 'h4' }
    },
    h4: {
      class: 'o-headline--h5 c-article__headline',
      fn: (token) => { token.tag = 'h5' }
    },
    blockquote: {
      class: 'o-blockquote c-article__blockquote'
    },
    p: {
      class: 'Paragraph-old Paragraph--xl c-article__paragraph'
    },
    ul: {
      class: 'o-list type--xl c-article__list'
    },
    ol: {
      class: 'o-list o-list--ordered type--xl c-article__list'
    },
    figure: {
      class: 'o-figure c-article__figure'
    },
    figcaption: {
      class: 'o-figure__caption'
    },
    img: {
      class: 'o-figure__img'
    },
    code: {
      istype: 'fence',
      fn: (token) => {
        if (token.info === '') {
          token.info = 'bash'
        }
      }
    }
  }
  modifiers = mergeOptions(mods.reset === true ? {} : defaults, mods)

  if (typeof content !== 'string') return content
  return md.render(content)
}
