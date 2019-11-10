import boxedContent from './boxedContent'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (projectInfo) => {
  console.log('projectInfo: ', projectInfo)
  return html`
  ${boxedContent(projectInfo)}
  <!-- {{!-- Intro text --}} -->
  <div class="Text__Element Project__challenge">
    ${unsafeHTML(projectInfo.challenge)}
  </div>
`
}

//
// <!-- {{!-- TOC --}} -->
// <ul class="Toc Project__toc" data-toc>
// {{#each @root.project.chapters}}
//   {{#if fields.slug}}
//     <li class="Toc__chapter"><a class="Toc__chapter__link" href="#{{fields.slug}}"><div class="Toc__chapter__title">{{fields.title}}</div></a></li>
//   {{/if}}
// {{/each}}
// </ul>

// <!-- {{!-- Section Indicator --}} -->
// <div class="Project__pagination-container">
//   <ul class="Pagination Project__pagination" data-toc>
//   {{#each @root.project.chapters}}
//     <li class="Pagination__item"><a class="Pagination__item__link" href="#{{fields.slug}}"><div class="Pagination__item__title">{{fields.title}}</div></a></li>
//   {{/each}}
//   </ul>
// </div>
