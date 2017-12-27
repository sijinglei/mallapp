<template>
  <section>
    <mt-header title="订单详情" fixed>
      <a slot="left" @click="$router.go(-1)">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="order-body">
      <div class="t-box status">
        <div class="lb">
          <i class="icon" :class="iconClass"></i>
          {{detail.statusText}}
        </div>
        <div class="rb" v-show="expireTime!=''">剩余：{{expireTime}}</div>
      </div>

      <div class="t-box t-adress" v-show="detail.status==2||detail.status==3">
        <p class="t-title">
          您的订单已提交，{{detail.status==2?"等待发货":"等待收货"}}
          <i class="mint-cell-allow-right"></i>
        </p>
        <p class="t-subhead ellipsis">{{detail.createTime}}</p>
      </div>
      <div class="t-box t-success" v-show="detail.status==4">
        <p class="t-title">
          感谢您在创选商城购物，欢迎再次光临
          <i class="mint-cell-allow-right"></i>
        </p>
      </div>

      <div class="t-box t-adress">
        <p class="t-title">
          {{detail.shipName}}&nbsp;{{detail.shipMobile.substr(0, 3) + '****' +detail.shipMobile.substr(7)}}
        </p>
        <p class="t-subhead ellipsis">{{detail.shipAddr}}</p>
      </div>
      <div class="t-box t-product">
        <h2 class="t-head bg-line">
          商品信息
        </h2>
        <div class="t-list">
          <ul>
            <li v-for="item in detail.products">
              <router-link :to="{path:'product/detail/'+item.productId+''}">
                <img :src="item.imageUrl" class="img" alt="">
                <div class="content">
                  <p class="t-title" v-text="item.name"></p>
                  <p class="t-subhead" v-text="item.specs"></p>
                  <p class="t-price">
                    <span>￥{{item.price}}</span>
                    <span>x{{item.productCount}}
                    </span>
                  </p>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="t-box t-product">
        <h2 class="t-head bg-line">
          订单信息
        </h2>
        <div class="order-info">
          <div class="order-row-info">
            <div class="title">订单编号</div>
            <div class="info" v-text="detail.sn"></div>
          </div>
          <div class="order-row-info">
            <div class="title">提交时间</div>
            <div class="info" v-text="detail.createTime"></div>
          </div>
          <div class="order-row-info">
            <div class="title">支付方式</div>
            <div class="info" v-text="detail.paymentName"></div>
          </div>
          <div class="order-row-info" v-show="detail.status==2">
            <div class="title">实付金额</div>
            <div class="info">￥{{detail.payMoney}}</div>
          </div>
          <div class="order-row-info" v-show="detail.status==2">
            <div class="title">付款时间</div>
            <div class="info" v-text="detail.paymentTime"></div>
          </div>
        </div>
      </div>
      <div class="t-box t-product">
        <div class="order-info">
          <div class="order-row-info">
            <div class="title">买家留言</div>
            <div class="info" v-text="detail.remark"></div>
          </div>
        </div>
      </div>
      <div class="t-box t-product">
        <div class="order-info">
          <div class="order-row-info" v-show="orderType==2">
            <div class="title">付款方式</div>
            <div class="info">{{detail.leasePayType==1?'全付':'月付'}}</div>
          </div>
          <div class="order-row-info">
            <div class="title">商品合计</div>
            <div class="info">￥{{detail.goodsAmount}}</div>
          </div>
          <div class="order-row-info">
            <div class="title">运费</div>
            <div class="info">￥{{detail.shippingAmount}}</div>
          </div>
          <div class="order-row-info">
            <div class="title">优惠券</div>
            <div class="info">￥{{detail.discount}}</div>
          </div>
          <div class="order-row-info" v-show="orderType==2">
            <div class="title">总服务费</div>
            <div class="info">￥{{detail.serviceAmount}}</div>
          </div>
        </div>
      </div>
      <div class="t-box t-foot">
        <div class="amoney">
          应付：
          <span>￥
            <i>{{detail.orderAmount}}</i>
          </span>
        </div>
        <div class="btns">
          <btn-action :sn="detail.sn" :status="detail.status" :order-type="orderType"></btn-action>
          <!-- <a class="btn btn-default" v-show="detail.status==1">取消订单</a>
          <a class="btn btn-danger" v-show="detail.status==1">立即付款</a>
          <a class="btn btn-default" v-show="detail.status==2||detail.status==3">查看物流</a>
          <a class="btn btn-danger" v-show="detail.status==2||detail.status==3">确认收货</a>-->
          <!-- <a class="btn btn-default" v-show="detail.status==4">删除订单</a> -->
          <!-- <a class="btn btn-danger" v-show="detail.status==4&&orderType==1">再次购买</a>
          <a class="btn btn-danger" v-show="detail.status==4&&orderType==2">再次购买</a> -->
          <!-- <a class="btn btn-default" v-show="detail.status==5">删除订单</a> -->
          <!-- <a class="btn btn-danger" v-show="detail.status==5&&orderType==1">重新购买</a>
          <a class="btn btn-danger" v-show="detail.status==5&&orderType==2">重新购买</a>  -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from "@/api";
import btnAction from "@/components/order/actions";
export default {
  data() {
    return {
      sn: "",
      orderType: 1, //1普通订单 2租赁订单
      detail: {
        statusText: "XXXX",
        shipMobile: "13421365591" //给个默认值
      },
      expireTime: ""
    };
  },
  created() {
    var vm = this,
      query = vm.$route.query;
    vm.sn = query.sn;
    vm.orderType = query.orderType;
    vm.getInfo();
  },
  methods: {
    getInfo() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.member.orderdetail,
            sn: vm.sn
          }
        })
        .then(res => {
          //status(0:所有订单 1：待付款 2：待发货 3：待收货 4:已完成 5:已取消 6:售后)
          console.log(res);
          vm.detail = res.data;
          if (vm.detail && vm.detail.status == 1) {
            vm.getExpire();
          }
        });
    },
    getExpire() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.order.expire,
            sn: vm.sn
          }
        })
        .then(res => {
          console.log(res);
          var timer = null;
          if (res.code == 999 && res.data > 0) {
            timer = setInterval(() => {
              res.data--;
              if (res.data == 0) {
                //修改状态已取消
                vm.detail.status = 5;
                clearInterval(timer);
              } else {
                vm.expireTime = vm.formatSeconds(res.data);
              }
            }, 1000);
          }
        });
    },
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = "" + parseInt(theTime) + "秒";
      if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
      }
      if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
      }
      return result;
    }
  },
  computed: {
    iconClass() {
      let icon = "icon-iorder1";
      if (this.detail.status == 1) {
        icon = "icon-iorder1";
      }
      if (this.detail.status == 2) {
        icon = "icon-iorder2";
      }
      if (this.detail.status == 3) {
        icon = "icon-iorder3";
      }
      if (this.detail.status == 4) {
        icon = "icon-iorder4";
      }
      if (this.detail.status == 5) {
        icon = "icon-iorder5";
      }
      return icon;
    }
  },
  components: {
    btnAction
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/fonts/iconfont.css";
@import "../../../assets/css/order";
.order-body {
  margin-top: 48px;
}
</style>
