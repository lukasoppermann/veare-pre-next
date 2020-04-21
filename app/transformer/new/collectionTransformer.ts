import { transformedDataInterface } from '../../../types/transformer'
import { default as transformer, getField } from './transformer'
// Transformer
import articleTransformer from './articleTransformer'
import linkTransformer from './linkTransformer'
import projectTransformer from './projectTransformer'

const transformers: {[key: string]: any} = {
  article: articleTransformer,
  link: linkTransformer,
  project: projectTransformer
}

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        classes: getField(data, 'classes', []).join(' '),
        items: await Promise.all(getField(data, 'items').map(async item => (await transformers[item.sys.contentType.sys.id](item))[0])),
        variables: getField(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  })
}

// project: require('./ProjectPreviewTransformer'),
// article: require('./ArticleTransformer'),
// link: require('./LinkTransformer')

// items: this.getContent(data, 'items').map(item => {
//   return new Transformers[item.sys.contentType.sys.id](item).first()
// }),
// classes: (this.getContent(data, 'classes') || []).join(' '),
// variables: this.getContent(data, 'variables', []).reduce(
//   (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
// )
