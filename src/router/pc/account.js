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
        title: '我的资料',
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
      path: 'shop',
      meta: {
        title: '购物',
        permission: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/account/shop/routerView" */ 'page/account/shop/routerView'),
      children: [
        {
          path: 'try',
          meta: {
            title: '试用',
            permission: ''
          },
          component: () =>
            import(/* webpackChunkName: "page/account/shop/index" */ 'page/account/shop/index')
        }
      ]
    },
    {
      path: 'cart',
      meta: {
        title: '购物',
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
    }
    // {
    //   path: 'deal',
    //   name: '交易明细',
    //   redirect: 'deal',
    //   meta: {
    //     title: '交易明细'
    //   },
    //   component: () =>
    //     import(/* webpackChunkName: "page/account/deal/routerView" */ 'page/account/deal/routerView'),
    //   children: [
    //     {
    //       path: '/',
    //       name: '交易明细列表',
    //       meta: {
    //         title: '交易明细列表'
    //       },
    //       component: () =>
    //         import(/* webpackChunkName: "page/account/deal/index" */ 'page/account/deal/index')
    //     }
    //   ]
    // }
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
