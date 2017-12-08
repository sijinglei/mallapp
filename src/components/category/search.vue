<template>
  <div class="cate-head">
    <div @click="goBack">
      <i class="icon icon-large"></i>
    </div>
    <div class="head-search">
      <i class="icon icon-search"></i><input type="search" placeholder="搜索商品">
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{

      }
    },

    methods: {
      goBack () {
        this.$router.go(-1)
      },
    }
  }
</script>
<style lang="scss" scoped="">
  @import "../../assets/fonts/iconfont.css";
  .cate-head{
    position: fixed;
    width:100%;
    height: 30px;
    background: #FFFFFF;
    padding:8px;
    display: flex;
    align-items: center;
      .head-search{
        width: 100%;
        height: 30px;
        border-radius: 4px;
        background: #E8E8E8;
        margin-left:16px;
        margin-right:16px;
        display: flex;
        position: relative;
      .icon-search{
        position: absolute;
        left: 8px;
        top: 8px;
      }
        input{
           width: 100%;
           height:30px;
           font-size: 14px;
           color: #999999;
           background: #E8E8E8;
           text-indent: 36px;
         }
      }
  }
</style>
