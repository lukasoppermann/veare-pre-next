import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import code from '../templates/partials/richTextEntryTypes/code'
import picture from '../templates/partials/richTextEntryTypes/picture'
const entryTypes = {
  code: code,
  pictureElement: picture
}
const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      return entryTypes[node.data.target.sys.contentType.sys.id](node)
    }
  }
}

export default (richText, _options?) => {
  return documentToHtmlString(richText, { ...options, ..._options })
}
