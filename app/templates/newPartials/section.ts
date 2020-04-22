// Templates
// import boxedContentSection from './boxedContent'
// import textSection from './text'
// import code from './code'
// import pictureElement from './pictureElement'
const { html } = require('@popeindustries/lit-html-server')
// const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// const elements = {
//   boxedContentSection: boxedContentSection,
//   textSection: textSection,
//   code: code,
//   pictureElement: pictureElement
// }
// ${console.debug('SECTION: ',fields)}
export default (fields) => html`

  <div class="Section Grid ${fields.classes || ''}">
    
  </div>
`
// ${repeat(section.items, (item) => elements[item.fields.type](item.fields))}
