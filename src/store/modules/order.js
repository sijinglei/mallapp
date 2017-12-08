import api from "@/api/";
import * as types from "../types";
import qs from "qs";
import axios from "axios";

const store = {
    state: {
        loadding: false,
        tabar: true
    },
    getters: {},
    mutations: {
        [types.ORDER_DATA](state, data) {
            state.datalist = data;
        }
    },
    actions: {
        [types.ORDER_DATA]({ commit }, options) {
            console.log("状态里面");
            console.log(options);
        }
    }
};
export default store;