'use strict'

// const Model = require('./Model')
import Model from './Model'
const ProjectTransformer = require('../transformer/ProjectTransformer')

class Project extends Model {
  constructor () {
    super(ProjectTransformer, 'project')
  }

  all () {
    return super.all().sort((a: Resource, b: Resource) => {
      let dateA = new Date(a.fields.rawdate)
      let dateB = new Date(b.fields.rawdate)
      if (dateA < dateB) {
        return 1
      }
      if (dateA > dateB) {
        return -1
      }
      return 0
    })
  }

  findBySlug (slug) {
    return this.findByField('slug', slug)
  }

  findByAlias (slug) {
    return this.findByArrayField('aliases', slug)
  }
}

module.exports = () => new Project()
