/**
 * Created by gan on 2017/11/24.
 */
import api from "@/api/";
import * as types from "../types";
import axios from "axios";
import qs from "qs";

const store = {
    state: {
        loadding: false,
        tabar: true,
        tabarselect: ""
    },
    getters: {},
    mutations: {
        [types.LOADDING_SHOW](state) {
            state.loadding = true;
        },
        [types.LOADDING_HIDE](state) {
            state.loadding = false;
        },
        [types.TABAR_SHOW](state) {
            state.tabar = true;
        },
        [types.TABAR_HIDE](state) {
            state.tabar = false;
        },
        [types.TABAR_SELECT](state, payload) {
            payload != void 0 ?
                (state.tabarselect = payload) :
                (state.tabarselect = "");
        }
    },
    actions: {}
};
export default store;