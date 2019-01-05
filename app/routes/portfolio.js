const express = require('express')
const router = express.Router()
// DELETE once new portfolio from cms is done
// show portfolio item
router.get('/:item', (req, res) => {
  res.render(`./portfolio/${req.params.item}.hbs`, {
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
