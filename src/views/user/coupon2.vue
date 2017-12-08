<template>
  <section>
    <mt-header title="我的优惠券">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
  
    <div class="mint-navbar">
      <a class="mint-tab-item" :class="{active:true}" @click="clickTab(0)">
        <div class="mint-tab-item-label">可用优惠券(0)</div>
      </a>
      <a class="mint-tab-item" @click="clickTab(1)">
        <div class="mint-tab-item-label">不可用优惠券((0)</div>
      </a>
    </div>
    <div class="data-list" v-show="list>0">
        
        <div class="data-item">
            <div class="coupon-img">
                <div class="money">
                  <span class="danwei">￥</span>
                  <span class="num">20</span>
                </div>
                <div class="info">满100元可用</div>
            </div>
            <div class="coupon-content">
                <div class="title">适用于所有商品</div>
                <div class="time">2017.08.01-2017.08.31有效</div>
                  <span class="mint-checkbox" >
                  <input type="checkbox" class="mint-checkbox-input" value=""  :checked="true" >
                   <span class="mint-checkbox-core"></span>
                </span>
            </div>
        </div>

            <div class="data-item used">
              <div class="coupon-img">
                  <div class="money">
                    <span class="danwei">￥</span>
                    <span class="num">20</span>
                  </div>
                  <div class="info">满100元可用</div>
              </div>
              <div class="coupon-content">
                  <div class="title">适用于所有商品</div>
                  <div class="time">2017.08.01-2017.08.31有效</div>
                  <div class="used-img">
                    <img src="../../assets/images/used.png" alt="">
                  </div>
              </div>
        </div>
    </div>
     <t-empty isshow="list.length==0" text="无相关的优惠券" imgType="3"></t-empty>
      <t-empty :is-show="list.length == 0" :empty-text="emptyText"  :img-type="3"></t-empty>
  </section>
</template>

<script>
import api from "@/api";
import tEmpty from "@/components/common/empty"; //暂无数据
export default {
  data() {
    return {
      emptyText: "无相关的优惠券",
      option: {
        requrl: api.my.couponlist,
        status: 0
      },
      list: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    clickTab(type) {
      alert(type);
    },
    getList() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: vm.option
        })
        .then(res => {
          console.log(res);
          if (res.code == "999") {
            vm.list = res.data.list;
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
      .btn {
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
