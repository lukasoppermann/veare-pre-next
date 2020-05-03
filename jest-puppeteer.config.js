module.exports = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
        devtools: true
    },
    server: {
      command: "npm run start",
      port: 3300,
      launchTimeout: 180000
    }
}
