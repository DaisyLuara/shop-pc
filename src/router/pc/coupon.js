let router = {
  path: 'coupon',
  redirect: 'coupon',
  name: '核销',
  meta: {
    title: '核销',
    permission: ''
  },
  component: () =>
    import(/* webpackChunkName: "page/coupon/couponView" */ 'page/coupon/couponView'),
  children: [
    {
      path: 'list',
      name: '核销列表',
      redirect: 'list',
      meta: {
        title: '核销列表'
      },
      component: () =>
        import(/* webpackChunkName: "page/coupon/verification/routerView" */ 'page/coupon/verification/routerView'),
      children: [
        {
          path: '/',
          name: '核销列表集合',
          meta: {
            title: '核销列表集合'
          },
          component: () =>
            import(/* webpackChunkName: "page/coupon/verification/index" */ 'page/coupon/verification/index')
        }
      ]
    },
    {
      path: 'rules',
      name: '优惠券规则',
      redirect: 'rules',
      meta: {
        title: '优惠券规则'
      },
      component: () =>
        import(/* webpackChunkName: "page/coupon/rules/routerView" */ 'page/coupon/rules/routerView'),
      children: [
        {
          path: '/',
          name: '优惠券规则列表',
          meta: {
            title: '优惠券规则列表'
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
    return '/coupon/' + route.path
  }
}

export default router
