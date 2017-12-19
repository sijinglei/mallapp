/**
 * Created by gan on 2017/12/14.
 */
import api from "@/api/";
import * as types from "../types";
import axios from "axios";
import qs from "qs";
import util from "@/util/";

//订单
const store = {
  state: {
    address:[],//地址
    myCoupon:{},//优惠券
    productscoupon:{}

  },
  getters: {},
  mutations: {
    //设置地址
    [types.SETADDRESS](state,payload){
      state.address=[payload];
    },
    [types.SETMYCOUPONID](state,payload){
      state.myCoupon=payload;
    },
    [types.PRODUCTSCOUPON](state,payload){
      state.productscoupon=payload;
    },

  },
  actions: {

  }
};
export default store;
