<template>
  <div class="">
    <mt-header title="我的租赁详情">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <!-- <mt-navbar v-model="selected">
        <mt-tab-item id="1">租机中</mt-tab-item>
        <mt-tab-item id="2">已到期</mt-tab-item>
        <mt-tab-item id="0">已结束</mt-tab-item>
      </mt-navbar> -->
    <div class="mint-navbar">
      <a class="mint-tab-item" :class="{active:currentType==1}" @click="changeTab(1)">
        <div class="mint-tab-item-label">租机中</div>
      </a>
      <a class="mint-tab-item" :class="{active:currentType==2}" @click="changeTab(2)">
        <div class="mint-tab-item-label">已到期</div>
      </a>
      <a class="mint-tab-item" :class="{active:currentType==0}" @click="changeTab(0)">
        <div class="mint-tab-item-label">已结束</div>
      </a>
      <!-- <a class="mint-tab-item" :class="{active:options.status==3}" @click="changeTab(3)">
            <div class="mint-tab-item-label">已结束</div>
          </a>  -->
    </div>
    <div class="lease-order-list">
      <div class="item" v-for="item in leaselist">
        <div class="item-head">
          <span class="left number">订单编号：{{item.sn}}</span>
          <span class="right deadline">本期使用剩余：{{item.surplusDay}}天</span>
        </div>
        <div class="item-body" @click="$router.push({path:'/leasedetail',query:{sn:item.sn}})">
          <div class="img">
            <img :src="item.img" alt="">
          </div>
          <div class="content">
            <div class="title">{{item.name}}</div>
            <div class="txt1 spec">规格：{{item.specs}}</div>
            <div class="txt1 service">服务说明：{{item.serviceList}}</div>
            <div class="txt2 rent">月租：￥{{item.salePrice}}</div>
            <div class="txt2 start-time">起租时间：{{item.startDate}}</div>
            <div class="txt2 end-time">结束时间：{{item.endDate}}</div>
          </div>
        </div>
        <div class="item-foot">
          <span>共1件，租期：{{item.leaseMonth}}个月，总租金额：¥{{item.totalPay||0}}</span>
        </div>
        <div class="item-link-btn">
          <a @click="$router.push({path:'/leasedetail',query:{sn:item.sn}})">订单待还详情</a>
        </div>
      </div>
      <t-empty :is-show="leaseLen == 0" :empty-text="emptyText" :empty-text2="emptyText2" :link-url="linkUrl"></t-empty>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import tEmpty from "@/components/common/empty"; //暂无数据
export default {
  data() {
    return {
      emptyText: "暂无租赁记录",
      emptyText2: "去看看您想要租用的商品吧",
      linkUrl: "/home",
      leaselist: [],
      currentType: 1,
      leaseLen: 0,
      services: "" //服务说明
    };
  },
  created() {
    this.getleaseList();
  },
  mounted() {
    var vm = this;
  },
  methods: {
    changeTab(type) {
      var vm = this;
      vm.currentType = type;
      vm.getleaseList();
    },
    getleaseList() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.order.leaselist,
            periodType: vm.currentType,
            pageIndex: 1,
            pageSize: 100
          }
        })
        .then(res => {
          console.log(res);
          let list = res.data.list;
          vm.leaselist = list;
          vm.leaseLen = list.length;
          if (list.length > 0) {
            list.forEach(e => {
              vm.$set(e, "serviceList", vm.getServices(e.serviceList));
            });
          }
        });
    },
    getServices(serviceList) {
      var vm = this;
      if (serviceList && serviceList.length > 0) {
        serviceList.forEach(e => {
          vm.services += "," + e.serviceName;
        });
      }
      return vm.services.substring(1);
    }
  },
  components: {
    tEmpty
  }
};
</script>

<style scoped lang="scss" >
@import "../../assets/css/order";
.lease-order-list {
  .item {
    margin-top: 10px;
    color: $fontC;
    &-head,
    &-foot,
    &-link-btn {
      border: 1px solid #eee;
      border-left: none;
      border-right: none;
    }
    &-body {
      display: flex;
      background-color: #fff;

      padding: 0 16px;
      height: 200px;
      .img {
        display: flex;
        justify-content: center;
        margin-top: 8px;
      }
      img {
        width: 72px;
        height: 72px;
      }
      .content {
        flex: 1;
        padding: 8px;
        color: #333;
        > div {
          line-height: 24px;
        }
        .title {
          font-size: 14px; /*no*/
          color: inherit;
        }
        .txt1 {
          font-size: 12px;
          color: #999;
          letter-spacing: 0;
          line-height: 18px;
        }
        .service {
          max-height: 72px;
          overflow: hidden;
        }
      }
    }
    &-head {
      display: flex;
    }
    &-head,
    &-foot,
    &-link-btn {
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      padding: 0 16px;
      > span {
        font-size: 12px;
      }
      .right {
        flex: 1;
      }
      .left {
        width: 60%;
      }
      span.right {
        text-align: right;
        color: #666;
      }
    }
    &-foot {
      text-align: right;
    }
    &-link-btn {
      border-top: none;
      text-align: right;
      a {
        text-align: center;
        border: 1px solid #999999;
        border-radius: 2px;
        height: 30px;
        line-height: 30px;
        padding: 5px 17px;
        margin-top: 5px;
        font-size: 14px;
        color: #999999;
      }
    }
  }
}
</style>
