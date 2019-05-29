import auth from 'service/auth'
let router = {
  path: 'prize',
  name: '奖品管理',
  meta: {
    title: '奖品管理',
    permission: 'shop_prize'
  },
  component: () =>
    import(/* webpackChunkName: "page/prize/prizeView" */ 'page/prize/prizeView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '奖品列表',
        permission: 'shop_prize.batch'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/list/routerView" */ 'page/prize/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品列表详情',
            permission: 'shop_prize.batch.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/index" */ 'page/prize/list/index')
        },
        {
          path: 'save',
          meta: {
            title: '保存奖品',
            permission: 'shop_prize.batch.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/save" */ 'page/prize/list/save')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '修改奖品',
            permission: 'shop_prize.batch.update'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/list/save" */ 'page/prize/list/save')
        }
      ]
    },
    {
      path: 'template',
      meta: {
        title: '奖品模板',
        permission: 'shop_prize.policy'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/template/routerView" */ 'page/prize/template/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品模板详情',
            permission: 'shop_prize.policy.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/template/index" */ 'page/prize/template/index')
        },
        {
          path: 'policy',
          meta: {
            title: '奖品模板子条目列表',
            permission: 'shop_prize.policy.childRead'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/template/policy" */ 'page/prize/template/policy')
        },
        {
          path: 'add',
          meta: {
            title: '子条目增加',
            permission: 'shop_prize.policy.childCreate'
          },
          component: () =>
            import(/* webpackChunkName: "page/prize/template/save" */ 'page/prize/template/save')
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/prize/template/save" */ 'page/prize/template/save'),
          name: '奖品修改',
          meta: {
            title: '奖品增加',
            permission: 'shop_prize.policy.childUpdate'
          }
        }
      ]
    },
    {
      path: 'verifies',
      meta: {
        title: '奖品核销',
        permission: 'shop_prize.coupon'
      },
      component: () =>
        import(/* webpackChunkName: "page/prize/verification/routerView" */ 'page/prize/verification/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品核销详情',
            permission: 'shop_prize.coupon.read'
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
