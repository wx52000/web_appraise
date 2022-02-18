// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import router from './router'
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import * as Echarts from 'echarts';
import VueContextMenu from 'vue-contextmenu'
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import './assets/css/suspension.css'
import 'babel-polyfill';
import tableText from './assets/js/tableText'
import news from "./components/other/News";
import axios from "./store/httpRequest"
import storage from "./store/index"
import myMethod from "./store/myMethod";
import elDragDialog from "./assets/js/el-dragDialog";
import "../src/components/tools/js/timeInit"
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式


Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(tableText);
Vue.use(UmyUi);
Vue.use(VueContextMenu)
Vue.component(news.name,news)
Vue.directive('elDragDialog',elDragDialog)
Vue.prototype.$echarts = Echarts
Vue.prototype.$storage = storage;
Vue.prototype.$myMethod = myMethod;
Vue.prototype.$baseUrl = 'http://localhost:9999/api/';
// Vue.prototype.$baseUrl = 'http://192.168.137.87:9999/api/';
Vue.prototype.$axios = axios;
// Vue.prototype.$baseUrl = 'http://10.136.238.22:9999/api/';
Array.prototype.push2 =function(){
  for(let i=0; i<arguments.length; i++){
    let ele =  arguments[i];
    if(JSON.stringify(this).indexOf(JSON.stringify(ele)) == -1){
      this.push(ele);
    }
  }
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App},
  template: '<App/>',
  render: h => h(App),
})

