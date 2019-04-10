import auth from 'service/auth'
let router = {
  path: 'device',
  name: '设备管理',
  meta: {
    title: '设备管理',
    permission: 'shop_device'
  },
  component: () =>
    import(/* webpackChunkName: "page/device/deviceView" */ 'page/device/deviceView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '设备列表',
        permission: 'shop_device.device'
      },
      component: () =>
        import(/* webpackChunkName: "page/device/list/routerView" */ 'page/device/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '设备列表详情',
            permission: 'shop_device.device.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/device/list/index" */ 'page/device/list/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/device/' + route.path
    }
  }
}

export default router
