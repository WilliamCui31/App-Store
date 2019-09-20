const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/hk', { target: 'https://itunes.apple.com', changeOrigin: true }));
};
