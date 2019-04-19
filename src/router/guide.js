import auth from 'service/auth'
let router = {
  path: '/guide',
  name: '引导页',
  meta: {
    title: '引导页',
    permission: ''
  },
  component: () =>
    import(/* webpackChunkName: "page/guide/guide" */ 'page/guide'),
  children: [
    // {
    //   path: '/',
    //   meta: {
    //     title: '首页',
    //     permission: ''
    //   },
    //   component: () =>
    //     import(/* webpackChunkName: "page/guide/guide" */ 'page/guide')
    // },
    {
      path: 'index',
      meta: {
        title: '首页',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/guide/guide/routerView" */ 'page/guide/guide/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '首页',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/guide/guide/index" */ 'page/guide/guide/index')
        }
      ]
    },
    {
      path: 'about',
      meta: {
        title: '关于我们',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/guide/about/routerView" */ 'page/guide/about/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '关于我们',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/guide/about/index" */ 'page/guide/about/index')
        }
      ]
    },
    {
      path: 'login',
      meta: {
        title: '简单登陆',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/guide/about/routerView" */ 'page/guide/login/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '简单登陆',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/guide/login/index" */ 'page/guide/login/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    return '/guide/' + route.path
  }
}
export default router
