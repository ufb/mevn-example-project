const { PROD } = require('./config');
const path = require('path');

const outputDir = path.resolve(__dirname, '../server/public');
const devServer = {
  proxy: {
    '/': {
      target: 'http://localhost:5000'
    }
  }
};

module.exports = {
  css: {
    modules: true,
    sourceMap: true
  },
  outputDir: PROD ? outputDir : undefined,
  devServer: PROD ? devServer : undefined
}
