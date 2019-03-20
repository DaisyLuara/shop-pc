import pcHome from 'page/home'
import account from 'router/pc/account'
// import ad from 'router/pc/ad'
// import resource from 'router/pc/resource'
import auth from 'router/pc/auth'
import site from 'router/pc/site'
import smart from 'router/pc/smart'
import put from 'router/pc/put'
import prize from 'router/pc/prize'
import report from 'router/pc/report'

export default {
  path: '/',
  name: 'pc站',
  component: pcHome,
  meta: {
    // permission: 'main',
  },
  children: [account, auth, site, smart, prize, put, report]
}
