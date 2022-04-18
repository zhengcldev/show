import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import Vuex from 'vuex';
import G from './global';
import qs from 'qs';
import pdf from 'vue-pdf'
// 全局引入echarts
import * as echarts from 'echarts';
import scyEcharts from 'scyecharts';
import VueCookies from "vue-cookies";
import global from "./global";
import {
    postRequest
} from './utils/api.js';
import {
    getRequest
} from './utils/api.js';
import {
    putRequest
} from './utils/api.js';
import {
    deleteRequest
} from './utils/api.js';


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueCookies);
Vue.prototype.$echarts = echarts; // 引入echarts
Vue.use(scyEcharts);
Vue.prototype.pdf = pdf;
Vue.prototype.Global=global;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.qs = qs;
Vue.prototype.NET = G;
Vue.prototype.axios = axios;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    let isLogin = sessionStorage.getItem('isLogin');
    //let isLogin = this.$cookies.get('isLogin');
    //登出
    if (to.path === '/logout') {
        //清空
        this.$cookies.clear();
        sessionStorage.clear();
        //跳转至登陆
        next({
            path: '/login'
        });
    } else if (to.path === 'login') {
        if (isLogin != null) {
            next({
                path: '/home'
            });
        }
    } else if (to.path === '/' && isLogin == null) {
        next({
            path: '/login'
        });
    }
    next();
})


new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
