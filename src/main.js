import 'babel-polyfill'
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import utils from './service/utils'
import VueAxios from 'utils/http'
import VueCookie from 'vue-cookie'

import secondSidebar from 'components/common/secondSidebar'
import headModule from 'components/common/headModule'

import {
  Message,
  Loading,
  Breadcrumb,
  BreadcrumbItem,
  MessageBox
} from 'element-ui'
// import '../theme/index.css'
Vue.use(utils)
Vue.use(VueAxios)
Vue.use(VueCookie)
Vue.use(Loading.directive)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.prototype.$loading = Loading.service
Vue.component('second-sidebar', secondSidebar)
Vue.component('headModule', headModule)

/*重新生成一个vue实例Et--为了同级组件之间的传值*/
window.Et = new Vue()

var app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

export default app
