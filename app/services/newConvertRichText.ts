import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
const { renderToString } = require('@popeindustries/lit-html-server')
import boxedContentSection from '../templates/partials/boxedContent'

const { html } = require('@popeindustries/lit-html-server')


// html render functions for embeddedEntries
let embeddedEntriesFn = {}
embeddedEntriesFn['boxedContentSection'] = fields => boxedContentSection({items: fields.items['en-US']})
embeddedEntriesFn['section'] = fields => html`${fields.cmsTitle['en-US']}`
embeddedEntriesFn['collection'] = fields => html`${fields.cmsTitle['en-US']}`

const transformEmbeddedEntries = async node => {
  // render and await html
  try {
    let html = await renderToString(embeddedEntriesFn[node.data.target.sys.contentType.sys.id](node.data.target.fields))
    return {
      id: node.data.target.sys.id,
      html: html
    }
  } catch (e) {
    console.log("Error trying to convert",node.data.target.sys.contentType.sys.id);
  }
}

const convertBlocks = async (richText): Promise<any> => {

  return Promise.all(richText.content
    .filter(node => node.nodeType === 'embedded-entry-block')
    .map(node => transformEmbeddedEntries(node))
  )
}

export default async (richText) => {
  const embedded = await convertBlocks(richText)

  const rendered = documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return embedded.find((entry: any) => entry.id === node.data.target.sys.id).html
        } catch (e) {
          console.log('🚨 ERROR: ', node.data.target, e)
        }
      },
      [BLOCKS.HR]: () => '<div class="horizontal-rule"><hr></div>'
    }
  })

  return rendered

}
