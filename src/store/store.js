/**
 * Created by gan on 2017/11/24.
 */
import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
import home from "./modules/home";
import order from "./modules/order";
import cars from "./modules/cars";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    mutations: {},
    modules: {
        common,
        home,
        order,
       cars
    }
});

export default store;
