import Vue from "vue";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import App from "./App";
import router from "./router";
import axios from "axios";

// 添加请求拦截器
// axios.interceptors.request.use(
//     function(config) {
//         // 在发送请求之前添加前缀
//         console.log(config);
//         return config;
//     },
//     function(error) {
//         // 对请求错误做些什么
//         return Promise.reject(error);
//     }
// );

Vue.prototype.$axios = axios;
Vue.use(MintUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    render: h => h(App)
});