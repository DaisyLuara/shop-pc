import pcHome from 'page/home'
import account from 'router/pc/account'
import ad from 'router/pc/ad'
import resource from 'router/pc/resource'
import point from 'router/pc/point'
import report from 'router/pc/report'
import verify from 'router/pc/verify'

export default {
  path: '/',
  name: 'pc站',
  component: pcHome,
  meta: {
    // permission: 'main',
  },
  children: [account, ad, resource, point, report, verify]
}
