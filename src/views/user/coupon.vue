<template>
  <section>
    <mt-header title="我的优惠券">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
  
    <div class="mint-navbar">
      <a class="mint-tab-item" :class="{active:true}" @click="clickTab(0)">
        <div class="mint-tab-item-label">未使用(0)</div>
      </a>
      <a class="mint-tab-item" @click="clickTab(1)">
        <div class="mint-tab-item-label">已使用(0)</div>
      </a>
      <a class="mint-tab-item" @click="clickTab(2)">
        <div class="mint-tab-item-label">已过期(N)</div>
      </a>
    </div>
    <div class="data-list">
        
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
                <router-link class="btn" to="">立即使用</router-link>
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
                  <img src="../../assets/images/past.png" alt="">
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {
    clickTab(type) {
      alert(type);
    }
  }
};
</script>
<style lang="scss" scoped>
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
