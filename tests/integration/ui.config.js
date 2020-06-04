module.exports = {
  basePath: process.env.SNAPSHOT_PATH  || __dirname,
  snapshotPath: process.env.SNAPSHOT_PATH ? process.env.SNAPSHOT_PATH + '/tests/integration' : __dirname,
  testSnaps: (process.env.SNAPSHOT_PATH  || __dirname) + '/test_snaps',
  // jest-image-snapshot custom configuration in order to save screenshots and compare the with the baseline
  setConfig: opts => {
    return {
      customDiffConfig: {
        threshold: 0.01
      },
      customDiffDir: opts.diffPath,
      customSnapshotsDir: opts.snapshotPath,
      customSnapshotIdentifier: opts.filename,
      noColors: true
    }
  },
  viewports: [
    // name, width, height
    ['mobile', 400, 700],
    ['mobile-landscape', 577, 900],
    ['tablet', 769, 900],
    ['desktop', 993, 900],
    ['desktop-large', 1200, 900],
    ['desktop-extra-large', 1440, 900]
  ],
  cases: {
    menu: {
      path: '/home',
      folder: 'menu'
    },
    home: {
      path: '/',
      folder: 'home'
    },
    work: {
      path: '/work/test-project',
      folder: 'work'
    },
    nyon: {
      path: '/work/nyon',
      folder: 'work-nyon'
    },
    copra: {
      path: '/work/copra',
      folder: 'work-copra'
    },
    privacy: {
      path: '/privacy',
      folder: 'privacy'
    },
    blog: {
      path: '/blog',
      folder: 'blog'
    },
    article: {
      path: '/blog/test-article',
      folder: 'article'
    }
  }
}
