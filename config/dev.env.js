var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: '"http://api.shop.xingstation.test"',
  HTTPS_SERVER_URL: '"http://api.shop.xingstation.test"',
  IMG_URL: '"http://cdn.xingstation.cn/"'
})
