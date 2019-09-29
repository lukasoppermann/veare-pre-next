import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import code from './richTextEntryTypes/code'
const entryTypes = {
  code: code
}
const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      return entryTypes[node.data.target.sys.contentType.sys.id](node)
    }
  }
}

export default (richText, _options) => {
  return documentToHtmlString(richText, { ...options, ..._options })
}
