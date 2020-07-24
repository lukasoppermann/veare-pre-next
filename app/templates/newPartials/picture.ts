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

export default (picture: transformedPictureFields, loading?: 'eager' | 'lazy', sources: Array<pictureSourceInterface> = []) => {
  return html`
    <figure class="Picture Picture--${picture.style} ${picture.classes}">
        <picture>
          ${repeat([...picture.sources.map(source => source.fields), ...sources], source => pictureSource(source))}
          <!-- fallback img tag -->
          ${fallbackImage(picture, loading)}
        </picture>
      </figure>
      ${picture.description
        ? html`<div class="Annotation">
            ${unsafeHTML(picture.description)}
          </div>`
      : ''}
    `
}
