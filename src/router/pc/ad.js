import auth from 'service/auth'
let router = {
  path: 'ad',
  name: '广告管理',
  meta: {
    title: '广告管理',
    // permission: 'shop_ad'
    permission: ''
  },
  component: () =>
    import(/* webpackChunkName: "page/ad/adView" */ 'page/ad/adView'),
  children: [
    {
      path: 'fodder',
      meta: {
        title: '广告素材',
        // permission: 'shop_ad.fodder'
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/fodder/routerView" */ 'page/ad/fodder/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '广告素材详情',
            // permission: 'shop_ad.fodder.read'
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/fodder/index" */ 'page/ad/fodder/index')
        },
        {
          path: 'add',
          meta: {
            title: '广告素材新增',
            // permission: 'shop_ad.fodder.create'
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/fodder/save" */ 'page/ad/fodder/save')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '广告素材修改',
            // permission: 'shop_ad.fodder.update'
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/fodder/save" */ 'page/ad/fodder/save')
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
