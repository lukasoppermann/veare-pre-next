import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import pictureElementTransformer from './pictureElementTransformer'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: getField(data, 'title'),
        subtitle: getField(data, 'subtitle'),
        link: getField(data, 'link'),
        target: getField(data, 'targetBlank') ? '_blank' : '_self',
        picture: (await pictureElementTransformer(getField(data, 'picture')))[0],
        classes: getField(data, 'cssClasses', []).join(' ')
      }
    }
  })
}
