import auth from 'service/auth'

let router = {
  path: 'resource',
  name: '资源管理',
  meta: {
    title: '资源管理',
    permission: 'shop_resource'
  },
  component: () =>
    import(/* webpackChunkName: "page/resource/resourceView" */ 'page/resource/resourceView'),
  children: [
    {
      path: 'picture',
      meta: {
        title: '图片管理',
        permission: 'shop_resource.media'
      },
      component: () =>
        import(/* webpackChunkName: "page/resource/picture/routerView" */ 'page/resource/picture/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '图片管理集合',
            permission: 'shop_resource.media.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/resource/picture/index" */ 'page/resource/picture/index')
        }
      ]
    },
    {
      path: 'video',
      meta: {
        title: '视频管理',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/resource/video/routerView" */ 'page/resource/video/routerView'),
      children: [
        {
          path: '/',
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
    if (auth.checkPathPermission(route)) {
      return '/resource/' + route.path
    }
  }
}

export default router
