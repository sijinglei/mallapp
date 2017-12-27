<template>
    <div class="box">
      <div @click="back()">
        <i class="icon icon-zjt"></i>
      </div>
      <div class="product-switch">
        <span :class="{'active':isDetail==0}" @click="chose(0)">商品</span>
        <span :class="{'active':isDetail==1}" @click="chose(1)">详情</span>
      </div>
      <div>
        <i class="icon icon-share" @click="shareShow"></i>
      </div>
    </div>
</template>

<script>
    export default {
        name:'detailHead',//商品详情头部
        props:['isDetail'],
        data () {
            return {}
        },
        methods: {
          back(){
            this.$router.go(-1);
          },
          chose(val){
              this.$parent.choseDetail(val)
          },
          shareShow(){
              this.$emit('shareShow',true)
          }
        },
        mounted() {

        },
        components: {}
    }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/minx";
  .box{
    height: 42px;/*no*/
    padding: 6px 16px;/*no*/
    display: flex;
    justify-content: space-between;
    line-height: 32px;/*no*/
    background-color: #ffffff;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    position: fixed;
    box-sizing: border-box;
    .icon-zjt,.icon-share{  font-size: 16px;}
    .product-switch{
      border: 1px solid $WtsColor;/*no*/
      height: 32px;/*no*/
      width: 122px;/*no*/
      box-sizing: border-box;
      border-radius: 4px;
      background-color: red;
      span{
        width: 50%;
        height: 100%;
        display: inline-block;
        background-color: #ffffff;
        line-height: 30px;/*no*/
        text-align: center;
        color: $WtsColor;
        float: left;
      }
      .active{
        background-color: $WtsColor;
        color: #ffffff;
      }
    }
  }
</style>
