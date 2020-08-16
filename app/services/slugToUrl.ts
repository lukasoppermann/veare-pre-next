import config from '../config/appConfig'

export default (slug: string, contentType: string, leadingSlash = true): string => {
  if (config.content_url_prefixes[contentType] !== undefined) {
    return `${leadingSlash === true ? '/' : ''}${config.content_url_prefixes[contentType]}/${slug}`
  }
  throw new Error(`🚨 \x1b[31mError converting slug, undefined prefix requested: "${contentType}"\x1b[0m`)
}
