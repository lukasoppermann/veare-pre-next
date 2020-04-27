// templates
import projectPreviewTemplate from './projectPreview'
import linkTemplate from './link'
// import linkItem from './link'
// utlities
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

const elements = {
  project: projectPreviewTemplate,
  link: linkTemplate
}

export default (fields) => html`

${fields.variables.slug ? html`<a name="${fields.variables.slug}"></a>` : ''}
<div class="Collection Grid ${fields.classes || ''}">
  ${repeat(fields.items, (item) => {
    return elements[item.fields.type](item.fields)
  })}
</div>
`
// ${repeat(collection.items, (item) => elements[item.fields.type](item.fields))}
