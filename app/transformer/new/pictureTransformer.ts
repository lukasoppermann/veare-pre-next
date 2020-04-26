import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import richText from '../../services/newConvertRichText'


const styles = {
  'Centered (default)': 'center',
  'Wide': 'wide',
  'Full width': 'full-width'
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
        title: getField(data, 'title'),
        description: (await richText(getField(data, 'description'))).html,
        sources: await assetTransformer(getField(data, 'sources')),
        style: styles[getField(data, 'style')] || Object.values(styles)[0],
        classes: getField(data, 'classes', []).join(' '),
      }
    }
  })
}
