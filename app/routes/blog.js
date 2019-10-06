const ArticleModel = require('../models/Article')()

module.exports = (req, res) => {
  // list all articles
  if (req.params[0] === undefined) {
    return res.render('blog', {
      posts: ArticleModel.all()
    })
  }
  // find a specific article
  const article = ArticleModel.findBySlug(req.params[0])
  if (article === undefined) {
    return res.redirect(301, 'http://' + req.headers.host + '/blog')
  }
  res.render('article', {
    post: article
  })
}
