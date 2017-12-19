<template>
  <section>
    <a class="btn btn-default" v-show="status==1" @click="cancelOrder">取消订单</a>
    <a class="btn btn-orange" v-show="status==1" @click="nowPayment">立即付款</a>
    <a class="btn btn-default" v-show="status==3" @click="viewLogistics">查看物流</a>
    <a class="btn btn-danger" v-show="status==3" @click="Receipt">确认收货</a>
    <a class="btn btn-danger" v-show="status==4&&orderType==1" @click="reBuy">再次购买</a>
    <a class="btn btn-danger" v-show="status==5&&orderType==1" @click="reBuy">重新购买</a>

    <!-- <a class="btn btn-default" v-show="status==5" @click="deleteOrder">删除订单</a> -->
    <a class="btn btn-redanger" v-show="status==4&&orderType==2" @click="reBuy">再新租赁</a>
    <a class="btn btn-redanger" v-show="status==5&&orderType==2" @click="reBuy">重新租赁</a>

    <mt-popup v-model="sheetVisible" popup-transition="popup-bottom" position="bottom">
      <div class="sheetVisible">
        <div class="cancel-head">
          取消订单
          <i class="cancel"></i>
        </div>
        <div class="cancal-title">
          <p class="tip-top">取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
          <p class="tip-bot">请选择取消订单的原因（必选）</p>
        </div>
        <div class="cancel-body">
          <mt-radio align="right" title="" v-model="value" :options="options">
          </mt-radio>
        </div>
      </div>
      <div class="cancel-btn" @click="confirmClick">确定</div>
    </mt-popup>
  </section>
</template>
<script>
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
import { mapMutations } from "vuex";
import api from "@/api";
export default {
  props: ["status", "sn", "orderType", "productData", "leaseMonth"],
  data() {
    return {
      value: "配送信息有误",
      sheetVisible: false,
      options: [
        {
          label: "配送信息有误",
          value: "配送信息有误"
        },
        {
          label: "忘记使用优惠券",
          value: "忘记使用优惠券"
        },
        {
          label: "商品买错了",
          value: "商品买错了"
        },
        {
          label: "重复下单/误下单",
          value: "重复下单/误下单"
        },
        {
          label: "不想买了",
          value: "不想买了"
        },
        {
          label: "其他原因",
          value: "其他原因"
        }
      ],
      formProducts: []
    };
  },
  methods: {
    /**@augments
     * 取消订单 
     * status(0:所有订单 1：待付款 2：待发货 3：待收货 4:已完成 5:已取消 6:售后)
     */
    confirmClick() {
      var vm = this;
      vm.$axios
        .post(api.post, {
          requrl: api.order.cancel,
          sn: vm.sn,
          remark: vm.value
        })
        .then(res => {
          vm.sheetVisible = false;
          console.log(res);
          if (res.code == 999) {
            vm.$router.go(-1);
          } else {
            console.log(res.message);
          }
        });
    },
    /**@augments
     * 取消订单/租赁
     */
    cancelOrder() {
      this.sheetVisible = true;
    },
    /**@augments
     * 立即付款
     */
    nowPayment() {},
    /**@augments
     * 查看物流
     */
    viewLogistics() {
      this.$router.push({ path: "/ordertracking", query: { sn: this.sn } });
    },
    /**@augments
     * 确认收货
     */
    Receipt() {
      var vm = this;
      MessageBox({
        title: "",
        message: "您确定要确认收货吗?",
        showCancelButton: true,
        confirmButtonClass: "confirm-btn",
        cancelButtonClass: "confirm-btn"
      }).then(action => {
        if (action == "confirm") {
          vm.$axios
            .post(api.post, {
              requrl: api.order.receive,
              sn: vm.sn
            })
            .then(res => {
              vm._alert("收货成功");
              location.reload();
            });
        }
      });
    },
    /**@augments
     * 重新购买（租赁）/再次购买（租赁）
     * 
     */
    reBuy() {
      var vm = this,
        requrl = api.cart.addbatch;
      if (vm.productData && vm.productData.length > 0) {
        vm.formProducts = [];
        console.log(vm.productData);
        vm.productData.forEach(p => {
          var obj = {
            productId: p.productId,
            num: p.productCount
          };
          if (vm.orderType == 2) {
            //如果是租赁订单
            let serviceIds = [];
            requrl = api.order.preadd;
            obj.leaseMonth = vm.leaseMonth;
            if (p.serviceList && p.serviceList.length > 0) {
              p.serviceList.forEach(item => {
                serviceIds.push(item.serviceId);
              });
            }
            obj.serviceIds = serviceIds;
          }
          console.log(obj);
          vm.formProducts.push(obj);
        });
        vm.$axios
          .post(api.post, {
            requrl: requrl,
            data: vm.formProducts
          })
          .then(res => {
            if (vm.orderType == 1) {
              vm.$router.push({ path: "/cars" });
            } else {
              console.log("租赁数据");
              console.log(res);
              //将下单数据存入vuex
              vm.$store.commit("PRODUCTDATE", res.data);
              window.localStorage.setItem(
                "PRODUCTDATE",
                JSON.stringify(res.data)
              );
              vm.$router.push({ name: "productfill" });
            }
          });
      }
    },
    /**@augments
     * 删除订单
     */
    deleteOrder() {},
    _alert(msg) {
      Toast(msg);
    }
  },
  computed: {}
};
</script>

