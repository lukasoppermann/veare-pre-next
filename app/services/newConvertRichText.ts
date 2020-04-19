import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS } from '@contentful/rich-text-types'
const { renderToString } = require('@popeindustries/lit-html-server')
import boxedContentSection from '../templates/newPartials/boxedContent'
import boxedContentTransformer from '../transformer/BoxedContentTransformerModule'
import sectionTransformer from '../transformer/sectionTransformerModule'
import collectionTransformer from '../transformer/collectionTransformerModule'

const { html } = require('@popeindustries/lit-html-server')

let transformerFunctions = {
  'boxedContentSection': boxedContentTransformer,
  'section': sectionTransformer,
  'collection': collectionTransformer
}

// html render functions for embeddedEntries
let embeddedEntriesFn = {
  'boxedContentSection': boxedContentSection,
  'section': () => html`te`,
  'collection': () => html`test`
}

/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, embeddedEntriesFn: {[key: string]: Function}): Promise<Array<any>> => {
  // await conversion to resolive
  return Promise.all(
    // all nodes from richText
    richText.content
    // filter to only embedded-entry-block
    .filter(node => node.nodeType === 'embedded-entry-block')
    // trasform data and convert to HTML
    .map(async node => {
      // run transformer on data
      const transfomedData = await transformerFunctions[node.data.target.sys.contentType.sys.id](node.data.target)
      console.debug(transfomedData[0].fields);

      // return id & html
      return {
        // unique id of the node
        id: node.data.target.sys.id,
        // converted HTML
        html: await renderToString(embeddedEntriesFn[node.data.target.sys.contentType.sys.id](transfomedData[0].fields))
      }
    })
  )
}

/**
 * async convertRichText
 * @param  richText contentful
 * @return          [description]
 */
export default async (richText: richTextDocument) => {
  // get all converted embedded-entries
  const embedded = await convertEmbeddedEntries(richText, embeddedEntriesFn)
  // return richText as HTML
  return documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return embedded.find((entry: any) => entry.id === node.data.target.sys.id).html
        } catch (e) {
          console.error('🚨 ERROR: ', node.data.target, e)
        }
      },
      [BLOCKS.HR]: () => '<div class="horizontal-rule"><hr></div>'
    }
  })

}
