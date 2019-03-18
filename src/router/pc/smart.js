import auth from 'service/auth'
let router = {
  path: 'smart',
  name: '智造',
  meta: {
    title: '智造'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/smart/smartView" */ 'page/smart/smartView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '标准节目'
        // permission: 'shop_smart.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/smart/list/routerView" */ 'page/smart/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '标准节目列表'
            // permission: 'shop_smart.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/smart/list/index" */ 'page/smart/list/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/smart/' + route.path
    }
  }
}

export default router
