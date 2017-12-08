/**
 * Created by gan on 2017/11/27.
 */
import api from "@/api/";
import * as types from "../types";
import axios from "axios";
import qs from "qs";
import util from "@/util/";

const store = {
    state: {
        malldata: []
    },
    getters: {},
    mutations: {
        [types.HOME_DATA](state, payload) {
            state.malldata = payload;
        }
    },
    actions: {
        [types.HOME_DATA]({ commit }, vm) {
            util.loadding(vm, true);
            axios
                .get(api.get, {
                    params: {
                        requrl: api.home.index
                    }
                })
                .then(res => {
                    util.loadding(vm, false);
                    commit(types.HOME_DATA, res.data.data);
                })
                .catch(err => {
                    util.loadding(vm, false);
                    console.log("" + err + "");
                });
        }
    }
};
export default store;