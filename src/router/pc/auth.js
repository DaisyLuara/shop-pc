import auth from 'service/auth'
let router = {
  path: 'auth',
  name: '授权',
  meta: {
    title: '授权'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/auth/authView" */ 'page/auth/authView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '授权列表'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/auth/list/routerView" */ 'page/auth/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '授权投放列表'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/auth/list/index" */ 'page/auth/list/index')
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
