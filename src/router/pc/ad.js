let router = {
  path: 'ad',
  redirect: 'ad/auth',
  name: '广告',
  meta: {
    title: '广告',
    permission: 'ad'
  },
  component: () =>
    import(/* webpackChunkName: "page/ad/adView" */ 'page/ad/adView'),
  children: [
    {
      path: 'market',
      name: '授权列表',
      redirect: 'market',
      meta: {
        title: '授权列表',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/market/routerView" */ 'page/ad/market/routerView'),
      children: [
        {
          path: '/',
          name: '授权列表详情',
          meta: {
            title: '授权列表详情',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/market/index" */ 'page/ad/market/index')
        }
      ]
    },
    {
      path: 'list',
      name: '广告列表',
      redirect: 'list',
      meta: {
        title: '广告列表',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/list/routerView" */ 'page/ad/list/routerView'),
      children: [
        {
          path: '/',
          name: '广告详情列表',
          meta: {
            title: '广告详情列表',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/list/index" */ 'page/ad/list/index')
        },
        {
          path: 'add',
          name: '新建广告',
          meta: {
            title: '新建广告',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/list/add" */ 'page/ad/list/add')
        },
        {
          path: 'edit/:uid',
          name: '编辑广告',
          meta: {
            title: '编辑广告',
            permission: ''
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
    return '/ad/' + route.path
  }
}

export default router
