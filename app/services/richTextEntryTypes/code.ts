import hljs = require('highlight.js')

export default (node) =>
`<div class="Code__Element">
  <div class="Code__Element__file-or-path">${node.data.target.fields.fileOrPath['en-US'] || ''}</div>
  <pre><code class="language-${node.data.target.fields.language['en-US'] || 'bash'}">${hljs.highlight((node.data.target.fields.language['en-US'] || 'bash'), node.data.target.fields.code['en-US']).value}</code></pre>
</div>`
