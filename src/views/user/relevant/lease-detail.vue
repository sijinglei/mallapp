<template>
  <section>
    <div class="lease-head">
      <mt-header :title="title">
        <a slot="left" @click="$router.go(-1)">
          <mt-button icon="back">返回</mt-button>
        </a>
      </mt-header>
      <div class="lease-detail">
        <div class="order-sn">
          <p>订单编号：
            <span>{{sn}}</span>
          </p>
        </div>
        <div class="order-money">
          <div class="amount-any">
            <p class="tip">订单总租金额</p>
            <p class="money">{{detail.orderTotal}}</p>
          </div>
          <div class="amount-any">
            <p class="tip">当前已还</p>
            <p class="money">{{detail.paidAmount}}</p>
          </div>
          <div class="amount-any">
            <p class="tip">全部待还(元)</p>
            <p class="money">{{detail.pendingAmount||0}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="lease-table">
      <dl>
        <dt>
          <div class="col1">租期</div>
          <div class="col2">每期订单总额</div>
          <div class="col3">每期付款日</div>
        </dt>
        <dd v-for="(item,index) in detail.eachRepayList" @click="selectCurrent(item,index)" :class="{selected:item.status==0 }">
          <div class="row" :class="{yihuan:item.status==1}">
            <div class="col1">
              <span class="cir" v-if="item.status==1">
                {{item.sortNo}}
              </span>
              <span class="mint-checkbox" v-else>
                <input type="checkbox" class="mint-checkbox-input" value="" :checked="item.checked">
                <span class="mint-checkbox-core"></span>
              </span>
            </div>
            <div class="col2">￥{{item.eachRepay}}</div>
            <div class="col3">{{item.startDate}} {{item.status==1?'已还':'待还'}}</div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="lease-foot">
      <div class="bot-info">
        <span class="mint-checkbox" @click="checkAll()">
          <input type="checkbox" class="mint-checkbox-input" value="" :checked="isCheckAll">
          <span class="mint-checkbox-core"></span>
        </span>
        <span>已选
          <i v-model="checkAmount">{{checkAmount}}</i>
        </span>
      </div>
      <a @click="wechatpay" class="btn-hk">立即还款</a>
    </div>
  </section>
</template>
<script>
import { Toast } from "mint-ui";
import api from "@/api";
const wx = require("weixin-js-sdk");

export default {
  data() {
    return {
      title: "订单待还详情",
      sn: "",
      detail: {
        orderTotal: 0, //订单总租金额
        paidAmount: 0, //已支付金额
        pendingAmount: 0, //待支付金额
        eachRepayList: [], //支付集合
        sortNoint: 0, //期数
        status: 0, // 是否支付 0 未支付 1已支付
        startDate: "", //每期还款日
        eachRepay: 0 //支付金额
      },
      checkAmount: 0,
      isCheckAll: true,
      maxCheckIndex: 0,
      maxMonth: 0 //分期订单支付到的月份，分期租赁确认收货后支付时需传入勾选的最大月份
    };
  },
  created() {
    var vm = this;
    vm.sn = vm.$route.query.sn;
    vm.getLeaseDetail();
  },
  methods: {
    getLeaseDetail() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.order.leaserepay,
            sn: vm.sn
          }
        })
        .then(res => {
          console.log(res);
          vm.detail = res.data;
          if (vm.detail && vm.detail.eachRepayList.length > 0) {
            vm.checkAll();
            console.log(vm.detail);
          }
        });
    },
    selectCurrent(item, index) {
      var vm = this,
        tempAmount = 0;
      if (index >= vm.maxCheckIndex) {
        if (item.status == 0) {
          if (!item.checked) {
            vm.checkAmount = 0;
            tempAmount = parseFloat(vm.checkAmount + item.eachRepay);
            item.checked = true;
            vm.maxCheckIndex = index;
            //获取到当前索引的集合
            var newlist = vm.detail.eachRepayList.slice(0, index);
            newlist.forEach((d, n) => {
              d.checked = true;
              if (d.status == 0) {
                tempAmount += parseFloat(d.eachRepay);
              }
              newlist.splice(n, 1, d);
            });
            vm.detail.eachRepayList.splice(0, index, ...newlist);
          } else {
            tempAmount = parseFloat(vm.checkAmount - item.eachRepay);
            item.checked = false;
            vm.maxCheckIndex--;
          }
          vm.checkAmount = parseFloat(tempAmount.toFixed(2));
          vm.$set(vm.detail.eachRepayList, index, item);
        }
      }
    },
    checkAll() {
      var vm = this,
        newList = [];
      vm.checkAmount = 0; //全选时重新赋值0
      vm.maxCheckIndex = !vm.isCheckAll
        ? vm.detail.eachRepayList.length - 1
        : 0;

      if (vm.detail.eachRepayList.length > 0) {
        vm.detail.eachRepayList.forEach(item => {
          item.checked = !vm.isCheckAll;
          newList.push(item);
          vm.calculatAmount(item);
        });

        vm.$set(vm.detail, "eachRepayList", newList);
      }
    },
    /**
     * 计算总额
     */
    calculatAmount(item) {
      var vm = this,
        tempAmount = 0;
      if (item.status == 0) {
        if (item.checked) {
          tempAmount = parseFloat(vm.checkAmount + item.eachRepay);
        } else {
          tempAmount = 0;
        }
        vm.checkAmount = parseFloat(tempAmount.toFixed(2));
      }
    },
    /**@augments
     * 微信付款
     */
    wechatpay() {
      var vm = this;
      var eachRepayList = vm.detail.eachRepayList;
      if (eachRepayList && eachRepayList.length > 0) {
        vm.maxMonth = parseInt(
          new Date(eachRepayList[vm.maxCheckIndex].startDate).getMonth() + 1
        );
        vm.$axios
          .get(api.get, {
            params: {
              requrl: api.order.wechatpay,
              sn: vm.sn,
              maxMonth: vm.maxMonth
            }
          })
          .then(res => {
            console.log("•订单微信支付");
            console.log(res);
            var data = res.data;
            wx.config({
              // debug: true,
              appId: data.appid,
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.sign,
              jsApiList: ["chooseWXPay"]
            });
            wx.ready(() => {
              this._setWxpayInfo(data);
            });
          });
      } else {
        Toast({
          message: "没有待还金额",
          position: "bottom"
        });
      }
    },
    _setWxpayInfo(data) {
      wx.chooseWXPay({
        appId: data.appid,
        timeStamp: data.timestamp,
        nonceStr: data.noncestr,
        paySign: data.sign,
        signType: "MD5",
        package: "prepay_id=" + data.prepayid, //h5必须这么写  //"Sign=WXPay"这种是app的写法
        success(res) {
          if (res.errMsg === "chooseWXPay:ok") {
            Toast({
              message: "支付成功",
              position: "bottom"
            });
            window.location.reload(); //跳转到支付成功页面
          } else {
            Toast({
              message: "支付失败",
              position: "bottom"
            });
            window.location.reload(); //跳转到支付失败页面
          }
        },
        cancel() {
          Toast({
            message: "支付取消",
            position: "bottom"
          });
          window.location.reload(); //跳转到支付失败页面
        },
        error(res) {
          Toast({
            message: "支付失败",
            position: "bottom"
          });
          window.location.reload(); //
        }
      });
    }
  },

  watch: {
    "detail.eachRepayList"(newObj, oldObj) {
      var vm = this;
      newObj.forEach(item => {
        if (!item.checked) {
          vm.isCheckAll = false;
        } else {
          vm.isCheckAll = true;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/order";
.lease-head {
  z-index: 9;
  position: fixed;
  width: 100%;
  .lease-detail {
    width: 100%;
    height: 133px; /*no*/
    background: url("../../../assets/images/lease-bg.png") no-repeat;
    background-size: cover;
    background-position: center center;
    box-sizing: border-box;
    padding: 16px; /*no*/
    .order-sn {
      width: 60%;
      margin: 0 auto;
      height: 20px; /*no*/
      p {
        text-align: center;
        font-size: 14px; /*no*/
        color: #fff;
        position: relative;
        span {
          color: #f8e81c;
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          height: 1px;
          width: 20px; /*no*/
          opacity: 0.6;
          background: #fff;
          top: 7px;
        }
        &::before {
          left: -25px; /*no*/
        }
        &::after {
          right: -25px; /*no*/
        }
      }
    }
    .order-money {
      display: flex;
      margin-top: 16px; /*no*/
      justify-content: center;
      align-items: center;
      > div {
        flex: 1;
        color: #fff;
        p {
          text-align: center;
        }
        .tip {
          font-size: 12px; /*no*/
          color: #d9f1dd;
        }
        .money {
          margin-top: 8px; /*no*/
          font-size: 28px; /*no*/
          color: #fff;
        }
      }
    }
  }
}
.lease-table {
  background: #fff;
  padding-top: 181px; /*no*/
  margin-bottom: 58px; /*no*/
  .col1 {
    float: left;
    width: 20%;
    box-sizing: border-box;
  }
  .col-com {
    float: left;
    text-align: left;
    width: 40%;
  }
  .col2 {
    @extend .col-com;
  }
  .col3 {
    @extend .col-com;
    box-sizing: border-box;
    text-align: right;
    padding-right: 16px;
  }
  dl {
    width: 100%;
  }
  .bt-line {
    border-bottom: 1px solid #f3f3f3;
    font-size: 12px;
    color: #999;
  }
  dt {
    height: 30px;
    line-height: 30px;
    @extend .bt-line;
    .col1 {
      padding-left: 16px; /*no*/
    }
    .col2 {
      box-sizing: border-box;
      padding-left: 16px;
    }
  }
  dd {
    padding-left: 16px;
    color: #333;
    .row {
      height: 54px; /*no*/
      line-height: 54px; /*no*/
      @extend .bt-line;
      color: #333;
    }
    .yihuan {
      color: #999;
      .col2 {
        color: #999;
      }
    }
    &:last-child {
      border-bottom: none;
    }
    .col1 {
      color: inherit;
      .cir {
        display: block;
        width: 20px; /*no*/
        height: 20px; /*no*/
        border-radius: 50%;
        color: #999;
        font-size: 14px; /*no*/
        text-align: center;
        line-height: 20px; /*no*/
        margin-top: 16px;
        background: #f3f3f3;
      }
    }
    .col2 {
      color: #ff7733;
    }
    .col3 {
      color: inherit;
    }
  }
}
.lease-foot {
  position: fixed;
  width: 100%;
  bottom: 0;
  background: #fff;
  height: 48px; /*no*/
  line-height: 48px; /*no*/
  border-top: 1px solid rgba(232, 232, 232, 0.9);
  .bot-info {
    float: left;
    width: 60%;
    box-sizing: border-box;
    padding-left: 16px;
    i {
      list-style: none;
      font-size: 18px;
      color: #ff7733;
      position: relative;
      padding-left: 10px;
      &::before {
        content: "￥";
        display: block;
        position: absolute;
        width: 10px;
        height: 20px;
        top: -7px;
        left: 0px;
        font-size: 12px;
      }
    }
  }
  .btn-hk {
    float: right;
    display: block;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.19px;
    width: 113px; /*no*/
    height: 48px; /*no*/
    background: #ff7733;
  }
}
</style>
