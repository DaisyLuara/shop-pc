import auth from 'service/auth'
let router = {
  path: 'prize',
  name: '奖品',
  meta: {
    title: '奖品'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/prize/prizeView" */ 'page/prize/prizeView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '奖品列表'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/list/routerView" */ 'page/prize/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品列表详情'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/index" */ 'page/prize/list/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/prize/' + route.path
    }
  }
}

export default router
