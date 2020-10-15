import config from '../config/appConfig'

export default (slug: string, contentType: 'article' | 'project' | 'page', leadingSlash = true): string => {
  if (config.content_url_prefixes[contentType] !== undefined) {
    // replace // with / otherwise when there is no prefix you end uop with //
    return `${leadingSlash === true ? '/' : ''}${config.content_url_prefixes[contentType]}/${slug}`.replace('//', '/')
  }
  throw new Error(`🚨 \x1b[31mError converting slug, undefined prefix requested: "${contentType}"\x1b[0m`)
}
