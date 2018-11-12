'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  SERVER_URL: '"http://mapi.newgls.cn"',
  HTTPS_SERVER_URL: '"https://mapi.newgls.cn"',
  IMG_URL: '"https://cdn.exe666.com/"'
})
