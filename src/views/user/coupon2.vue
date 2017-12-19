<template>
  <section>
    <mt-header title="我的优惠券">
      <a @click="$router.go(-1)" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="mint-navbar">
      <a class="mint-tab-item" :class="{active:option.status==0}" @click="clickTab(0)">
        <div v-if="listLocal" class="mint-tab-item-label">未使用({{listLocal.availableList?listLocal.availableList.length:0}})</div>
        <div v-else class="mint-tab-item-label">未使用({{noUseCount}})</div>
      </a>
      <a class="mint-tab-item" :class="{active:option.status==1}" @click="clickTab(1)">
        <div v-if="listLocal" class="mint-tab-item-label">已使用({{listLocal.unAvailableList?listLocal.unAvailableList.length:0}})</div>
        <div v-else class="mint-tab-item-label">已使用({{usedCount}})</div>
      </a>
      <a class="mint-tab-item" :class="{active:option.status==2}" @click="clickTab(2)" v-show="couponId==-1">
        <div v-if="listLocal" class="mint-tab-item-label">已过期({{listLocal.unAvailableList?listLocal.unAvailableList.length:0}})</div>
        <div v-else class="mint-tab-item-label">已过期({{pastCount}})</div>
      </a>
    </div>
    <div class="data-list" v-show="list.length>0">
      <div class="data-item" v-for="item in list" :class="{used:item.status==1||item.status==2||item.status==4 }" @click="addCoupon(item,list)">
        <div class="coupon-img">
          <div class="money">
            <span class="danwei">￥</span>
            <span class="num" :class="{sm:item.money>999}">{{item.money}}</span>
          </div>
          <div class="info" v-if="item.minAmount>0">满{{item.minAmount}}元可用</div>
          <div class="info" v-else>无限额</div>
        </div>
        <div class="coupon-content">
          <div class="title">{{item.name}}</div>
          <div class="time">{{item.startDate}}-{{item.endDate}}有效</div>
          <a class="coupon-btn" @click="useCoupon(item.id)" v-show="couponId==-1&&item.status==0">立即使用</a>
          <span class="mint-checkbox" v-show="couponId>=0&&(item.status==0||item.status==3)">
            <input type="checkbox" class="mint-checkbox-input" value="" :checked="item.isCheck || item.id==couponId">
            <span class="mint-checkbox-core"></span>
          </span>
          <div class="used-img" v-show="item.status==1||item.status==2">
            <img src="../../assets/images/used.png" alt="" v-show="item.status==1">
            <img src="../../assets/images/past.png" alt="" v-show="item.status==2">
          </div>
        </div>
      </div>
    </div>
    <t-empty :is-show="list.length==0 " :empty-text="emptyText " :img-type="imgType "></t-empty>
  </section>
</template>

