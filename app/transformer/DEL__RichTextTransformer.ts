// import codeBlock from '../templates/partials/code'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
const hljs = require('highlight.js')
// const PictureElementTransformer = require('./PictureElementTransformer')
let content = ''

const codeBlock = (code, language, fileOrPath) => `
<div class="Code__Element">
  <div class="Code__Element__file-or-path">${fileOrPath}</div>
  <pre><code class="language-${language}">${code}</code></pre>
</div>`

const pictureElement = item => {

  // item.image = new PictureElementTransformer(item.image['en-US']).first()

  return `
    <figure class="Picture__Element Picture__Element--${item.style} ${item.classes}" style="--aspect-ratio:${item.image.fields.details.image.width / item.image.fields.details.image.height}; ${item.backgroundColor !== null ? '--backgroundColor: ' + item.backgroundColor + ';' : ''}">
      <picture>
        ${item.image.fields.contentType !== 'image/svg+xml'
        ? `<source type="image/webp" srcset="${item.image.fields.url}?fm=webp">` : ''}
        <img src="${item.image.fields.url}" alt="${item.title}" loading="lazy"/>

      </picture>
    </figure>
    ${item.description
      ? `<div class="Annotation">
          <div class="Annotation__text">${item.description}</div>
        </div>`
    : ''}
  `
}

class RichTextTransformer {
  constructor (data) {
    content = this.transform(data)
  }

  transform (data) {
    return documentToHtmlString(data, {
      renderNode: {
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          return this[node.data.target.sys.contentType.sys.id](node.data.target.fields)
        }
      }
    })
  }

  first () {
    return content
  }

  code (item) {
    return codeBlock(
      hljs.highlight((item.language['en-US'] || 'bash'), item.code['en-US']).value,
      item.language['en-US'] || 'bash',
      item.fileOrPath['en-US']
    )
  }

  pictureElement (item) {
    return pictureElement(item)
  }
}

module.exports = RichTextTransformer
