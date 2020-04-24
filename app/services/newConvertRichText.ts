import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS } from '@contentful/rich-text-types'
// templates
import block from '../templates/newPartials/block'
import boxedContentSection from '../templates/newPartials/boxedContent'
import section from '../templates/newPartials/section'
import collection from '../templates/newPartials/collection'
import pictureElement from '../templates/newPartials/pictureElement'
import code from '../templates/newPartials/code'
// Transformer
import blockTransformer from '../transformer/new/blockTransformer'
import boxedContentTransformer from '../transformer/new/boxedContentTransformer'
import sectionTransformer from '../transformer/new/sectionTransformer'
import collectionTransformer from '../transformer/new/collectionTransformer'
import pictureElementTransformer from '../transformer/new/pictureElementTransformer'
import codeTransformer from '../transformer/new/codeTransformer'

const { renderToString } = require('@popeindustries/lit-html-server')
// Transformer functions
const transformerFunctions = {
  block: blockTransformer,
  boxedContentSection: boxedContentTransformer,
  section: sectionTransformer,
  collection: collectionTransformer,
  code: codeTransformer,
  pictureElement: pictureElementTransformer
}

// templates functions for embeddedEntries
const templates = {
  block: block,
  boxedContentSection: boxedContentSection,
  section: section,
  collection: collection,
  code: code,
  pictureElement: pictureElement
}

/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, templates: {[key: string]: Function}): Promise<Array<any>> => {
  if (richText === null) {
    return []
  }
  // await conversion to resolive
  return Promise.all(
    // all nodes from richText
    richText.content
      // filter to only embedded-entry-block
      .filter(node => node.nodeType === 'embedded-entry-block')
      // trasform data and convert to HTML
      .map(async node => {
        // run transformer on data
        try {
          const transfomedData = await transformerFunctions[node.data.target.sys.contentType.sys.id](node.data.target)
          // return id & html
          return {
            // unique id of the node
            id: node.data.target.sys.id,
            // converted HTML
            html: await renderToString(templates[node.data.target.sys.contentType.sys.id](transfomedData[0].fields))
          }
        } catch (e) {
          console.error(`🚨 \x1b[31mError: Trying to convert and render of type "${node.data.target.sys.contentType.sys.id}"\x1b[0m`)
        }
      })
  )
}
/**
 * stringToAnchor
 * @param  string text string
 * @return          [description]
 */
const stringToAnchor = (string:any) => typeof string.value !== 'string' ? '' : string.value.toLowerCase().replace(/\s/g, '-').replace(/[^-A-Za-z0-9]/g, '')
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
      [BLOCKS.HR]: () => '<div class="horizontal-rule"><hr></div>',
      // [BLOCKS.PARAGRAPH]: (node, next) => await renderToString(html`<p>${unsafeHTML(next(node.content))}</p>`),
      [BLOCKS.HEADING_1]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h1>${next(node.content)}</h1>`,
      [BLOCKS.HEADING_2]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h2>${next(node.content)}</h2>`,
      [BLOCKS.HEADING_3]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h3>${next(node.content)}</h3>`,
      [BLOCKS.HEADING_4]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h4>${next(node.content)}</h4>`,
      [BLOCKS.HEADING_5]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h5>${next(node.content)}</h5>`,
      [BLOCKS.HEADING_6]: (node, next) => `<a class="link__anchor" name="heading-${stringToAnchor(node.content[0])}"></a><h6>${next(node.content)}</h6>`
    }
  })
}
