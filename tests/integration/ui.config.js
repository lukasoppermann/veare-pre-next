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
    home: {
      path: '/home',
      folder: 'home',
      sections: 8
    },
    nyon: {
      path: '/work/nyon',
      folder: 'work-nyon',
      sections: 10
    },
    copra: {
      path: '/work/copra',
      folder: 'work-copra',
      sections: 15
    },
    privacy: {
      path: '/privacy',
      folder: 'privacy',
      sections: 16
    },
    blog: {
      path: '/blog',
      folder: 'blog',
      sections: 3
    },
    post: {
      path: '/blog/framer-x-a-review',
      folder: 'blog-framer',
      sections: 3
    }
  }
}
