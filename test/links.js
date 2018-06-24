const linkCheck = require('link-check')
const chalk = require('chalk')
const request = require('sync-request')
const cheerio = require('cheerio')

const baseUrl = `http://localhost:${process.env.NODE_PORT}`

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

const checkLink = (link, links, results) => {
  return new Promise((resolve, reject) => {
    linkCheck(link, function (err, result) {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

const getAllLinks = (url) => {
  let internalLinks = []
  let externalLinks = []

  let getPageLinks = (url) => {
    var links = scrapeLinks(url)
    links
      .filter((item) => item !== undefined && item.link !== undefined)
      .forEach((item) => {
        if (isInternalLink(item.link)) {
          if (internalLinks.filter((arrayItem) => arrayItem.link === item.link).length === 0) {
            internalLinks.push(item)
            getPageLinks(item.link)
          }
        } else if (externalLinks.filter((arrayItem) => arrayItem.link === item.link).length === 0) {
          externalLinks.push(item)
        }
      })
  }

  getPageLinks(url)
  return [...internalLinks, ...externalLinks]
}

const checkLinks = (url) => {
  console.log(`${chalk.yellow.bold('Fetching links for ' + baseUrl + '...')}`)
  // get links
  let links = getAllLinks(url)
  // check links
  console.log(`${chalk.yellow.bold('Checking ' + links.length + ' links...')}`)
  let linkLoop = new Promise((resolve, reject) => {
    let results = []
    links.forEach((item, index, array) => {
      checkLink(item.link).then((result) => {
        item.status = result.status
        item.statusCode = result.statusCode
        results.push(item)
        if (index === array.length - 1) {
          resolve(results)
        }
      })
    })
  })

  linkLoop.then((results) => {
    let errors = results.filter((item) => {
      return item.statusCode > 400 && item.statusCode < 600
    })

    let valid = results.filter((item) => {
      return item.statusCode >= 200 && item.statusCode < 400
    })

    let warnings = results.filter((item) => {
      return item.statusCode < 200 || item.statusCode > 600
    })

    if (errors.length > 0) {
      console.log(`${chalk.red.bold(errors.length)} broken urls:`)
      errors.forEach((error) => {
        console.log(`${chalk.red.bold('✘ ' + error.statusCode + ':')} ${chalk.yellow(error.link)} on page ${error.parent}`)
      })
    }

    if (warnings.length > 0) {
      console.log(`${chalk.yellow.bold(warnings.length)} urls with warnings:`)
      warnings.forEach((warning) => {
        console.log(`${chalk.yellow.bold('⚠︎ ' + warning.statusCode + ':')} ${warning.link} ${chalk.white('on page ' + warning.parent)}`)
      })
    }

    if (valid.length > 0) {
      console.log(`${chalk.green.bold(valid.length)} valid urls:`)
      valid.forEach((success) => {
        console.log(`${chalk.green.bold('✔︎ ' + success.statusCode + ':')} ${success.link} ${chalk.white('on page ' + success.parent)}`)
      })
    }

    // to stop node test, etc.
    if (errors.length > 0) {
      process.exit(1)
    }
  })
}

// run script
checkLinks(baseUrl)
