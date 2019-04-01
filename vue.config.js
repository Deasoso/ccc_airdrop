module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [],
      },
    },
  },
  pwa: {
    msTileColor: '#4DBA87',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
};
