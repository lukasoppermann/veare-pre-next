import header_intro from './header_intro'
const { html } = require('@popeindustries/lit-html-server')

const placeholderContent = {
  homepage_header: header_intro
}

export default placeholder_key => {
  return html`${placeholderContent[placeholder_key]}`
}