<style  lang="scss">
.mint-popup {
  width: 100%;
}
.cancel-head {
  height: 48px;
  line-height: 48px;
  position: relative;
  text-align: center;
  font-size: 16px;
  color: #333;
}
.sheetVisible {
  .cancal-title {
    padding: 0 16px;
    height: 81px;
    line-height: 22px;
    text-align: left;
    border-top: 1px solid #f0f0f0;
    .tip-top {
      margin-top: 9px;
      font-size: 14px;
      color: #333;
      letter-spacing: 0.17px;
    }
    .tip-bot {
      font-size: 12px;
      color: #999;
      letter-spacing: 0.14px;
    }
  }
  .cancel-body {
    text-align: left;
    min-height: 36px;
    border-top: 1px solid #f0f0f0;
    font-size: 14px;
    color: #333;
    letter-spacing: 0.17px;
  }
}
.mint-radiolist-title {
  margin: 0;
}
.mint-cell {
  min-height: 36px;
  border-bottom: 1px solid #f0f0f0;
}
.mint-radio-input:checked + .mint-radio-core {
  background-color: #42bd56;
  border-color: #42bd56;
}
.mint-radio-core {
  display: inline-block;
  background-color: #fff;
  border-radius: 100%;
  border: 1px solid #ccc;
  position: relative;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.mint-radio-input:checked + .mint-radio-core:after {
  border-color: #fff;
  background-color: #42bd56;
  -webkit-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}
.mint-radio-core:after {
  border: 2px solid transparent;
  border-left: 0;
  border-top: 0;
  content: " ";
  top: 3px;
  left: 6px;
  position: absolute;
  width: 4px;
  height: 8px;
  border-radius: 0;
  -webkit-transform: rotate(45deg) scale(0);
  transform: rotate(45deg) scale(0);
  -webkit-transition: -webkit-transform 0.2s;
  transition: -webkit-transform 0.2s;
  transition: transform 0.2s;
  transition: transform 0.2s, -webkit-transform 0.2s;
}
.cancel-btn {
  @extend .cancel-head;
  background: #42bd56;
  color: #fff;
}
.btn {
  border: 1px solid #999999; /*no*/
  border-radius: 2px;
  font-size: 14px;
  color: #999;
  letter-spacing: 0.17px;
  padding: 5px 17px;
}
.btn-default {
  border: 1px solid #999999;
}
.btn-danger {
  border: 1px solid #42bd56;
  color: #fff;
  background-color: #42bd56;
}
.btn-redanger {
  border: 1px solid #42bd56;
  color: #42bd56;
}
.btn-orange {
  border: 1px solid #ff7733;
  color: #fff;
  background-color: #ff7733;
}
.confirm-btn {
  font-size: 17px;
  color: #0076ff;
  letter-spacing: -0.41px;
}
.mint-msgbox-message {
  color: #333;
  font-size: 17px;
}
</style>
