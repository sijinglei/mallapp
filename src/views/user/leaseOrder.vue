<template>
    <section>
      <mt-header title="我的租赁">
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

       <t-order :data-list="datalist"></t-order>
       <t-empty :is-show="datalist.length == 0" :text="暂无相关的订单记录" :img-type="1"></t-empty>
    </section>
</template>

<script>
import api from "@/api";
import tOrder from "@/components/order/order";
import tEmpty from "@/components/common/empty"; //暂无数据

export default {
  data() {
    return {
      currentIndex: 0,
      isActive: true,
      datalist: [],
      options: {
        requrl: api.member.orderlist,
        orderType: 2, //租赁订单
        status: 0 //订单类型 (0:所有订单 1：待付款 2：待发货 3：待收货 4:已完成 5:已取消 6:售后)
      }
    };
  },
  computed: {
    isShowEmpty() {
      return this.datalist.length == 0;
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
          if (res.code == "999") {
            vm.datalist = res.data.list;
          } else {
            alert(res.data.message);
          }
        })
        .catch(err => {
          console.log("" + err + "");
        });
    },
    changeTab(status) {
      var vm = this;
      vm.options.status = status;
      vm.getOrderList();
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
