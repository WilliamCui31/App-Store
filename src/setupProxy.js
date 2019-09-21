const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/cn', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/hk', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/tw', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/ma', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/jp', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/us', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/kr', { target: 'https://itunes.apple.com', changeOrigin: true }));
  app.use(proxy('/sg', { target: 'https://itunes.apple.com', changeOrigin: true }));
};
