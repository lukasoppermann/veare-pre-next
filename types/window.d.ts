declare interface Window {
  app: {
    baseUrl: string,
    files?: {
      js: {},
      css: {}
    }
    fetchInject: (...args: any[]) => Promise<any>,
    html?: (template: string) => string,
    render?: (template: string, node: Node) => void,
    unsafeHTML?: (HtmlString: string) => string,
    webComponentsSupported?: () => boolean,
    locals: any
  }
}
