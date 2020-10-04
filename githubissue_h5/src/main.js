// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import api from './utils/api.js'
import utils from './utils/utils.js'


axios.defaults.baseURL='https://api.github.com'
import axios from 'axios'
Vue.prototype.$api = api
Vue.prototype.$utils = utils

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
