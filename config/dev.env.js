var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    SERVER_URL: '"http://mapi.newgls.cn"',
    HTTPS_SERVER_URL: '"http://mapi.newgls.cn"',
    IMG_URL: '"https://cdn.exe666.com/"'
})