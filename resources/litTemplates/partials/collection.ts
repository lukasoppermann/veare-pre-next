import projectCollectionItem from './project_card'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const elements = {
  project: projectCollectionItem
}

export default (collection) => html`
${collection.variables.slug ? html`<a name="${collection.variables.slug}"></a>` : ''}
<div class="Collection Grid ${collection.classes || ''}">
  ${repeat(collection.items, (item) => elements[item.fields.type](item.fields))}
</div>
`
