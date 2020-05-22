module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8079',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
