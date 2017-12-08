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
    <div class="mint-tab-container-wrap">
      <div class="item" v-for="item in leaselist">
        <div class="item-head">
          <span class="left number">订单编号：11977240</span>
          <span class="right deadline">本期使用剩余：28天</span>
        </div>
        <div class="item-body">
          <div class="img">
            <img src="https://isofficepublic-test.oss-cn-shenzhen.aliyuncs.com/mall/img/fec77bc14d2d4201b685d940836d1671.png" alt="">
          </div>
          <div class="content">
            <div class="title">西泠印社 寿山芙蓉石 篆刻印章石料章料 博古 长方章</div>
            <div class="txt1 spec">规格：64G</div>
            <div class="txt1 service">服务说明</div>
            <div class="txt2 rent">月租：￥122.00</div>
            <div class="txt2 start-time">起租时间：2017-10-29</div>
            <div class="txt2 end-time">结束时间：2017-10-29</div>
          </div>
        </div>
        <div class="item-foot">
          <span>共1件，租期：1个月，总租金额：¥122.00</span>
        </div>
        <div class="item-link-btn">
          <router-link to="">订单待还详情</router-link>
        </div>
      </div>
      <t-empty :is-show="leaselist.length == 0" :empty-text="emptyText" :empty-text2="emptyText2" :link-url="linkUrl" :img-type="1"></t-empty>
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
      currentType: 1,
      leaselist: []
    };
  },
  mounted() {
    this.getleaseList();
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
            periodType: vm.currentType
          }
        })
        .then(data => {
          console.log("获取租赁信息");
          console.log(data);
          if ((data.code = "999")) {
            vm.leaselist = data.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    tEmpty
  }
};
</script>

<style scoped lang="scss" >
@import "../../assets/css/order";
@import "../../assets/css/minx";
.mint-header {
  background-color: $WtsColor;
}
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
      align-items: center;
    }
    img {
      width: 72px;
      height: 72px;
    }
    .content {
      margin-left: 8px;
      flex: 1;
      padding: 16px 0;
      > div {
        color: #333;
        line-height: 24px;
      }
      .title {
        font-size: 16px;
        color: inherit;
      }
      .txt1 {
        font-size: 12px;
        color: #999;
        letter-spacing: 0;
        line-height: 18px;
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
      flex: 1;
      font-size: 12px;
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
</style>
