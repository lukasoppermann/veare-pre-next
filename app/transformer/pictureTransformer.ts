import { transformedFields, transformedAsset, transformedPictureSource } from '../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import pictureSourceTransformer from './pictureSourceTransformer'
import richText from '../services/convertRichText'

const styles = {
  'Centered (default)': 'center',
  Wide: 'wide',
  'Full width': 'full-width'
}

export default async (data) => {
  return transformer(data, async (data) => {
    // return format
    return <transformedFields>{
      title: getField(data, 'title'),
      description: (await richText(getField(data, 'description'))).html,
      image: <transformedAsset>(await assetTransformer(getField(data, 'image')))[0],
      sources: <transformedPictureSource[]>(await pictureSourceTransformer(getField(data, 'sources'))),
      style: styles[getField(data, 'style')] || Object.values(styles)[0],
      classes: getField(data, 'classes', []).join(' ')
    }
  })
}
