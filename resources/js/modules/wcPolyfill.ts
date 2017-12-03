// test if browser supports 100% of web component specs
export default () => {
  return 'registerElement' in document &&
  typeof document.createElement('div').attachShadow === 'function' &&
  'content' in document.createElement('template')
}
