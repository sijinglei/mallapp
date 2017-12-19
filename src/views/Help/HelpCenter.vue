<template>
  <div>
    <mt-header title="帮助中心">
      <div slot="left">
        <mt-button  icon="back" @click="goBack()"></mt-button>
      </div>
    </mt-header>
    <div class="content">
      <span class="min-title">问题分类</span>
      <div v-for="item in helpCenter">
        <mt-cell :title=item.name  is-link :to="{path:'/helplist',query:{id:item.id}}">
          <img :src=item.icon slot="icon"  width="40" height="40">
        </mt-cell>
      </div>

    </div>
  </div>
</template>
<script>
  import api from "@/api";
  export default {
    components: {},
    data() {
      return {
        helpCenter:[],
        helpParams:{
          requrl:api.my.helpcenter,
          typeId:0,
          pageIndex:1,
          pageSize:10,

        }
      }
    },
    mounted: function () {
      this.getlist();
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      getlist(){
        var that = this;
        that.$axios.get(api.get,{params:that.helpParams}).then(data =>{
          if(data.code == '999'){
            let helpList = data.data.list;
            console.log(helpList);
            helpList.forEach(item=>{
              that.helpCenter.push({id:item.id,icon:item.icon,name:item.name})
            })
          }
        }).catch(err=>{

        });
      }
    },

  }
</script>
<style scoped lang="scss">
  .mint-header{
    font-size: 18px;
    color: #333333;
    background: #FFFFFF;
  }
  .mint-cell{
    border-bottom:1px solid #F3F3F3;
    height: 56px;
    padding-top: 4px;
  }


  .mint-cell-allow-right:after {
    border: 2px solid #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 20px;
    position: absolute;
    width: 5px;
    height: 5px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .content{
    background:#F3F3F3;
    .min-title{
      display: block;
      height: 26px;
      font-size: 12px;
      color: #666666;
      padding:24px 0 0 16px;
    }
  }
  .mint-cell-wrapper{
    height: 56px;
  }
  .mint-cell-wrapper{
    padding-top: 8px!important;
  }
</style>
