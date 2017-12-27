<template>

  <div class="m-home" ref="home" id="home">
    <!--head-->
    <t-head v-show="isHead" :title="title" :menu-display="menuDisplay" :back-display="backDisplay" :map-display="mapDisplay" :carsLength="carsLength"></t-head>
    <!--head-end-->
    <section v-for="item in $store.state.home.malldata">
      <!--banner-->
      <section v-if="item.showStyleType==1">
        <t-banner :imgs="item.infos" :auto="3666"></t-banner>
      </section>
      <!--banner end-->
      <!---->
      <section class="s-nav" v-else-if="item.showStyleType>=2 && item.showStyleType<=5">
        <div v-if="item.infos.length==2" class="two-box">
          <div v-for="item in item.infos" class="itemt">
            <img :src="item.imageUrl" :alt="item.title" />
            <div class="tit">{{item.title}}</div>
          </div>
        </div>
        <div v-else class="th-nav">
          <div v-for="item in item.infos" class="item">
            <div><img :src="item.imageUrl" :alt="item.title" /> </div>
            <div>{{item.title}}</div>
          </div>
        </div>
      </section>
      <!---->
      <section v-else>
        <t-detail :infos="item"></t-detail>
      </section>
      <!---->
    </section>
    <t-tabar :selected="selected"></t-tabar>
  </div>
</template>
<script>
import api from "@/api";
import * as types from "@/store/types";
import tBanner from "@/components/home/banner"; //轮播
import tHead from "@/components/common/head";
import tDetail from "@/components/home/detail"; //详情
import tTabar from "@/components/common/tabar";
import { mapState, mapActions } from "vuex";
import com from "@/api/common";

export default {
  components: { tBanner, "t-head": tHead, tDetail, tTabar },
  data() {
    return {
      msg: "首页",
      selected: "Home",
      isHead: true,
      menuDisplay: true,
      backDisplay: true,
      mapDisplay: true,
      title: "首页",
      allDate: [],
      imgs: [],
      carsLength: 0 //购物车数量
    };
  },
  mounted() {
    var vm = this;
    //获取购物车数量
    vm.$axios
      .get(api.get, {
        params: {
          requrl: api.cart.count
        }
      })
      .then(res => {
        vm.carsLength = res.data;
      })
      .catch(err => {
        console.log(err.message);
      });
  },
  created: function() {
    this.getIndexDate(this); //获取首页数据
    this.loginCoupon();
  },
  methods: {
    //登录赠送优惠券
    loginCoupon() {
      if (com.getCookie("username") && com.getSession("loginUserBaseInfo")) {
        this.$axios
          .get(api.get, { params: { requrl: api.my.logincoupon } })
          .then(res => {
            console.log("登录获取优惠券成功");
          });
      }
    },
    ...mapActions({
      getIndexDate: "HOME_DATA"
    })
  },
  computed: {}
};
</script>

<style scoped lang="scss">
@import "../assets/css/minx";
.m-home {
  padding-bottom: 48px;
  background-color: #f5f5f5;
  .s-nav {
    font-size: 14px;
    background-color: #ffffff;
    .two-box {
      width: 100%;
      display: flex;
      padding: 12px 16px;
      box-sizing: border-box;
      .itemt {
        width: 50%;
        // padding-left: 8px;
        align-items: center;
        display: flex;
        &:first-child {
          border-right: 1px solid #f3f3f3; /*no*/
        }
        &:last-child {
          img {
            margin-left: 16px;
          }
        }
      }
      .tit {
        width: 80%;
        display: block;
        line-height: 40px;
        flex-shrink: 1;
        text-align: center;
      }
    }
    .th-nav {
      display: flex;
      justify-content: space-around;
      padding-bottom: 8px;
      .item {
        text-align: center;
        color: #666666;
      }
    }

    img {
      border-radius: 8px;
      width: 60px;
      height: 60px;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
}
</style>
