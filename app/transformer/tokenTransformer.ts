import { transformedTokenFields } from '../../types/transformer'
import transformer, { getField } from './transformer'

export default async (data) => {
  return transformer(data, async (data) => {
    // return format
    return <transformedTokenFields>{
      tokenType: getField(data, 'tokenType').toLowerCase(),
      value: getField(data, 'value')
    }
  })
}
