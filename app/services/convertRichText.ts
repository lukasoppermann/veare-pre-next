import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS, INLINES } from '@contentful/rich-text-types'
// templates
import block from '../templates/newPartials/block'
import boxedContentSection from '../templates/newPartials/boxedContent'
import code from '../templates/newPartials/code'
import picture from '../templates/newPartials/picture'
import projectPreview from '../templates/newPartials/projectPreview'
import link from '../templates/newPartials/link'
// Transformer
import blockTransformer from '../transformer/blockTransformer'
import boxedContentTransformer from '../transformer/boxedContentTransformer'
import pictureTransformer from '../transformer/pictureTransformer'
import codeTransformer from '../transformer/codeTransformer'
import projectTransformer from '../transformer/projectTransformer'
import linkTransformer from '../transformer/linkTransformer'

const { renderToString } = require('@popeindustries/lit-html-server')

// Transformer functions
const transformerFunctions = {
  block: blockTransformer,
  boxedContentSection: boxedContentTransformer,
  project: projectTransformer,
  code: codeTransformer,
  picture: pictureTransformer,
  link: linkTransformer
}

// templates functions for embeddedEntries
const templates = {
  block: block,
  boxedContentSection: boxedContentSection,
  project: projectPreview,
  code: code,
  picture: picture,
  link: link
}
/**
 * convertHyperlinks
 * @param  node          richTextNode
 * @param  next
 * @return                   [description]
 */
const convertHyperlinks = (node, next, anchors) => {
  // split uri
  const uri = node.data.uri.split('#')
  // test if link is anchor
  if (uri[0] === 'name=') {
    const name = uri[1].toLowerCase().replace(/\s/g, '-').replace(/[^&-A-Za-z0-9]/g, '')
    // store anchor in data store
    anchors.push(name)
    // return anchor link with name tag
    return `<a name="${name}">${next(node.content)}</a>`
  }
  // return normal link
  return `<a href="${node.data.uri}">${next(node.content)}</a>`
}
/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, templates: {[key: string]: Function}, transformerFunctions: {[key: string]: Function}): Promise<Array<any>> => {
  // return if richText is empty
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
          console.error(`🚨 \x1b[31mError: Trying to convert and render embedded entry of type "${node.data.target.sys.contentType.sys.id}"\x1b[0m \n Error: ${e}`)
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
  const embedded = await convertEmbeddedEntries(richText, templates, transformerFunctions)
  // reset anchor variable
  const anchors: Array<String> = []
  // convert richText as HTML
  const html: String = documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return embedded.find((entry: any) => entry.id === node.data.target.sys.id).html
        } catch (e) {
          console.error('🚨 ERROR: ', node.data.target, e)
        }
      },
      [BLOCKS.HR]: () => '<div class="Rule--horizontal"><hr></div>',
      [INLINES.HYPERLINK]: (node, next) => convertHyperlinks(node, next, anchors)
    }
  })
  // return data object
  return {
    html: html,
    anchors: anchors
  }
}

export const __testing = {
  convertHyperlinks: convertHyperlinks,
  convertEmbeddedEntries: convertEmbeddedEntries
}
