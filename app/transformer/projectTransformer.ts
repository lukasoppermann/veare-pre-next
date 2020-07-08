import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import pictureTransformer from './pictureTransformer'
import richText from '../services/convertRichText'
// calc duration in month
const duration = (startDate, endDate) => {
  // get difference
  const difference = +new Date(endDate) - +new Date(startDate)
  // get duration
  const weeks = Math.floor(difference / 1000 / 60 / 60 / 24 / 7)
  let month = Math.floor(difference / 1000 / 60 / 60 / 24 / 30)
  let years = 0
  // check if more than a year
  if (month > 12) {
    years = Math.floor(month / 12)
    month = month - (years * 12)
  }
  // return duration
  return {
    totalWeeks: weeks,
    years: years,
    month: month
  }
}

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      contentType: data.sys.contentType.sys.id,
      fields: {
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        durationStart: getField(data, 'durationStart'),
        durationEnd: getField(data, 'durationEnd'),
        duration: duration(getField(data, 'durationStart'), getField(data, 'durationEnd')),
        years: {
          start: +new Date(getField(data, 'durationStart')).getFullYear(),
          end: +new Date(getField(data, 'durationEnd')).getFullYear()
        },
        client: getField(data, 'client'),
        approach: (await richText(getField(data, 'approach'))).html,
        responsibilities: getField(data, 'responsibilities', []),
        team: getField(data, 'team', []),
        roleAndTeam: (await richText(getField(data, 'roleAndTeam'))).html,
        header: (await pictureTransformer(getField(data, 'header')))[0],
        previewImage: (await assetTransformer(getField(data, 'previewImage')))[0],
        content: content.html,
        anchors: content.anchors
      }
    }
  })
}
