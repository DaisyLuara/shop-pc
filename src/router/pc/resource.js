let router = {
  path: 'resource',
  redirect: 'resource/picture',
  name: '资源',
  meta: {
    title: '资源',
    permission: 'resource'
  },
  component: () =>
    import(/* webpackChunkName: "page/resource/resourceView" */ 'page/resource/resourceView'),
  children: [
    {
      path: 'picture',
      name: '图片管理',
      redirect: 'picture',
      meta: {
        title: '图片管理',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/resource/picture/routerView" */ 'page/resource/picture/routerView'),
      children: [
        {
          path: '/',
          name: '图片管理集合',
          meta: {
            title: '图片管理集合',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/resource/picture/index" */ 'page/resource/picture/index')
        }
      ]
    },
    {
      path: 'video',
      name: '视频管理',
      redirect: 'video',
      meta: {
        title: '视频管理',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/resource/video/routerView" */ 'page/resource/video/routerView'),
      children: [
        {
          path: '/',
          name: '视频管理集合',
          meta: {
            title: '视频管理集合',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/resource/video/index" */ 'page/resource/video/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    return '/resource/' + route.path
  }
}

export default router
