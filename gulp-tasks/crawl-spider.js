// CURRENTLY NOT IN USE
module.exports.crawl = function (url, cb) {
  let huntsman = require('huntsman')
  let spider = huntsman.spider()
  let links = []
  spider.extensions = [
    huntsman.extension('links')
  ]

  spider.on('/', function (err, res) {
    // if content is not a string
    if (!res.extension.links) return
    if (err) console.log(err)

    links = links.concat(res.extension.links({
      pattern: {
        search: /<a([^>]+)href\s?=\s?['"]([^"'#]+)/gi,
        refine: /['"]([^"'#]+)$/,
        filter: new RegExp(url)
      }
    }))
  })

  spider.on('HUNTSMAN_EXIT', () => {
    cb(null, links)
  })

  spider.queue.add(url)
  spider.start()
}
