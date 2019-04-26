import auth from 'service/auth'
let router = {
  path: 'shop',
  name: '节目试用',
  meta: {
    title: '节目试用',
    permission: ''
  },
  component: () =>
    import(/* webpackChunkName: "page/shop/shopView" */ 'page/shop/shopView'),
  children: [
    
    {
      path: 'try',
      meta: {
        title: '试用',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/shop/try/routerView" */ 'page/shop/try/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '试用列表',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/shop/try/index" */ 'page/shop/try/index')
        }
      ]
    }
   
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/shop/' + route.path
    }
  }
}

export default router
