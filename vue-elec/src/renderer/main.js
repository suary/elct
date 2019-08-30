import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';

import cio from 'socket.io-client';
import 'element-ui/lib/theme-chalk/index.css';

const ip = require('ip');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$ip = ip
Vue.prototype.$io = require('socket.io')
Vue.prototype.$cio = cio
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false
Vue.use(ElementUI);




/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
