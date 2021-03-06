import auth from 'service/auth'
let router = {
  path: 'site',
  name: '场地管理',
  meta: {
    title: '场地管理',
    permission: 'shop_market'
  },
  component: () =>
    import(/* webpackChunkName: "page/site/siteView" */ 'page/site/siteView'),
  children: [
    {
      path: 'point',
      meta: {
        title: '点位管理',
        permission: 'shop_market.point'
      },
      component: () =>
        import(/* webpackChunkName: "page/site/point/routerView" */ 'page/site/point/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '点位列表',
            permission: 'shop_market.point.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/site/point/index" */ 'page/site/point/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/site/' + route.path
    }
  }
}

export default router
