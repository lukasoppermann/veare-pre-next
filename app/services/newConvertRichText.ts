import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS } from '@contentful/rich-text-types'
// templates
import boxedContentSection from '../templates/newPartials/boxedContent'
import section from '../templates/newPartials/section'
import collection from '../templates/newPartials/collection'
// Transformer
import boxedContentTransformer from '../transformer/new/boxedContentTransformer'
import sectionTransformer from '../transformer/new/sectionTransformer'
import collectionTransformer from '../transformer/new/collectionTransformer'

const { renderToString } = require('@popeindustries/lit-html-server')
// Transformer functions
const transformerFunctions = {
  boxedContentSection: boxedContentTransformer,
  section: sectionTransformer,
  collection: collectionTransformer
}

// templates functions for embeddedEntries
const templates = {
  boxedContentSection: boxedContentSection,
  section: section,
  collection: collection
}

/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, templates: {[key: string]: Function}): Promise<Array<any>> => {
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
        // return id & html
        return {
          // unique id of the node
          id: node.data.target.sys.id,
          // converted HTML
          html: await renderToString(templates[node.data.target.sys.contentType.sys.id](transfomedData[0].fields))
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
  const embedded = await convertEmbeddedEntries(richText, templates)
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
