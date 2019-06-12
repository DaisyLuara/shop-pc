import auth from 'service/auth'
let router = {
  path: 'auth',
  name: '第三方',
  meta: {
    title: '第三方',
    permission: 'shop_wechat'
  },
  component: () =>
    import(/* webpackChunkName: "page/auth/authView" */ 'page/auth/authView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '授权列表',
        permission: 'shop_wechat.wechat'
      },
      component: () =>
        import(/* webpackChunkName: "page/auth/list/routerView" */ 'page/auth/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '授权投放列表',
            permission: 'shop_wechat.wechat.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/auth/list/index" */ 'page/auth/list/index')
        },
        {
          path: 'add',
          meta: {
            title: '授权新增',
            permission: 'shop_wechat.wechat.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/auth/list/add" */ 'page/auth/list/add')
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
