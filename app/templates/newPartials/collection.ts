const { html } = require('@popeindustries/lit-html-server')
// const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
//
// import projectCollectionItem from './project_card'
// import linkItem from './link'
// const elements = {
//   project: projectCollectionItem,
//   link: linkItem
// }

export default (fields) => html`
${console.debug('COLLECTION: ', fields)}
${fields.variables.slug ? html`<a name="${fields.variables.slug}"></a>` : ''}
<div class="Collection Grid ${fields.classes || ''}">

</div>
`
// ${repeat(collection.items, (item) => elements[item.fields.type](item.fields))}
