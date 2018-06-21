const linkCheck = require('link-check')
const chalk = require('chalk')
const request = require('sync-request')
const cheerio = require('cheerio')

const baseUrl = 'http://localhost:8080'

const isInternalLink = (link) => {
  return link && link.substr(0, baseUrl.length) === baseUrl
}

const getLink = (link) => {
  if (link && (link.substr(0, 1) === '/' || link.substr(0, 2) === '//' || link.substr(0, 5) === 'http:' || link.substr(0, 6) === 'https:')) {
    if (link.substr(0, 1) === '/') {
      link = baseUrl + link
    }
    return link.replace(/\/$/, '')
  }
}

const scrapeLinks = (url) => {
  let scrapedLinks = []

  let res = request('GET', url)
  let $ = cheerio.load(res.getBody())

  $('a').each(function () {
    let link = getLink($(this).attr('href'))
    if (link) {
      scrapedLinks.push({
        link: getLink($(this).attr('href')),
        parent: url
      })
    }
  })

  return scrapedLinks
}

let checkLink = (link, links) => {
  linkCheck(link, function (err, result) {
    if (err) {
      console.error(err)
      return
    }
    if (result.statusCode > 0 && result.statusCode < 400) {
      // console.log(`${chalk.green('✔')} ${chalk.green(result.link)} is ${result.status} with code ${result.statusCode}`)
      // output = {
      //   type: 'success',
      //   msg: `${chalk.green('✔')} ${chalk.green(result.link)} is ${result.status} with code ${result.statusCode}`
      // }
    } else {
      console.log(`${chalk.red.bold('×')} ${chalk.red(result.link)} is ${result.status} with code ${result.statusCode} on page ${chalk.yellow(links.parents[result.link])}`)
      // output = {
      //   type: 'error',
      //   msg: `${chalk.red.bold('×')} ${chalk.red(result.link)} is ${result.status} with code ${result.statusCode}`
      // }
    }
  })
}

const getAllLinks = (url) => {
  let internalLinks = []
  let externalLinks = []
  let parents = {}

  let getPageLinks = (url) => {
    var links = scrapeLinks(url)
    links
      .filter((linkItem) => linkItem !== undefined && linkItem.link !== undefined)
      .forEach((linkItem) => {
        parents[linkItem.link] = url
        let link = linkItem.link
        if (isInternalLink(link)) {
          if (internalLinks.indexOf(link) === -1) {
            internalLinks.push(link)
            getPageLinks(link)
          }
        } else if (externalLinks.indexOf(link) === -1) {
          externalLinks.push(link)
        }
      })
  }

  getPageLinks(url)
  return {
    links: [...internalLinks, ...externalLinks],
    parents: parents
  }
}

const checkLinks = (url) => {
  // get links
  let links = getAllLinks(url)
  // check links
  links.links.forEach((item) => {
    checkLink(item, links)
  })
  // if (output['error'].length > 0) {
  //   throw Error(`${chalk.red.bold('×')} There are ${chalk.red.bold(output['error'].length)} broken links in the page.`)
  // }
}

// run script
try {
  checkLinks(baseUrl)
} catch (e) {
  console.log(e)
}
