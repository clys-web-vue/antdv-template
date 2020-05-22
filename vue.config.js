module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    proxy: {
      '/ipapi': {
        target: 'http://ip-api.com',
        changeOrigin: true,
        pathRewrite: {
          '^/ipapi': ''
        }
      }
    }
  }
};
