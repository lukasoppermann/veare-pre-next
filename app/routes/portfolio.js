const express = require('express')
const router = express.Router()
// DELETE once new portfolio from cms is done
// show portfolio item
router.get(/^\/([\w]*)$/, (req, res) => {
  console.log(req, req.params[0])
  res.render('./portfolio/' + req.params[0] + '.hbs', {
    staticFiles: req.staticFiles,
    pageClass: 'c-page--portfolio-item',
    response: res
  }, function (err, html) {
    if (err) {
      console.log(err)
      res.redirect('/#portfolio')
    }
    res.send(html)
  })
})

module.exports = router
