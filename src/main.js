import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import axios from 'axios'

// var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });
axios.defaults.baseURL = "https://autumnfish.cn";
Vue.prototype.axios = axios;
Vue.config.productionTip = false

// 导入element-ui
import ElementUI from 'element-ui'
// 导入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'
// use以下
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

