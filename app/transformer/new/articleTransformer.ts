import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'

import richText from '../../services/newConvertRichText'
const readingTime = require('reading-time')



// WIP °!°!°!°!°!°!°!°!°!°!




export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        // featuredImage: new PictureElementTransformer(this.getContent(data, 'featuredImage')).first(),
        rawdate: getField(data, 'date'),
        date: new Date(getField(data, 'date')).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }),
        preview: getField(data, 'preview'),
        content: content,
        readingTime: Math.ceil(readingTime(content).time / 60000),
        category: getField(data, 'category', 'design')
      }
    }
  })
}
// const convertRichText = require('../services/convertRichText')
// const Transformer = require('./Transformer')
// const PictureElementTransformer = require('./PictureElementTransformer')
// const readingTime = require('reading-time')

// const content = convertRichText(this.getContent(data, 'content'))
// // calc reading time
// const readTime = Math.ceil(readingTime(content).time / 60000)
// // return
// return {
//   id: data.sys.id,
//   createdAt: data.sys.createdAt,
//   updatedAt: data.sys.updatedAt,
//   fields: {
//     type: data.sys.contentType.sys.id,
//     slug: this.getContent(data, 'slug'),
//     title: this.getContent(data, 'title'),
//     featuredImage: new PictureElementTransformer(this.getContent(data, 'featuredImage')).first(),
//     rawdate: this.getContent(data, 'date'),
//     date: this.formatDate(this.getContent(data, 'date')),
//     preview: this.getContent(data, 'preview'),
//     content: content,
//     readingTime: readTime,
//     category: this.getContent(data, 'category', 'design')
//   }
