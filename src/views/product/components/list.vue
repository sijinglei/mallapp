<template>
    <div class="box">
        <div class="product-list" v-for="item in detail">
          <div class="img">
            <img :src="item.imageUrl"  width="72" height="72" />
          </div>
          <div class="content">
            <p class="name text-over">{{item.name}}</p>
            <p class="specs text-over">{{item.specs}}</p>
            <p class="price text-over">¥{{item.price}}<span class="nub">x{{item.num}}</span></p>
          </div>
        </div>
    </div>
</template>

<script>

    export default {
        name:'detailList',//商品组件
        props:['detail'],
        components: {},
        data () {
            return {}
        },
        methods: {},
        mounted() {

        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
  .bor-line{height: 1px;/*no*/;background-color: #f3f3f3;position: absolute;left: 16px;bottom: 0;width: 100%}
  .text-over{
    width: 263px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .box{
    margin-top: 9px;
    background-color: #ffffff;
    padding: 0 16px;
    .product-list{
      display: flex;
      padding:8px 0;
      border-bottom: 1px solid #f3f3f3;/*no*/
      .img{
        margin-right: 8px;
      }
      .content{

        .name{line-height: 20px;color: #333333;margin-bottom: 4px;}
        .specs{line-height:17px; color: #999999;margin-bottom: 9px;}
        .price{
          line-height: 22px;color: #FF7733;
          font-size: 16px;
          .nub{
            float: right;
            font-size:12px ;
            color: #999999;
          }
        }
      }
    }
  }


</style>
