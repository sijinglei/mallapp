<template>
  <div class="order-track">
    <mt-header title="订单跟踪">
      <a slot="left" @click="$router.go(-1)">
        <mt-button icon="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="order-body">
      <div class="track-top">
        <div class="thead">
          <div class="txt">配送企业：{{express.name}}</div>
          <div class="txt">快递单号：{{express.nu}}</div>
          <div class="txt">联系电话：{{express.tel}}</div>
        </div>
        <div class="tbody">
          <div class="info-txt status">
            <div>已发货</div>
            <div :class="{ok:express.state==0}">运输中</div>
            <div :class="{ok:express.state==5}">派件中</div>
            <div :class="{ok:express.state==3}">已签收</div>
          </div>
          <div class="line-content">
            <div class="line">

            </div>
            <div class="circle">
              <span></span>
            </div>
            <div class="circle">
              <span></span>
            </div>
            <div class="circle">
              <span class="ok"></span>
            </div>
            <div class="circle">
              <span></span>
            </div>
          </div>
          <div class="info-txt">
            <div>杭州市</div>
            <div></div>
            <div></div>
            <div>深圳市</div>
          </div>
        </div>
      </div>
      <div class="track-body">
        <div class="bhead">
          <h2>物流详情</h2>
        </div>
        <div class="bcontent">
          <ul v-if="express.data.length>0">
            <li v-for="item in express.data">
              <div class="circle">
                <span :class="{ok:item.status==express.state}"></span>
              </div>
              <div class="info">
                <p class="title">{{item.context}}</p>
                <p class="time">{{item.time}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api";
export default {
  data() {
    return {
      sn: "",
      express: {
        com: "", //快递公司编码
        areaCode: "", //行政区域编码
        ischeck: false, //是否签收
        state: 0, //快递单当前签收状态，包括0在途中、1已揽收、2疑难、3已签收、4退签、5同城派送中、6退回
        name: "", //快递公司名称
        tel: "", //快递公司服务电话
        nu: "", //快递单号
        data: [] //内容
      }
    };
  },
  created() {
    this.sn = this.$route.query.sn || "";
  },
  mounted() {
    if (this.sn != "") {
      this.getTrack();
    }
  },
  methods: {
    getTrack() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.my.logistics,
            sn: vm.sn
          }
        })
        .then(res => {
          console.log(res);
          vm.express = res.data;
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/order";
</style>
