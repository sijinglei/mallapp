import Vue from "vue";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import App from "./App";
import router from "./router";
// import axios from "axios";
import store from "@/store/store";
import "./assets/fonts/iconfont.css";
import "lib-flexible";

import axiosPlugin from "./assets/js";
import '../src/assets/js/components'
Vue.use(axiosPlugin);
// Vue.prototype.$axios = axios;
Vue.use(MintUI);

Vue.config.productionTip = false;



/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});

