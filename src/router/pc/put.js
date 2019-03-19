import auth from 'service/auth'
let router = {
  path: 'put',
  name: '投放',
  meta: {
    title: '投放'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/put/putView" */ 'page/put/putView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '节目投放'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/list/routerView" */ 'page/put/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '节目投放列表'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/list/index" */ 'page/put/list/index')
        },
        {
          path: 'save',
          meta: {
            title: '节目投放新增'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/list/save" */ 'page/put/list/save')
        }
      ]
    },
    {
      path: 'schedule',
      meta: {
        title: '节目模板'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/schedule/routerView" */ 'page/put/schedule/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '节目模板列表'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/schedule/index" */ 'page/put/schedule/index')
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
