'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  SERVER_URL: '"http://mapi.xingstation.net"',
  HTTPS_SERVER_URL: '"https://mapi.xingstation.net"',
  IMG_URL: '"https://cdn.xingstation.cn/"'
})
