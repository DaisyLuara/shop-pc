import auth from 'service/auth'
let router = {
  path: 'coupon',
  name: '核销',
  meta: {
    title: '核销',
    permission: 'shop_coupon'
  },
  component: () =>
    import(/* webpackChunkName: "page/coupon/couponView" */ 'page/coupon/couponView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '核销列表',
        permission: 'shop_coupon.list'
      },
      component: () =>
        import(/* webpackChunkName: "page/coupon/verification/routerView" */ 'page/coupon/verification/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '核销列表集合',
            permission: 'shop_coupon.list.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/coupon/verification/index" */ 'page/coupon/verification/index')
        }
      ]
    },
    {
      path: 'rules',
      meta: {
        title: '优惠券规则',
        permission: 'shop_coupon.rules'
      },
      component: () =>
        import(/* webpackChunkName: "page/coupon/rules/routerView" */ 'page/coupon/rules/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '优惠券规则列表',
            permission: 'shop_coupon.rules.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/coupon/rules/index" */ 'page/coupon/rules/index')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/coupon/' + route.path
    }
  }
}

export default router
