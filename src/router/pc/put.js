import auth from 'service/auth'
let router = {
  path: 'put',
  name: '投放管理',
  meta: {
    title: '投放管理',
    permission: 'shop_launch'
  },
  component: () =>
    import(/* webpackChunkName: "page/put/putView" */ 'page/put/putView'),
  children: [
    {
      path: 'list',
      meta: {
        title: '节目投放',
        permission: 'shop_launch.project'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/list/routerView" */ 'page/put/list/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '节目投放列表',
            permission: 'shop_launch.project.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/list/index" */ 'page/put/list/index')
        },
        {
          path: 'save',
          meta: {
            title: '节目投放新增',
            permission: 'shop_launch.project.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/list/save" */ 'page/put/list/save')
        }
      ]
    },
    {
      path: 'accredit',
      meta: {
        title: '授权投放',
        permission: 'shop_launch.wechat'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/accredit/routerView" */ 'page/put/accredit/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '授权投放列表',
            permission: 'shop_launch.wechat.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/accredit/index" */ 'page/put/accredit/index')
        },
        {
          path: 'save',
          meta: {
            title: '授权投放新增',
            permission: 'shop_launch.wechat.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/accredit/save" */ 'page/put/accredit/save')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '授权投放编辑',
            permission: 'shop_launch.wechat.update'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/accredit/save" */ 'page/put/accredit/save')
        }
      ]
    },
    {
      path: 'prize',
      meta: {
        title: '奖品投放',
        permission: 'shop_launch.prize'
      },
      component: () =>
        import(/* webpackChunkName: "page/put/prize/routerView" */ 'page/put/prize/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '奖品投放列表',
            permission: 'shop_launch.prize.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/prize/index" */ 'page/put/prize/index')
        },
        {
          path: 'save',
          meta: {
            title: '奖品投放新增',
            permission: 'shop_launch.prize.create'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/prize/save" */ 'page/put/prize/save')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '奖品投放编辑',
            permission: 'shop_launch.prize.update'
          },
          component: () =>
            import(/* webpackChunkName: "page/put/prize/save" */ 'page/put/prize/save')
        }
      ]
    },
    {
      path: 'adPut',
      meta: {
        title: '广告投放',
      },
      component: () =>
        import(/* webpackChunkName: "page/put/adPut/routerView" */ 'page/put/adPut/routerView'),
      children: [
        {
          path: '/',
          meta: {
            title: '广告投放列表',
          },
          component: () =>
            import(/* webpackChunkName: "page/put/adPut/index" */ 'page/put/adPut/index')
        },
        {
          path: 'save',
          meta: {
            title: '广告投放新增',
          },
          component: () =>
            import(/* webpackChunkName: "page/put/adPut/save" */ 'page/put/adPut/save')
        },
        {
          path: 'edit/:uid',
          meta: {
            title: '广告投放编辑',
          },
          component: () =>
            import(/* webpackChunkName: "page/put/adPut/save" */ 'page/put/adPut/save')
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/put/' + route.path
    }
  }
}

export default router
