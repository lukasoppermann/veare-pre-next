import progressive from '../templates/pages/progressive'
// import homepage from '../templates/pages/homepage'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = {
  progressive: async (_req, res) => res.send(await renderToString(progressive()))//,
  // index: async (req, res) => {
  //   // get slug
  //   const slug = 'home'// req.url.replace(/^\/|\/$/g, '')
  //   // get content
  //   const content = await PageTransformer(cache.get('page'))
  //   // get this page
  //   const pageContent = content.find((item: any) => item.fields['slug'] === slug).fields
  //   //
  //   return res.send(await renderToString(homepage(pageContent, req.query.partial)))
  // }
}
