import layout from '../layout'
import convertRichText from '../../../app/services/convertRichText'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// define special article styling options
const options = {

}
export default (article) => layout(html`
  ${article.fields.title}
  ${unsafeHTML(convertRichText(article.fields.content, options))}
`, {
  bodyClass: 'Page-Type__Article',
  head: html`
  <link type="text/css" href="/css/article.css" rel="stylesheet" />
  `
})
