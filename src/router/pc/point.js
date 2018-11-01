let router = {
  path: 'point',
  redirect: 'point',
  name: '点位',
  meta: {
    title: '点位',
    permission: 'point'
  },
  component: () =>
    import(/* webpackChunkName: "page/point/pointView" */ 'page/point/pointView'),
  children: [
    {
      path: 'list',
      name: '点位列表',
      redirect: 'list',
      meta: {
        title: '点位列表'
      },
      component: () =>
        import(/* webpackChunkName: "page/point/item/routerView" */ 'page/point/item/routerView'),
      children: [
        {
          path: '/',
          name: '点位列表集合',
          meta: {
            title: '点位列表集合'
          },
          component: () =>
            import(/* webpackChunkName: "page/point/item/index" */ 'page/point/item/index')
        },
      ]
    },
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
    return '/point/' + route.path
  }
}

export default router
