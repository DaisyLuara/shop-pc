import auth from 'service/auth'
let router = {
  path: 'prize',
  name: '奖品管理',
  meta: {
    title: '奖品管理'
    // permission: 'shop_auth'
  },
  component: () =>
    import(/* webpackChunkName: "page/prize/prizeView" */ 'page/prize/prizeView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '奖品列表'
        // permission: 'shop_auth.datum'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/list/routerView" */ 'page/prize/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品列表详情'
            // permission: 'shop_auth.datum.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/index" */ 'page/prize/list/index')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '修改奖品'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/save" */ 'page/prize/list/save')
        }
      ]
    },
    {
      path: 'template',
      meta: {
        title: '奖品模板'
        // permission: 'shop_coupon.list'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/template/routerView" */ 'page/prize/template/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品模板详情'
            // permission: 'shop_prize.list.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/template/index" */ 'page/prize/template/index')
        }
      ]
    },
    {
      path: 'verifies',
      meta: {
        title: '奖品核销'
        // permission: 'shop_coupon.list'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/verification/routerView" */ 'page/prize/verification/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品核销详情'
            // permission: 'shop_prize.list.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/verification/index" */ 'page/prize/verification/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/prize/' + route.path
    }
  }
}

export default router
