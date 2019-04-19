import Vue from 'vue'
import auth from 'service/auth'
import Router from 'vue-router'
import { Message } from 'element-ui'
import login from 'page/login'
import guide from 'page/guide'
import logout from 'page/logout'
import store from 'store'
import pcRouter from 'router/pcRouter'
import guideRouter from 'router/guide'
import PageNotFound from 'page/PageNotFound'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    pcRouter,
    guideRouter,
    {
      path: '/guide',
      component: guide
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/logout',
      component: logout
    },
    // {
    //   path: '/register',
    //   component: register,
    // },
    // {
    //   path: '/findPassword',
    //   component: findPassword,
    // },
    // {
    //   path: '/setNewPassword',
    //   component: setNewPassword,
    // },
    { path: '*', component: PageNotFound }
  ]
})

router.beforeEach((to, from, next) => {
  // 非登录白名单（非登录状态下，仍然可以访问的路由）
  let loginess = [
    '/login',
    '/guide',
    '/guide/index',
    '/guide/about',
    '/guide/login'
  ]
  if (!auth.checkLogin()) {
    let pathWhiteList = loginess.filter(pathness => {
      if (to.path == pathness) {
        return pathness
      }
    })
    if (pathWhiteList.length < 1) {
      // next({ path: '/login' })
      next({ path: '/guide' })
    } else {
      next()
    }
    return
  }

  // // 登录黑名单（登录状态下，不可再访问的路由）
  let unlessLogout = [
    '/login',
    '/guide',
    '/guide/index',
    '/guide/about',
    '/guide/login'
  ]
  let loginBlackList = unlessLogout.filter(unlessPath => {
    if (to.path == unlessPath) {
      return unlessPath
    }
  })
  if (loginBlackList.length > 0) {
    next({ path: '/' })
    return
  }
  // 权限白名单(不受权限限制)
  // let permissioness = ['/login', '/findPassword']
  let hasPathPermission = auth.checkPathPermission(to)

  if (hasPathPermission) {
    store.commit('refreshRoute', to)
    next()
  } else {
    Message.error('您没有权限访问这个页面')
  }
})

export default router
