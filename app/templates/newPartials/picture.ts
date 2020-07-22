import { pictureSource as pictureSourceInterface } from '../../../types/pictureSource'
import { transformedPicture } from '../../../types/transformer'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { ifDefined } = require('@popeindustries/lit-html-server/directives/if-defined.js')

export default (item, loading = 'lazy') => {
  return html`
  <figure class="Picture Picture--${item.style} ${item.classes}">
    <picture>
      ${item.sources[0].fields.contentType !== 'image/svg+xml'
      ? html`<source type="image/webp" srcset="${item.sources[0].fields.url}?fm=webp">` : ''}
      <!-- fallback img tag -->
      <img width="${item.sources[0].fields.details.image.width}" height="${item.sources[0].fields.details.image.height}" src="${item.sources[0].fields.url}" alt="${item.title}" loading="${loading}"/>
    </picture>
  </figure>
  ${item.description
    ? html`<div class="Annotation">
        ${unsafeHTML(item.description)}
      </div>`
  : ''}
`
}

const fallbackImage = (picture: transformedPicture, loading: 'eager' | 'lazy' = 'lazy') => html`
  <img width="${picture.fields.image.fields.width}" height="${picture.fields.image.fields.height}" src="${picture.fields.image.fields.url}" alt="${picture.fields.image.fields.title}" loading="${loading}"/>
`

const pictureSource = (source: pictureSourceInterface) => html`
  <source type="${source.type}" srcset="${source.srcset}" media="${ifDefined(source.media)}" sizes="${ifDefined(source.sizes)}">
`

export const newPicture = (picture: transformedPicture, loading?: 'eager' | 'lazy', sources: Array<pictureSourceInterface> = []) => {
  return html`
    <figure class="Picture Picture--${picture.fields.style} ${picture.fields.classes}">
        <picture>
          ${repeat(sources, source => pictureSource(source))}
          <!-- fallback img tag -->
          ${fallbackImage(picture, loading)}
        </picture>
      </figure>
      ${picture.fields.description
        ? html`<div class="Annotation">
            ${unsafeHTML(picture.fields.description)}
          </div>`
      : ''}
    `
}
