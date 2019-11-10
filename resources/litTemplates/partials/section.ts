import boxedContentSection from './boxedContent'
import textSection from './text'
import code from './code'
import projectInfo from './projectInfo'
import pictureElement from './pictureElement'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const elements = {
  boxedContentSection: boxedContentSection,
  textSection: textSection,
  code: code,
  projectInfo: projectInfo,
  pictureElement: pictureElement
}

export default (section) => html`
  <div class="Section Grid ${section.classes || ''}">
    ${repeat(section.items, (item) => elements[item.fields.type](item.fields))}
  </div>
`
