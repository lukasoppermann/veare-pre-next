import boxedContentSection from './boxedContent'
import textSection from './text'
import code from './code'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const elements = {
  boxedContentSection: boxedContentSection,
  textSection: textSection,
  code: code
}

export default (section) => html`
  ${console.log(section)}
  <div class="Section Grid ${section.classes || ''}">
    ${repeat(section.items, (item) => elements[item.fields.type](item.fields))}
  </div>
`
