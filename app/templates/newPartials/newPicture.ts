import { pictureSource as pictureSourceInterface } from '../../../types/pictureSource'
import { transformedPicture } from '../../../types/transformer'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { ifDefined } = require('@popeindustries/lit-html-server/directives/if-defined.js')

// const pictureSources = (sources, title, loading = 'lazy', pictureSources: any[]|undefined = undefined) => {
//   const sourceTags: string[] = []
//   // remove first element from array
//   const fallback = `<img width="${sources[0].fields.details.image.width}" height="${sources[0].fields.details.image.height}" src="${sources[0].fields.url}" alt="${title}" loading="${loading}"/>`
//   // add item sources to array
//   sources.slice(1).forEach(source => {
//     sourceTags.push(`<source type="${source.fields.contentType}" srcset="${source.fields.url}" ${source.fields.media !== undefined ? `media="${source.fields.media}"` : ''}>`)
//   })
//   // add default sources
//   if (pictureSources !== undefined) {
//     pictureSources.forEach(pictureSource => {
//       const srcset = pictureSource.srcsetSizes.map(size => pictureSource.url + '&w=' + size + ' ' + size + 'w').join(', ')
//       sourceTags.push(`<source type="${pictureSource.type}" srcset="${srcset}" sizes="${pictureSource.sizes}">`)
//     })
//   }
//   // add fallback
//   sourceTags.push(fallback)
//   // return
//   return sourceTags.join('\n')
// }

const fallbackImage = (picture: transformedPicture, loading: 'eager' | 'lazy' = 'lazy') => html`
  <img width="${picture.fields.sources[0].fields.width}" height="${picture.fields.sources[0].fields.height}" src="${picture.fields.sources[0].fields.url}" alt="${picture.fields.sources[0].fields.title}" loading="${loading}"/>
`

const pictureSource = (source: pictureSourceInterface) => html`
  <source type="${source.type}" srcset="${source.srcset}" media="${ifDefined(source.media)}" sizes="${ifDefined(source.sizes)}">
`

const pictureElement = (picture: transformedPicture, loading?: 'eager' | 'lazy', sources?: Array<pictureSourceInterface>) => html`
  <picture>
    ${repeat(sources, source => pictureSource(source))}
    ${fallbackImage(picture, loading)}
  </picture>
`
// export default (img: pictureImg, sources?: Array<pictureSourceInterface>, options?: {classes?: string, description?: string}): pictureInterface => {
export default (picture: transformedPicture, loading?: 'eager' | 'lazy', sources?: Array<pictureSourceInterface>) => {
  return html`
  <figure class="Picture ${picture.fields.style ? 'Picture--' + picture.fields.style : ''} ${picture.fields.classes || ''}">
    ${pictureElement(picture, loading, sources)}
  </figure>
  ${picture.fields.description && picture.fields.description.length > 0
    ? html`<div class="Annotation">
        ${unsafeHTML(picture.fields.description)}
      </div>`
  : ''}
`
}

// export default (item, loading = 'lazy', picSources: any[]|undefined = undefined) => {
//   return html`
//   <figure class="Picture Picture--${item.style} ${item.classes}">
//     <picture>
//       ${unsafeHTML(pictureSources(item.sources, item.title, loading, picSources))}
//     </picture>
//   </figure>
//   ${item.description
//     ? html`<div class="Annotation">
//         ${unsafeHTML(item.description)}
//       </div>`
//   : ''}
// `
// }
