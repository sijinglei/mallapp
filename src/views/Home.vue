<template>

  <div class="m-home" ref="home" id="home">
    <!--head-->
    <t-head  v-show="isHead"   :title="title" :menu-display="menuDisplay" :back-display="backDisplay" :map-display="mapDisplay" :carsLength="carsLength"></t-head>
    <!--head-end-->
    <section v-for="item in $store.state.home.malldata">
       <!--banner-->
      <section v-if="item.showStyleType==1">
        <t-banner :imgs="item.infos" :auto="3666"></t-banner>
      </section>
      <!--banner end-->
      <!---->
      <section class="s-nav"  v-else-if="item.showStyleType>=2 && item.showStyleType<=5">
        <div class="item" v-for="item in item.infos">
          <div><img :src="item.imageUrl" :alt="item.title" /> </div>
          <div>{{item.title}}</div>
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
import  * as types from "@/store/types";
import tBanner from '@/components/home/banner';//轮播
import tHead from '@/components/common/head';
import tDetail from '@/components/home/detail';//详情
import tTabar from "@/components/common/tabar";
import {mapState,mapActions} from 'vuex';

export default {
  components:{tBanner,'t-head':tHead,tDetail,tTabar},
  data() {
    return {
      msg: "首页",
      selected:'Home',
      isHead:true,
      menuDisplay:true,
      backDisplay:true,
      mapDisplay:true,
      title:'首页',
      allDate:[],
      imgs:[],
      carsLength:0,//购物车数量
    };
  },
  mounted() {
      var vm=this;
      //获取购物车数量
      vm.$axios.get(api.get,{
          params:{
            requrl:api.cart.count
          }}).then((res)=>{
              vm.carsLength=res.data;
          }).catch((err)=>{
           console.log(err.message)
          })
  },
  created:function () {
    this.getIndexDate(this);//获取首页数据

  },
  methods: {
    ...mapActions({
      getIndexDate:'HOME_DATA'
    })
  },
  computed:{

  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/minx";
  .m-home{
    background-color: #f5f5f5;
    .s-nav{
      display: flex;
      font-size: 14px;
      background-color: #ffffff;
      justify-content: space-around;

      .item{text-align: center;
        color: #666666;
        img{
          width:40px;height: 40px;
          margin-top: 16px;
          margin-bottom: 8px;
        }}
      padding-bottom: 16px;
    }
  }
</style>
