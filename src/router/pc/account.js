let router = {
  path: 'account',
  redirect: 'account/datum',
  name: '账户',
  meta: {
    title: '账户',
    permission: 'account'
  },
  component: () =>
    import(/* webpackChunkName: "page/account/accountView" */ 'page/account/accountView'),
  children: [
    {
      path: 'datum',
      name: '我的资料',
      redirect: 'datum',
      meta: {
        title: '我的资料'
      },
      component: () =>
        import(/* webpackChunkName: "page/account/account/routerView" */ 'page/account/account/routerView'),
      children: [
        {
          path: '/',
          name: '我的账号',
          meta: {
            title: '我的账号'
          },
          component: () =>
            import(/* webpackChunkName: "page/account/account/index" */ 'page/account/account/index')
        }
      ]
    },
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
    return '/account/' + route.path
  }
}

export default router
