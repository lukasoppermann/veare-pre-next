// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      branch: 'master',
      deployTo: '/home',
      repositoryUrl: 'https://github.com/lukasoppermann/veare.git',
      shallowClone: true,
      keepReleases: 5,
      deleteOnRollback: false,
      ignores: [
        '.git',
        '.github',
        'node_modules', 
        'resources',
        'logs', 
        'tests',
        'jest-puppeteer.config.js',
        'rollup.config.js'
      ]
    },
    production: {
      servers: 'root@vea.re'
    }
  })

  // shipit.blTask('deploy:fetch', fetch)

  shipit.on('published', async () => {
    // copy .env config to server
    await shipit.copyToRemote(
      '.env',
      `${shipit.releasePath}/.env`,
    )
    // install npm dependencies
    await shipit.remote(`cd ${shipit.releasePath} && npm i --production`)
  })

  shipit.on('deployed', async () => {
    // restart server
    await shipit.remote(`cd ${shipit.releasePath} && npm run restart-server`)
  })
}