const DEPLOYMENT_PATH = ''

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? DEPLOYMENT_PATH : 'http://localhost:8080/',

  devServer: {
    public: 'localhost:8080',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}
