import { transformedPictureSourceFields, transformedAsset } from '../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'

export default async (data) => {
  return transformer(data, async (data) => {
    const images = <transformedAsset[]>(await assetTransformer(getField(data, 'images')))

    // return format
    return <transformedPictureSourceFields>{
      media: <string>getField(data, 'media'),
      sizes: <string>getField(data, 'sizes'),
      fileType: images[0].fields.fileType,
      srcset: images.map(image => image.fields.url + ' ' + require('path').parse(image.fields.fileName).name.split('@')[1]).join(', ')
    }
  })
}
