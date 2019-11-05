import boxedContentSection from './boxedContent'
import textSection from './text'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const elements = {
  boxedContentSection: boxedContentSection,
  textSection: textSection
}

export default (section) => html`
  ${console.log(section)}
  <div class="Section Grid ${section.classes || ''}">
    ${repeat(section.items, (item) => elements[item.fields.type](item.fields))}
  </div>
`
