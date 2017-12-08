<template>
  <div>
    <t-search></t-search>
    <div class="list-header">
      <ul class="nav">
        <li :class="{active:current=='buyCount'}" @click="getList('buyCount')">销量</li>
        <li :class="{active:current=='price',active1:click==1,active2:click==2}" @click="getList('price')">
          价格
          <div class="btn-icon">
            <span class="top">上</span>
            <span class="bot">下</span>
          </div>
        </li>
        <li :class="{active:current=='blank'}" @click="getList('blank')">品牌</li>
      </ul>
    </div>
    <div class="list-content">
      <ul>
        <li v-for="item in productList">
          <div class="left-icon">
            <img :src="item.imgUrl">
          </div>
          <div class="right-content">
            <div class="productname">{{item.name}}</div>
            <span class="productprice">￥{{item.price}}</span>
            <span class="productnum">销量：{{item.buyCount}}</span>
          </div>
        </li>
      </ul>
    </div>
    <mt-popup v-model="popupVisible" position="right" class="popup-box" :modal="true">
      <div class="header-box">
        品牌
        <span @click="checkBrand()">确认</span>
      </div>
      <div class="content-box">
        <mt-checklist
          align="right"
          class="page-part"
          title=""
          v-model="value"
          :options="checklist">
        </mt-checklist>
      </div>

    </mt-popup>


  </div>
</template>
<script>
   import tSearch from "@/components/category/search";
   import api from "@/api";
  export default {
    components:{tSearch},
    data(){
      return{
        checklist:[],
        value:[],
        popupVisible:false,
        current:'buyCount',//默认销量页
        productList:[],//所有商品
        postData:{
          requrl:api.goods.goodlistbycatid,
          catId:'',
          brandIds:'',
          sortName:'buyCount',//buyCount,
          sortOrder:'desc',
          pageIndex:'1',
          pageSize:'10'
        },
        blrandParams:{
          requrl:api.brand.list,
          catId:0
        },
        blrandList:[],
        click:1
      }
    },
    mounted() {
      var vm = this;
      let catId=vm.$route.query.catid;
      vm.postData.catId = catId;
      vm.blrandParams.catId = catId;
      vm.getCate();
    },
    methods: {
      getList (cur) {
        var vm=this;
        vm.current = cur;//当前选项
        if(cur=='blank'){
          vm.popupVisible=true;
          vm.getBrandList();
        }
        if(cur=='price'){
          if(vm.click==1){
            vm.click=2;
            vm.postData.sortOrder='asc';
          }else{
            vm.click=1;
            vm.postData.sortOrder='desc';
          }
        }
        vm.getCate();
      },

      getCate() {
        var that = this;
        that.$axios.post(api.post,that.postData).then(data => {
          if(data.code=='999'){
            var allData = data.data.list
//            console.log(data);
            that.productList=allData;

          }
        }).catch(err=>{

        });
      },
      getBrandList(){
      var vm=this;
      vm.$axios.get(api.get,{params:vm.blrandParams}).then(res=>{
        let blrandList=res.data;
        vm.checklist=[];
        blrandList.forEach(item=>{
          vm.checklist.push({label:item.name,value:item.id});
        });
      }).catch(err=>{})
      },
      checkBrand(){
        var vm=this;
        vm.postData.brandIds=vm.value.join(',');
        vm.getCate();
        vm.popupVisible=false;
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../assets/css/minx";
  /*@import "../assets/css/global";*/
  .popup-box{
    width: 335px;
    height: 100%;
    background: #F5F5F5;
    .header-box{
      height: 47px;
      line-height:47px;
      text-align: center;
      font-size: 18px;
      color: #333333;
      background: #ffffff;
      position: relative;
      span{
        font-size: 14px;
        color: #42BD56;
        position: absolute;
        right:16px;
      }
    }
    .item-header{
      height: 10px;
      line-height: 10px;
      background: #F5F5F5;
      padding-left:16px;
      span{
        font-size: 12px;
        color: #333333;
      }
    }
    .item-content{
      height: 48px;
      line-height:48px;
      background: #FFFFFF;
      padding-left:16px;
      span{
        font-size: 14px;
        color: $WtsColor;
      }
    }
  }
  .list-header{
    width: 100%;
    ul{
      display: flex;
      padding-top:46px;
      li{
        width: 33.3333%;
        height: 36px;
        text-align: center;
        line-height: 36px;
        background: #fff;
        color: #666666;
        position: relative;
      }
    }
  }
  .list-content{

    li{
      height: 100px;
      background: #fff;
      border-top:1px solid #E8E8E8;;
      padding:8px 16px;
      display: flex;
      .left-icon{
        img{
          width: 100px;
          height: 100px;
          -webkit-background-size: cover;
          background-size: cover;
        }
      }
      .right-content{
        width: 227px;
        margin:8px 0 0 8px;
        position: relative;
        .productname{
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .productprice{
          position: absolute;
          left:0;
          bottom:0;
          font-size: 16px;
          color: #FF5000;
        }
        .productnum{
          position: absolute;
          right:0;
          bottom:0;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
  .nav {
    .active {
      color: $WtsColor;
      font-weight: bold;
    }
    .btn-icon{
      position: absolute;
      top:13px;
      right:30%;
      span{
        text-indent: 9999pt;
        width: 0;
        height: 0;
        display: block;
      }
      .top{
        margin-bottom: 2px;
        border-left:3px solid transparent;
        border-right:3px solid transparent;
        border-bottom:4px solid #999;
      }
      .bot{
        border-left:3px solid transparent;
        border-right:3px solid transparent;
        border-top:4px solid #999;
      }
    }
    .active1 .top{
      border-bottom-color:$WtsColor;
    }
    .active2 .bot{
      border-top-color:$WtsColor;
    }
  }

  .mint-cell{
    margin-bottom: 10px;
  }

  .mint-checkbox-input:checked+.mint-checkbox-core{
    background-color: $WtsColor;
    border-color: $WtsColor;
  }

</style>
