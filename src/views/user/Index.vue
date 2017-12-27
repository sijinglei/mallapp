<template>
  <div class="mine-wrap">
    <div class="person">

      <router-link to="/login" v-show="userinfo.nickname==''">
        <div class="photo">
          <img src="../../assets/images/head.png" alt="">
        </div>
        <p class="name">登录账号</p>
      </router-link>
      <router-link to="/center" v-show="userinfo.nickname!=''">
        <div class="photo">
          <img :src="userinfo.portraitSuffix==''?require('../../assets/images/head.png'):userinfo.portraitSuffix" alt="">
        </div>
        <p class="name">{{userinfo.nickname}}</p>
      </router-link>
    </div>
    <mt-cell title="租赁信用认证" to="/" is-link :value="caStatusDescribe">
    </mt-cell>
    <mt-cell title="我的租赁详情" is-link to="/lease">
      <span style="color: green"></span>
    </mt-cell>

    <mt-cell title="租赁订单" is-link to="orderlist/2/0">
    </mt-cell>
    <div class="mint-cell cell-group">
      <a href="javascript:;"></a>
      <router-link to="orderlist/2/1">
        <span class="icon-wrap">
          <i class="icon icon-payment"></i>
          <span class="cnt" v-show="leasePendingAmount>0">{{leasePendingAmount}}</span>
        </span>
        <span class="link-txt">待付款</span>
      </router-link>
      <router-link to="orderlist/2/3">
        <span class="icon-wrap">
          <i class="icon icon-waittake"></i>
          <span class="cnt" v-show="leaseReceivedAmount>0">{{leaseReceivedAmount}}</span>
        </span>
        <span class="link-txt">待收货</span>
      </router-link>
      <router-link to="orderlist/2/4">
        <span class="icon-wrap">
          <i class="icon icon-complete"></i>
          <span class="cnt" v-show="false"></span>
        </span>
        <span class="link-txt">已完成</span>
      </router-link>
      <a href="javascript:;"></a>
    </div>
    <mt-cell title="普通订单" is-link to="/orderlist/1/0">
    </mt-cell>
    <div class="mint-cell cell-group">
      <a href="javascript:;"></a>
      <router-link to="/orderlist/1/1">
        <span class="icon-wrap">
          <i class="icon icon-payment"></i>
          <span class="cnt" v-show="pendingAmount>0">{{pendingAmount}}</span>
        </span>
        <span class="link-txt">待付款
        </span>
      </router-link>
      <router-link to="/orderlist/1/3">
        <span class="icon-wrap">
          <i class="icon icon-waittake"></i>
          <span class="cnt" v-show="receivedAmount>0">{{receivedAmount}}</span>
        </span>
        <span class="link-txt">待收货</span>
      </router-link>
      <router-link to="/orderlist/1/4">
        <span class="icon-wrap">
          <i class="icon icon-complete"></i>
          <span class="cnt" v-show="false"></span>
        </span>
        <span class="link-txt">已完成</span>
      </router-link>
      <a href="javascript:;"></a>
    </div>
    <mt-cell title="我的优惠券" is-link to="/coupon2" :value="couponAmount">
    </mt-cell>
    <mt-cell title="收货地址" is-link to="/address">
    </mt-cell>
    <mt-cell title="帮助中心" is-link to="../HelpCenter">
    </mt-cell>
    <mt-cell title="在线客服" is-link to="/service">
    </mt-cell>
    <mt-cell title="设置" is-link to="/setting">
    </mt-cell>

    <t-tabar :selected="selected"></t-tabar>
  </div>
</template>

<script>
import tTabar from "@/components/common/tabar";
import api from "@/api";
import com from "@/api/common";

export default {
  data() {
    return {
      selected: "UserIndex",
      userinfo: {
        nickname: "",
        portraitSuffix: ""
      },
      memberId: "", //用户Id
      pendingAmount: 0, //普通订单待付款数量
      receivedAmount: 0, //普通订单待收货数量
      leasePendingAmount: 0, //租赁订单待付款数量
      leaseReceivedAmount: 0, //租赁订单待收货数量
      couponAmount: 0, //优惠券数量
      caStatus: 0, //认证状态（0 未认证 ，1 待审核，2 审核中，5 已拒绝，6已通过）
      caStatusDescribe: "" //认证状态描述
    };
  },
  created() {
    this.userinfo = com.getSession("loginUserBaseInfo")
      ? JSON.parse(com.getSession("loginUserBaseInfo"))
      : this.userinfo;
    console.log(this.userinfo);
  },
  mounted: function() {
    var vm = this;
    vm.getOrderAmount();
  },
  methods: {
    getOrderAmount() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.order.amount
          }
        })
        .then(res => {
          console.log(res);
          var data = res.data;
          vm.memberId = data.member_id;
          vm.caStatus = data.caStatus;
          vm.caStatusDescribe = data.caStatusDescribe;
          vm.couponAmount = data.couponAmount;
          vm.leasePendingAmount = data.leasePendingAmount;
          vm.leaseReceivedAmount = data.leaseReceivedAmount;
          vm.pendingAmount = data.pendingAmount;
          vm.receivedAmount = data.receivedAmount;
        });
    }
  },
  components: { tTabar }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/minx";
@import "../../assets/fonts/iconfont.css";
.person {
  height: 180px;
  background-image: linear-gradient(-180deg, #3a9fff 0%, #1c83ff 98%);
  background: url("../../assets/images/person-bg.png") no-repeat;
  background-size: cover;
  text-align: center;
  color: #fff;
  padding-top: 30px;
  .name {
    margin-top: 10px;
  }
  .photo {
    height: 100px;
    width: 100px;
    margin: 0 auto;
    border-radius: 50%;
    margin-bottom: 5px;
    background-image: linear-gradient(
      -180deg,
      rgba(71, 153, 108, 0) 2%,
      #5dbb87 100%
    );
  }
  img {
    z-index: 2;
    height: 88px;
    width: 88px;
    margin-top: 6px;
    border-radius: 50%;
  }
  a {
    display: block;
    color: inherit;
    font-size: 16px;
  }
}
.mine-wrap {
  padding-bottom: 48px;
}
.icon {
  color: #333;
  font-size: 24px; /*no*/
}
.mint-cell {
  margin-bottom: 10px;
}

.cell-group {
  margin-top: -10px;
  border-top: 1px solid #d9d9d9;
  /*no*/
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    display: inline-block;
    flex: 1;
    height: 50px;
    text-align: center;
    .icon-wrap {
      display: block;
      width: 30px; /*no*/
      height: 20px; /*no*/
      margin: 5px auto;
      position: relative;
      .cnt {
        position: absolute;
        width: 18px; /*no*/
        height: 18px; /*no*/
        line-height: 18px; /*no*/
        background-color: red;
        border-radius: 50%;
        color: #fff;
        font-size: 10px; /*no*/
        text-align: center;
        top: -2px; /*no*/
        right: -2px; /*no*/
      }
    }
    .link-txt {
      font-size: 14px; /*no*/
      color: #333;
    }
  }
}
</style>
