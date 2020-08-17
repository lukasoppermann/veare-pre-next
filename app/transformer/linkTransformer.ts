import { transformedFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import pictureTransformer from './pictureTransformer'

export default async (data) => {
  return transformer(data, async (data) => {
    // return format
    return <transformedFields>{
      title: getField(data, 'title'),
      subtitle: getField(data, 'subtitle'),
      link: getField(data, 'link'),
      target: getField(data, 'targetBlank') ? '_blank' : '_self',
      rel: getField(data, 'targetBlank') ? 'noopener' : '',
      picture: (await pictureTransformer(getField(data, 'picture')))[0],
      classes: getField(data, 'cssClasses', []).join(' ')
    }
  })
}
