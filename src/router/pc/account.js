import auth from 'service/auth'
let router = {
  path: 'account',
  name: '账户管理',
  meta: {
    title: '账户管理',
    permission: 'shop_account'
  },
  component: () =>
    import(/* webpackChunkName: "page/account/accountView" */ 'page/account/accountView'),
  children: [
    {
      path: 'datum',
      meta: {
        title: '我的主页',
        permission: 'shop_account.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/account/account/routerView" */ 'page/account/account/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '我的账号',
            permission: 'shop_account.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/account/account/index" */ 'page/account/account/index')
        }
      ]
    },
    {
      path: 'cart',
      meta: {
        title: '我的购物车',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/account/cart/routerView" */ 'page/account/cart/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '购物车',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/account/cart/index" */ 'page/account/cart/index')
        }
      ]
    },
    {
      path: 'order',
      permission: '',
      meta: {
        title: '我的订单'
      },
      component: () =>
        import(/* webpackChunkName: "page/account/order/routerView" */ 'page/account/order/routerView'),
      children: [
        {
          path: '/',
          name: '我的订单列表',
          meta: {
            title: '我的订单列表'
          },
          component: () =>
            import(/* webpackChunkName: "page/account/order/index" */ 'page/account/order/index')
        },
        {
          path: 'detail/:uid',
          name: '我的订单详情',
          meta: {
            title: '我的订单详情'
          },
          component: () =>
            import(/* webpackChunkName: "page/account/order/detail" */ 'page/account/order/detail')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/account/' + route.path
    }
  }
}

export default router
