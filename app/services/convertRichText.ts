import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
const hljs = require('highlight.js')
const PictureElementTransformer = require('../transformer/PictureElementTransformer')

const codeBlock = item => {
  const language = item.fields.language['en-US'] || 'bash'

  return `
  <div class="Code__Element">
    <div class="Code__Element__file-or-path">${item.fields.fileOrPath['en-US']}</div>
    <pre><code class="language-${language}">${hljs.highlight(language, item.fields.code['en-US']).value}</code></pre>
  </div>`
}
//
const pictureElement = (item, loading = 'lazy') => {
  item = new PictureElementTransformer(item).first().fields
  return `
  <figure class="Picture__Element Picture__Element--${item.style} ${item.classes}" style="--aspect-ratio:${item.image.fields.details.image.width / item.image.fields.details.image.height}; ${item.backgroundColor !== null ? '--backgroundColor: ' + item.backgroundColor + ';' : ''}">
    <picture>
      ${item.sources.length > 0 ? item.sources.forEach(source => `<source media="${source.fields.mediaQuery}" type="image/webp" srcset="${source.fields.image.fields.url}?fm=webp">`) : ''}
      ${item.image.contentType !== 'image/svg+xml'
      ? `<source type="image/webp" srcset="${item.image.fields.url}?fm=webp">` : ''}
      <img src="${item.image.fields.url}" alt="${item.title}" loading="${loading}"/>
    </picture>
  </figure>
  ${item.description
    ? `<div class="Annotation">
        <div class="Annotation__text">${item.description}</div>
      </div>`
  : ''}
  `
}

const entryTypes = {
  code: codeBlock,
  pictureElement: pictureElement
}

module.exports = (richText) => {
  return documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return entryTypes[node.data.target.sys.contentType.sys.id](node.data.target)
        } catch (e) {
          console.error(e)
        }
      },
      [BLOCKS.HR]: () => '<div class="horizontal-rule"><hr></div>'
    }
  })
}
