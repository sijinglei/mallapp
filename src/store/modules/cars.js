/**
 * Created by gan on 2017/11/30.
 */
import api from "@/api/";
import * as types from "../types";
import axios from "axios";
import qs from "qs";
import util from "@/util/";

const store = {
  state: {
    carslist: {},
    popupVisible:false,
  },
  getters: {},
  mutations: {
    [types.CAR_EDIT](state,payload){
      state.carslist=payload;
    }
  },
  actions: {

  }
};
export default store;
