const JSON5 = require('json5')
/**
 * jsonParse
 * @param  json          json string
 * @return               parses a json string if it is valid
 */
export default (json: string) => {
  // break out if variable is empty
  if (typeof json === 'undefined' || json === null || json.trim() === '') {
    return null
  }
  // try parsing and return error otherwise
  try {
    return JSON5.parse(json)
  } catch (e) {
    throw new Error(`🚨 \x1b[31mError: Parsing json failed for string: \x1b[0m"${json}"`)
  }
}
