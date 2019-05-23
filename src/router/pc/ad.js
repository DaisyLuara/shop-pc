import auth from 'service/auth'
let router = {
  path: 'ad',
  name: '广告管理',
  meta: {
    title: '广告管理',
  },
  component: () =>
    import(/* webpackChunkName: "page/ad/adView" */ 'page/ad/adView'),
  children: [
    {
      path: 'template',
      meta: {
        title: '广告模板',
      },
      component: () =>
        import(/* webpackChunkName: "page/ad/template/routerView" */ 'page/ad/template/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '广告模板列表',
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/template/index" */ 'page/ad/template/index')
        },
        {
          path: 'items',
          meta: {
            title: '子条目列表',
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/template/items" */ 'page/ad/template/items')
        },
        {
          path: 'save',
          meta: {
            title: '子条目新增',
          },
          component: () =>
            import(/* webpackChunkName: "page/ad/template/save" */ 'page/ad/template/save')
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
