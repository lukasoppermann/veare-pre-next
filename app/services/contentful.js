'use strict'

const client = require('./client')

class Contentful {
  constructor (cache) {
    this.cache = cache
  }

  sync () {
    let self = this
    self.cache.get('contentfulSyncToken', function (err, token) {
      if (!err) {
        if (token === undefined) {
          client.sync({initial: true})
          .then((response) => {
            const responseObj = JSON.parse(response.stringifySafe())
            self._storeContent(response.nextSyncToken, {
              entries: responseObj.entries,
              assets: responseObj.assets
            })
          })
        } else {
          client.sync({nextSyncToken: token})
          .then((response) => {
            self._storeContent(response.nextSyncToken, self._updatedContent(response))
          })
        }
      }
    })
  }

  _storeContent (token, content) {
    this.cache.set('contentfulEntries', content.entries)
    this.cache.set('contentfulAssets', content.assets)
    // store the new token
    this.cache.set('contentfulSyncToken', token)
  }

  _updatedContent (response) {
    let entries = Object.assign(this._cleanObject(this.cache.get('contentfulEntries'), response.deletedEntries), response.entries)
    let assets = Object.assign(this._cleanObject(this.cache.get('contentfulAssets'), response.deletedAssets), response.assets)

    return {
      entries: entries,
      assets: assets
    }
  }

  _cleanObject (object, removedProperties) {
    console.log(removedProperties)
    return object
  }
}

// let contentful = function (cache) {
//   const entries = {}
//   const assets = {}
//
//   cache.set('contentfulEntries', JSON.stringify(entries))
//   cache.set('contentfulAssets', JSON.stringify(assets))
//   // store the new token
//   cache.set('contentfulSyncToken', 'Test')
//
//   return
//
//
//   cache.get('contentfulSyncToken', function (err, value) {
//     if (!err) {
//       if (value === undefined) {
//         client.sync({initial: true})
//         .then((response) => {
//           const responseObj = JSON.parse(response.stringifySafe())
//           const entries = responseObj.entries
//           const assets = responseObj.assets
//           cache.set('contentfulEntries', JSON.stringify(entries))
//           cache.set('contentfulAssets', JSON.stringify(assets))
//           // store sync token
//           cache.set('contentfulSyncToken', response.nextSyncToken)
//         })
//       } else {
//         client.sync({nextSyncToken: value})
//         .then((response) => {
//           let entries = Object.assign(cache.get('contentfulEntries'), response.entries)
//           let assets = Object.assign(cache.get('contentfulAssets'), response.assets)
//           console.log(response.deletedEntries)
//           console.log(response.deletedAssets)
//           cache.set('contentfulEntries', JSON.stringify(entries))
//           cache.set('contentfulAssets', JSON.stringify(assets))
//           // store the new token
//           cache.set('contentfulSyncToken', response.nextSyncToken)
//         })
//       }
//     }
//   })
// }

module.exports = Contentful
