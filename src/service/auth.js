import { Message, MessageBox } from 'element-ui'
const HOST = process.env.SERVER_URL
const LOGIN_API = '/api/authorizations'
const LOGOUT_API = '/api/authorizations/current'
const CUSTOMER_API = '/api/customer?include=roles,company.logoMedia'
const IMAGE_CAPTCHA = '/api/captcha'
export default {
  login(context, creds, redirect) {
    context.setting.submiting = true
    context.$http
      .post(HOST + LOGIN_API, creds)
      .then(response => {
        //  将token与权限存储到cookie和localstorage中,取的时候从localstorage中取
        let loginResult = response.data
        this.setToken(context, loginResult)
        context.$message({
          message: '登录成功!',
          type: 'success'
        })
        context.setting.submiting = false
        this.refreshUserInfo(context).then(res => {
          context.$router.push({
            path: redirect ? redirect : '/'
          })
        })
      })
      .catch(err => {
        console.log(err)
        // context.setting.loginFailedTimes++;
        context.setting.submiting = false
      })
  },
  // 根据本地token来检测用户的登录状态
  checkLogin(context) {
    if (this.checkTokenExpired(context)) {
      return false
    } else {
      return true
    }
  },

  logout(context) {
    context.$http
      .delete(HOST + LOGOUT_API)
      .then(data => {
        this.clearLoginData(context)
        context.$router.push({
          path: '/login'
        })
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 清楚一切登录相关数据
  clearLoginData(context) {
    context.$cookie.delete('jwt_token')
    context.$cookie.delete('customer_info')
    context.$cookie.delete('jwt_ttl')
    context.$cookie.delete('jwt_begin_time')
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('customer_info')
    localStorage.removeItem('jwt_ttl')
    localStorage.removeItem('permissions')
    localStorage.removeItem('jwt_begin_time')
  },

  refreshUserInfo(context) {
    return new Promise((resolve, reject) => {
      context.$http
        .get(HOST + CUSTOMER_API)
        .then(response => {
          console.log(response)
          let result = response.data
          let user = {}
          user.name = result.name
          user.ar_id = result.ar_user_id
          user.display_name = result.roles
          user.perms = result.permissions
          user.company = result.company
          user.media = result.media
          localStorage.removeItem('customer_info')
          localStorage.setItem('customer_info', JSON.stringify(user))
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getToken() {
    return localStorage.getItem('jwt_token')
  },

  getCustomerInfo() {
    let customer = localStorage.getItem('customer_info')
    if (customer) {
      return JSON.parse(customer)
    }
    return {}
  },

  getPermission() {
    let customer = this.getCustomerInfo()
    return customer.perms
  },

  checkPathPermission(route) {
    if (!route.meta || !route.meta.permission) {
      return true
    }
    return this.checkPermission(route.meta.permission)
  },

  checkPermission(name) {
    return hasPermission(name, this.getPermission())
  },

  // 获取token的时效，分钟为单位
  getTokenLifeTime() {
    return localStorage.getItem('jwt_ttl')
  },

  // 获取token生成的时间
  getTokenBeginTime() {
    return localStorage.getItem('jwt_begin_time')
  },

  setToken(context, tokenObj) {
    context.$cookie.set('jwt_token', tokenObj.access_token)
    localStorage.setItem('jwt_token', tokenObj.access_token)
    context.$cookie.set('jwt_ttl', tokenObj.expires_in)
    localStorage.setItem('jwt_ttl', tokenObj.expires_in)
    let tokenBeginTime = new Date().getTime()
    context.$cookie.set('jwt_begin_time', tokenBeginTime)
    localStorage.setItem('jwt_begin_time', tokenBeginTime)
  },

  // 检测token是否过期, 过期返回true，没有过期返回false
  checkTokenExpired() {
    let nowTime = new Date(),
      localToken = this.getToken(),
      tokenBeginTime = this.getTokenBeginTime(),
      tokenLifeTime = this.getTokenLifeTime(),
      differTime = nowTime - tokenBeginTime
    if (!localToken || !tokenBeginTime || !tokenLifeTime) {
      return true
    }

    let tokenlatestLifeTime = Math.floor(differTime / (60 * 1000))
    // console.log(
    //   '距离token生成已过去:' + tokenlatestLifeTime + '分钟',
    //   'token时效:' + tokenLifeTime + '分钟'
    // )
    if (tokenlatestLifeTime >= tokenLifeTime) {
      return true
    }

    return false
  },

  // 获取图形验证码
  getImageCaptcha(context) {
    let promise = new Promise((resolve, reject) => {
      context.$http
        .post(HOST + IMAGE_CAPTCHA)
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  }
}

function hasPermission(name, perms) {
  if (!perms) {
    return false
  }
  if (name == perms.name) {
    return true
  }
  if (perms.children && perms.children.length == 0) {
    return false
  }
  for (let i in perms) {
    if (name == perms[i]['name']) {
      return true
    } else if (
      name.indexOf(perms[i]['name']) == 0 &&
      perms[i].children.length > 0
    ) {
      return hasPermission(name, perms[i]['children'])
    }
  }
  return false
}
