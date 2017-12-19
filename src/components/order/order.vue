<template>
  <section>
    <div class="o-order" v-for="item in dataList">
      <div class="o-head">
        <div class="order">订单编号：{{item.sn}}</div>
        <div class="status-txt" v-text="item.statusText"></div>
      </div>
      <div class="o-body" @click="detail(item.sn)">
        <div class="single" v-if="item.products.length==1">
          <img :src="item.products[0].imageUrl" alt="">
          <div class="content">
            <div class="title" v-text="item.products[0].name"></div>
            <div class="pesc" v-text="item.products[0].specs"></div>
            <div class="pesc" v-show="item.products[0].serviceList.length>0" style="margin-top:5px;">
              <span v-for="server in item.products[0].serviceList">{{server.serviceName}}</span>
            </div>
          </div>
        </div>

        <div class="swiper-container" v-else>
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="product in item.products">
              <img class="order-img" :src="product.imageUrl" />
            </div>
          </div>
        </div>
      </div>
      <div class="o-foot">
        <div class="number">
          共
          <span class="num" v-text="item.goodsNum"></span>件商品，应付金额：
          <span class="num">￥{{item.orderAmount}}</span>
        </div>
      </div>
      <!-- <div class="o-btns">
        <a class="btn btn-default" v-show="item.status==1">取消订单</a>
        <a class="btn btn-danger" v-show="item.status==1">立即付款</a>
        <a class="btn btn-default" v-show="item.status==3">查看物流</a>
        <a class="btn btn-danger" v-show="item.status==3">确认收货</a>
        <a class="btn btn-danger" v-show="item.status==4">再次购买</a>
        <a class="btn btn-danger" v-show="item.status==5&&orderType==1">重新购买</a>
        <a class="btn btn-danger" v-show="item.status==5&&orderType==2">重新租赁</a>
      </div> -->

      <div class="o-btns">
        <btn-action :sn="item.sn" :status="item.status" :order-type="orderType" :product-data="item.products" :lease-month="item.leaseMonth"></btn-action>
      </div>
    </div>
  </section>
</template>

<script>
import Swiper from "./../../../static/swiper/js/swiper.min";
import "./../../../static/swiper/css/swiper.min.css";
import btnAction from "./actions";

export default {
  props: ["dataList", "orderType"],
  data() {
    return {};
  },
  methods: {
    detail(sn) {
      this.$router.push({
        path: "/orderdetail",
        query: { sn: sn, orderType: this.orderType }
      });
    }
  },
  mounted: function() {
    setTimeout(function() {
      var swiper = new Swiper(".swiper-container", {
        slidesPerView: "auto",
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    }, 60);
    console.log("订单数据");
    console.log(this.dataList);
  },
  components: { btnAction }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/minx";
$height: 34px;
.border {
  border-top: 1px solid #eee; /*no*/
}
.padding {
  padding: 0 16px;
}
.img {
  width: 72px;
  height: 72px;
}
.o-order {
  background-color: #fff;
  margin: 10px 0;
  font-size: 12px;
  color: #999;
  .o-head,
  .o-foot,
  .o-body,
  .o-btns {
    @extend .padding;
  }
  .order-img {
    @extend .img;
  }
  .o-body {
    display: block;
    .single {
      display: flex;
      img {
        @extend .img;
        margin-top: 8px;
      }
      .content {
        padding: 8px;
        flex: 1;
        > div {
          text-align: left;
        }
        .title {
          font-size: 14px;
          color: #333;
          letter-spacing: 0.17px;
          text-align: left;
          line-height: 20px;
        }
        .pesc {
          margin-top: 17px;
          color: #999;
        }
      }
    }
    .swiper-slide {
      margin-right: 8px;
      width: 72px;
      margin-top: 8px;
    }
  }
  .o-head,
  .o-foot {
    display: flex;
    :first-child {
      text-align: left;
      flex: 2;
    }
    :last-child {
      text-align: right;
      color: #ff5000;
      flex: 1;
    }
  }
  .o-foot {
    .number {
      font-size: 14px;
      color: #666;
      letter-spacing: 0.17px;
      .num {
        color: #ff5000;
      }
    }
  }
  .o-head,
  .o-foot,
  .o-btns {
    @extend .border;
    height: $height;
    line-height: $height;
    font-size: inherit;
  }
  .o-body {
    @extend .border;
    min-height: 88px;
    overflow: hidden;
  }
  .o-btns {
    display: block;
    text-align: right;
    height: 44px;
    line-height: 44px;
  }
}
</style>
