var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    SERVER_URL: '"http://mapi.jingfree.top"',
    HTTPS_SERVER_URL: '"http://mapi.jingfree.top"',
    IMG_URL: '"http://p22vy0aug.bkt.clouddn.com/"'
})