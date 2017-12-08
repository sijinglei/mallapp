<template>

  <div>
    <head-search></head-search>
    <div class="catename">
      <div class="catename-left">
        <ul class="catelist">
          <li :class="{active:currentIndex==index}" v-on:click="getSecondCart(item.children,index)" v-for="(item,index) in catitems">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="catename-right">
        <div class="main"  v-for="item in productList">
          <div class="secondname">{{item.name}}</div>
          <div class="thirdlist">
            <ul>
              <li v-for="data in item.children">
                <router-link :to="{path:'productlist',query:{catid:data.id}}">
                  <img :src="data.image" alt="">
                  <span>{{data.name}}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="zanwu" v-show="this.productList.length==0">
          暂无数据...
        </div>
      </div>
    </div>
    <t-tabar :selected="selected"></t-tabar>
  </div>
</template>

<script>
  import api from "@/api";
  import headSearch from "@/components/category/search";
  import tTabar from "@/components/common/tabar";
  export default {
    components: {headSearch,tTabar},
    name:'Category',//分类
    data () {
      return {
        title:'商品分类',
        selected:'Category',
        currentIndex:0,
        catitems:[],//存放data
        productList: [],
        productItem:[]

    };
  },
  mounted: function() {
    this.getCate();
  },
  methods: {
    getCate() {
      var that = this;
      that.$axios.get(api.get,{params:{requrl:api.goods.catlist}}).then(data => {
        if(data.code=='999'){
          that.getFirstCate(data.data);
          if(that.catitems.length>0){
            that.getSecondCart(that.catitems[0].children,0);
          }
        }else{
           alert(data.message);
        }
      }).catch(err=>{

      });
    },
    //获取所有数据存放在catitems中
    getFirstCate(data){
      var arr=[];
      data.forEach(item=>{
        arr.push({name:item.name,id:item.id,children:item.children});
      })
      this.catitems=arr;
    },
    getSecondCart(firstData,index){
      var objArr=[];
      this.currentIndex=index;
      firstData.forEach(item=>{
        objArr.push({name:item.name,id:item.id,children:item.children});
      })
      this.productList=objArr;
    }
  }

};
</script>

<style scoped lang="scss">
@import "../assets/css/category";
</style>