<script>
import api from "@/api";
import tEmpty from "@/components/common/empty"; //暂无数据
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      couponId: -1, //从购物车跳转过来的是0
      emptyText: "无相关的优惠券",
      imgType: 3,
      option: {
        requrl: api.my.couponlist,
        status: -1
      },
      list: [],
      list1: [],
      list2: [],
      list3: [],
      listLocal: {},
      listLocalIndex: 0,
      noUseCount: 0,
      usedCount: 0,
      pastCount: 0
    };
  },
  created() {
    this.$set(
      this,
      "listLocal",
      JSON.parse(window.localStorage.getItem("PRODUCTSCOUPON"))
    );
    this.couponId =
      String(this.$route.query.id) === "0" || this.$route.query.id
        ? this.$route.query.id
        : -1;
    alert(this.couponId);
  },
  mounted() {
    this.getList();
  },
  destroyed() {
    window.localStorage.removeItem("PRODUCTSCOUPON");
  },
  methods: {
    clickTab(type) {
      var vm = this;
      if (vm.listLocal != null) {
        vm.listLocalIndex = type;
        let ms = type == 0 ? "availableList" : "unAvailableList";
        vm.list = vm.listLocal[ms];
      } else {
        // vm.getList();
        if (type == 0) {
          vm.list = vm.list1;
        } else if (type == 1) {
          vm.list = vm.list2;
        } else {
          vm.list = vm.list3;
        }
      }
      vm.option.status = type;
    },
    getAllList() {},
    getList() {
      var vm = this;
      console.log(vm.listLocal);
      if (vm.listLocal && vm.listLocal.availableList.length > 0) {
        let ms = vm.listLocalIndex == 0 ? "availableList" : "unAvailableList";
        vm.list = vm.listLocal[ms];
      } else {
        if (vm.couponId != 0) {
          vm.$axios
            .get(api.get, {
              params: vm.option
            })
            .then(res => {
              console.log(res);
              var newlist = res.data.list;
              if (vm.option.status == -1) {
                if (newlist.length > 0) {
                  let newArr1 = [],
                    newArr2 = [],
                    newArr3 = [];
                  newlist.map(function(n) {
                    if (n.status == 0) {
                      newArr1.push(n);
                      vm.noUseCount++;
                    }
                    if (n.status == 1) {
                      newArr2.push(n);
                      vm.usedCount++;
                    }
                    if (n.status == 2) {
                      newArr3.push(n);
                      vm.pastCount++;
                    }
                  });
                  vm.list1 = newArr1;
                  vm.list2 = newArr2;
                  vm.list3 = newArr3;
                  vm.list = newArr1;
                }
              }
            });
        }
      }
    },
    addCoupon(item, list) {
      //点击优惠券;
      let vm = this;
      if (vm.couponId >= 0) {
        if (item.id == vm.couponId) {
          vm.couponId = 0;
          window.localStorage.removeItem("CHECKEDCOUPON");
          vm.$set(item, "isCheck", false);
          return;
        }
        if (item.status == 1 || item.status == 2 || item.status == 4) {
          Toast({
            message: "优惠券不可用",
            position: "bottom"
          });
        } else {
          // vm.couponId = 0;
          list.forEach(item => {
            if (item.isCheck) {
              vm.$set(item, "isCheck", false);
            }
          });
          vm.$set(item, "isCheck", true);
          window.localStorage.setItem("CHECKEDCOUPON", JSON.stringify(item));
          setTimeout(function() {
            // vm.$router.push({ name: "productfill" });
          }, 800);
        }
      }
    },
    useCoupon(id) {
      //立即使用优惠券
    }
  },
  computed: {
    // couponId() {
    //   return this.$route.query.id || -1;
    // }
  },
  components: {
    tEmpty
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/global";
.mint-checkbox {
  float: right;
  margin-right: 0;
}
.mint-tab-item-label {
  font-size: 14px;
}
.active {
  border-bottom: 2px solid #ff5000; /*no*/
}
.active .mint-tab-item-label {
  color: #ff5000;
}
.data-list {
  padding: 0 16px;
  .data-item {
    display: flex;
    height: 97px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 6px;
    color: #fff;
    .coupon-img {
      position: relative;
      width: 113px;
      height: 97px;
      font-size: 12px;
      background-color: #ff9a00;
      text-align: center;
      &::after {
        content: "";
        position: absolute;
        top: -20px;
        display: block;
        width: 5px;
        height: 100%;
        margin-top: 20px;
        background-size: 15px 8px;
        right: -5px;
        background-color: #ff9a00;
        background-position: 100% 15%;
        background-image: linear-gradient(
            -45deg,
            #fff 20%,
            transparent 20%,
            transparent
          ),
          linear-gradient(-135deg, #fff 25%, transparent 25%, transparent),
          linear-gradient(-45deg, transparent 75%, #fff 75%),
          linear-gradient(-135deg, transparent 75%, #fff 75%);
      }
      .money {
        height: 48px;
        margin-top: 14px;
        .danwei {
          font-size: 16px;
        }
        .num {
          font-size: 40px;
          &.sm {
            font-size: 30px;
          }
        }
      }
    }
    &.used {
      .coupon-img {
        background-color: #ccc;
        &::after {
          background-color: #ccc;
        }
      }
    }
    .coupon-content {
      flex: 1;
      padding: 8px 16px;
      font-size: 16px;
      color: #333;
      position: relative;
      .time {
        margin-top: 4px;
        font-size: 12px;
        color: #999999;
      }
      .coupon-btn {
        display: block;
        float: right;
        margin-top: 18px;
        width: 64px;
        height: 20px;
        line-height: 20px;
        color: #ff5000;
        font-size: 12px;
        text-align: center;
        border: 1px solid #ff5000; /* no */
        border-radius: 2px;
      }
      .used-img {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 64px;
        img {
          @extend .used-img;
        }
      }
    }
  }
}
</style>
