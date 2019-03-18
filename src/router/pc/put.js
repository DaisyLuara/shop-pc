import auth from 'service/auth'
let router = {
  path: 'put',
  name: '授权',
  meta: {
    title: '授权'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/put/putView" */ 'page/put/putView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '授权列表'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/list/routerView" */ 'page/put/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '授权投放列表'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/list/index" */ 'page/put/list/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/put/' + route.path
    }
  }
}

export default router
