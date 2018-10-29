let router = {
  path: 'verify',
  redirect: 'verify',
  name: '核销',
  meta: {
    title: '核销',
    permission: ''
  },
  component: () =>
    import(/* webpackChunkName: "page/verify/verifyView" */ 'page/verify/verifyView'),
  children: [
    {
      path: 'list',
      name: '核销列表',
      redirect: 'list',
      meta: {
        title: '核销列表'
      },
      component: () =>
        import(/* webpackChunkName: "page/verify/verification/routerView" */ 'page/verify/verification/routerView'),
      children: [
        {
          path: '/',
          name: '核销列表集合',
          meta: {
            title: '核销列表集合'
          },
          component: () =>
            import(/* webpackChunkName: "page/verify/verification/index" */ 'page/verify/verification/index')
        },
      ]
    },
    // {
    //   path: 'van',
    //   name: '核销账号',
    //   redirect: 'van',
    //   meta: {
    //     title: '核销账号'
    //   },
    //   component: () =>
    //     import(/* webpackChunkName: "page/verify/verifyAccount/routerView" */ 'page/verify/verifyAccount/routerView'),
    //   children: [
    //     {
    //       path: '/',
    //       name: '核销账号列表',
    //       meta: {
    //         title: '核销账号列表'
    //       },
    //       component: () =>
    //         import(/* webpackChunkName: "page/verify/verifyAccount/index" */ 'page/verify/verifyAccount/index')
    //     },
    //     {
    //       path: 'add',
    //       name: '新建核销账号',
    //       meta: {
    //         title: '新建核销账号',
    //         permission: ''
    //       },
    //       component: () =>
    //         import(/* webpackChunkName: "page/verify/verifyAccount/save" */ 'page/verify/verifyAccount/save')
    //     },
    //     {
    //       path: 'edit/:uid',
    //       name: '编辑核销账号',
    //       meta: {
    //         title: '编辑核销账号告',
    //         permission: ''
    //       },
    //       component: () =>
    //         import(/* webpackChunkName: "page/verify/verifyAccount/save" */ 'page/verify/verifyAccount/save')
    //     }
    //   ]
    // }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    return '/verify/' + route.path
  }
}

export default router
