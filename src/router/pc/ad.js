import auth from 'service/auth'
let router = {
  path: 'ad',
  redirect: 'ad/auth',
  name: '广告',
  meta: {
    title: '广告',
    permission: 'shop_ad'
  },
  component: () =>
    import(/* webpackChunkName: "page/ad/adView" */ 'page/ad/adView'),
  children: [
    {
      path: 'market',
      name: '授权列表',
      meta: {
        title: '授权列表',
        permission: 'shop_ad.market'
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/market/routerView" */ 'page/ad/market/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '授权列表详情',
            permission: 'shop_ad.market.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/market/index" */ 'page/ad/market/index')
        }
      ]
    },
    {
      path: 'list',
      meta: {
        title: '广告列表',
        permission: 'shop_ad.list'
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/list/routerView" */ 'page/ad/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '广告详情列表',
            permission: 'shop_ad.list.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/list/index" */ 'page/ad/list/index')
        },
        {
          path: 'add',
          meta: {
            title: '新建广告',
            permission: 'shop_ad.list.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/list/add" */ 'page/ad/list/add')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '编辑广告',
            permission: 'shop_ad.list.update'
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/list/add" */ 'page/ad/list/add')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/ad/' + route.path
    }
  }
}

export default router
