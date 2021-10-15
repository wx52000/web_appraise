// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import router from './router'
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import * as Echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import '../static/css/suspension.css'
import 'babel-polyfill';
import tableText from '../static/js/tableText'
import news from "./components/other/news";
import axios from "./store/httpRequest"
import storage from "./store/index"
import "../src/components/tools/js/timeInit"
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式


Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(tableText);
Vue.use(UmyUi);
Vue.component(news.name,news)
Vue.prototype.$echarts = Echarts
Vue.prototype.$storage = storage;
Vue.prototype.$baseUrl = 'http://localhost:9999/';
Vue.prototype.$tokenUrl = "http://localhost:9100/";
Vue.prototype.$axios = axios;
// 挂载到$message上
// Vue.prototype.$baseUrl = 'http://10.136.238.22:9999/';
//每月评价开始日期npm
Vue.prototype.startDay = 25;
// 每月评价结束日期
Vue.prototype.endDay = 10;
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

