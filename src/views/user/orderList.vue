<template>
  <section>
    <div class="fixd-head">
      <mt-header :title="pageTitle">
        <router-link to="/userIndex" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="mint-navbar">
        <a class="mint-tab-item" :class="{active:options.status==0}" @click="changeTab(0)">
          <div class="mint-tab-item-label">全部</div>
        </a>
        <a class="mint-tab-item" :class="{active:options.status==1}" @click="changeTab(1)">
          <div class="mint-tab-item-label">待付款</div>
        </a>
        <a class="mint-tab-item" :class="{active:options.status==3}" @click="changeTab(3)">
          <div class="mint-tab-item-label">待收货</div>
        </a>
        <a class="mint-tab-item" :class="{active:options.status==4}" @click="changeTab(4)">
          <div class="mint-tab-item-label">已完成</div>
        </a>
        <a class="mint-tab-item" :class="{active:options.status==5}" @click="changeTab(5)">
          <div class="mint-tab-item-label">已取消</div>
        </a>
      </div>
    </div>
    <div class="main-body" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottom-pull-text="pullText" :bottom-distance="50" :auto-fill="false" ref="loadmore">
        <t-order :data-list="datalist" :order-type="options.orderType"></t-order>
        <t-empty :is-show="datalist.length == 0" :empty-text="emptyText"></t-empty>
        <div class="nodata" v-show="allLoaded">
          这次真没有了……
        </div>
      </mt-loadmore>
    </div>
  </section>
</template>

<script>
import api from "@/api";
import tOrder from "@/components/order/order";
import tEmpty from "@/components/common/empty"; //暂无数据

export default {
  data() {
    return {
      emptyText: "暂无相关的订单记录",
      currentIndex: 0,
      isActive: true,
      datalist: [],
      options: {
        requrl: api.member.orderlist,
        orderType: 1, //1 普通订单 2、租赁订单
        pageIndex: 1,
        pageSize: 10,
        status: 0 //订单类型 (0:所有订单 1：待付款 2：待发货 3：待收货 4:已完成 5:已取消 6:售后)
      },
      pullText: "加载更多",
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: "auto" //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
    };
  },
  computed: {
    pageTitle() {
      return this.options.orderType == 1 ? "我的订单" : "租赁订单";
    }
  },
  created() {},
  mounted() {
    var vm = this;
    //隐藏底部
    vm.$store.state.tabar = false;

    console.log(vm.$store.state);
    vm.options.status = parseInt(vm.$route.params.status);
    vm.options.orderType = parseInt(vm.$route.params.orderType);
    vm.getOrderList();
  },
  methods: {
    getOrderList() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: vm.options
        })
        .then(res => {
          console.log(res);
          vm.datalist = res.data.list;
          vm.$nextTick(function() {
            vm.scrollMode = "touch";
          });
        });
    },
    changeTab(status) {
      var vm = this;
      vm.options.status = status;
      vm.getOrderList();
    },
    loadTop: function() {
      //组件提供的下拉触发方法
      //下拉加载
      this.getOrderList();
      this.$refs.loadmore.onTopLoaded(); // 固定方法，查询完要调用一次，用于重新定位
    },
    loadBottom: function() {
      // 上拉加载
      this.more(); // 上拉触发的分页查询
      this.$refs.loadmore.onBottomLoaded(); // 固定方法，查询完要调用一次，用于重新定位
    },
    more() {
      var vm = this;
      vm.options.pageIndex = parseInt(this.options.pageIndex) + 1;
      vm.$axios
        .get(api.get, {
          params: vm.options
        })
        .then(res => {
          vm.datalist = [...vm.datalist, ...res.data.list]; //vm.datalist.concat(res.data.list);
          vm.isHaveMore(vm.datalist.length !== res.data.count);
        });
    },
    isHaveMore: function(isHaveMore) {
      // 是否还有下一页，如果没有就禁止上拉刷新
      this.allLoaded = true; //true是禁止上拉加载
      if (isHaveMore) {
        this.allLoaded = false;
      }
    }
  },
  components: {
    tOrder,
    tEmpty
  }
};
</script>

<style scoped lang="scss" >
@import "../../assets/css/order";
</style>
