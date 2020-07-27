import { pictureSource as pictureSourceInterface } from '../../../types/pictureSource'
import { transformedPictureFields } from '../../../types/transformer'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { ifDefined } = require('@popeindustries/lit-html-server/directives/if-defined.js')

const fallbackImage = (picture: transformedPictureFields, loading: 'eager' | 'lazy' = 'lazy') => html`
  <img width="${picture.image.fields.width}" height="${picture.image.fields.height}" src="${picture.image.fields.url}" alt="${picture.image.fields.title}" loading="${loading}"/>
`

const pictureSource = (source: pictureSourceInterface) => html`
  <source type="${source.type}" srcset="${source.srcset}" media="${ifDefined(source.media)}" sizes="${ifDefined(source.sizes)}">
`

type sourcesFunction = (picture: transformedPictureFields) => Array<pictureSourceInterface>;

export default (picture: transformedPictureFields, options: { loading?: 'eager' | 'lazy', sourcesFunction?: sourcesFunction } = {}) => {
  // transform sources from cms
  let sources = picture.sources.map(source => source.fields)
  // merge sources if image is not svg with sourcesFunction output
  if (picture.image.fields.contentType !== 'image/svg+xml' && typeof options.sourcesFunction === 'function') {
    sources = [...sources, ...options.sourcesFunction(picture)]
  }

  return html`
    <figure class="Picture Picture--${picture.style} ${picture.classes}">
        <picture>
          ${repeat(sources, source => pictureSource(source))}
          <!-- fallback img tag -->
          ${fallbackImage(picture, options.loading || 'lazy')}
        </picture>
      </figure>
      ${picture.description
        ? html`<div class="Annotation">
            ${unsafeHTML(picture.description)}
          </div>`
      : ''}
    `
}
