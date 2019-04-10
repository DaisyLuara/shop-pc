import auth from 'service/auth'
let router = {
  path: 'report',
  name: '数据管理',
  meta: {
    title: '数据管理',
    permission: 'shop_report'
  },
  component: () =>
    import(/* webpackChunkName: "page/report/reportView" */ 'page/report/reportView'),
  children: [
    {
      path: 'detail',
      meta: {
        title: '数据管理',
        permission: 'shop_report.detail'
      },
      component: () =>
        import(/* webpackChunkName: "page/report/detail/routerView" */ 'page/report/detail/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '数据展示',
            permission: 'shop_report.detail.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/report/detail/index" */ 'page/report/detail/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/report/' + route.path
    }
  }
}

export default router
