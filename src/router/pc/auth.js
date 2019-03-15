import auth from 'service/auth'
let router = {
  path: 'auth',
  name: '授权',
  meta: {
    title: '授权',
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/auth/authView" */ 'page/auth/authView'),
  children: [
    {
      path: 'datum',
      meta: {
        title: '我的资料',
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/auth/auth/routerView" */ 'page/auth/auth/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '我的账号',
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/auth/auth/index" */ 'page/auth/auth/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/auth/' + route.path
    }
  }
}

export default router
