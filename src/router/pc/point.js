import auth from 'service/auth'
let router = {
  path: 'point',
  name: '点位',
  meta: {
    title: '点位',
    permission: 'shop_point'
  },
  component: () =>
    import(/* webpackChunkName: "page/point/pointView" */ 'page/point/pointView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '点位列表',
        permission: 'shop_point.list'
      },
      component: () =>
        import(/* webpackChunkName: "page/point/item/routerView" */ 'page/point/item/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '点位列表集合',
            permission: 'shop_point.list.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/point/item/index" */ 'page/point/item/index')
        }
      ]
    }
    // {
    //   path: 'data',
    //   name: '营收数据',
    //   redirect: 'data/index',
    //   meta: {
    //     title: '营收数据'
    //   },
    //   component: () =>
    //     import(/* webpackChunkName: "page/point/data/routerView" */ 'page/point/data/routerView'),
    //   children: [
    //     {
    //       path: 'index',
    //       name: '营收数据',
    //       meta: {
    //         title: '营收数据'
    //       },
    //       component: () =>
    //         import(/* webpackChunkName: "page/point/data/index" */ 'page/point/data/index')
    //     },
    //   ]
    // }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/point/' + route.path
    }
  }
}

export default router
