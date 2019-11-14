import layout from '../layout'
import chapter from '../partials/chapter'
import collection from '../partials/collection'
import headerIntro from '../partials/header_intro'
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { html } = require('@popeindustries/lit-html-server')
const elements = {
  chapter: chapter,
  collection: collection
}

export default (page, partial) => {
  return layout(html`
    ${headerIntro}
    <main>
      ${repeat(page.chapters, (chapterData) => elements[chapterData.fields.type](chapterData.fields))}
    </main>
    <a name="contact"></a>
`, {}, partial)
}
// <page-section class="Projects">
//   <a name="portfolio"></a>
//   <div class="Grid Projects__intro">
//     <div class="Projects__headline">
//       Latest Projects
//     </div>
//     <div class="Projects__body">
//       When starting a project I first explore the problem space together with the client. The design than has the task to solve this problem irrespective of style and technology.
//     </div>
//   </div>
//   <div class="Projects__cards-container">
//   ${repeat(ProjectModel.all(), (project) => projectCard(project.fields))}
// </page-section>
