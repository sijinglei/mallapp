<template>
    <section class="detail">
        <div v-if="infos.showStyleType==6">
             <h4 class="products-head">{{infos.infos[0].title}}<i class="icon-arrow-circle-o-right iconfont"></i></h4>
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="ms in infos.products.slice(0,8)">
                    <img class="detail-img" :src="ms.imageUrl" :alt="ms.name" />
                    <p class="name">{{ms.name}}</p>
                    <p class="price"><span class="new-price"><span class="cl">¥</span>{{ms.price}}</span><span class="market">¥{{ms.marketPrice}}</span></p>
                  </div>
                  <div class="swiper-slide more">
                    <p>查看全部</p>
                    <p>See more</p>
                  </div>
                </div>
              </div>
        </div>
        <div v-else>
             <h4 class="products-head">{{infos.infos[0].title}}<i class="icon-arrow-circle-o-right iconfont"></i></h4>
              <t-banner :imgs="infos.infos.slice(1,)"></t-banner>
              <div class="swiper-container mt-10">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="ms in infos.products.slice(0,8)">
                    <img class="detail-img" :src="ms.imageUrl" :alt="ms.name" />
                    <p class="name">{{ms.name}}</p>
                    <p class="price"><span class="new-price"><span class="cl">¥</span>{{ms.price}}</span><span class="market">¥{{ms.marketPrice}}</span></p>
                  </div>
                  <div class="swiper-slide more">
                    <p>查看全部</p>
                    <p>See more</p>
                  </div>
                </div>
              </div>
        </div>
    </section>
</template>

<script>
  import tBanner from '@/components/home/banner'
  import Swiper from './../../../static/swiper/js/swiper.min'
  import './../../../static/swiper/css/swiper.min.css'
    export default {
        props:['infos'],
        data () {
            return {}
        },
        methods: {},
        mounted: function () {
          setTimeout(function () {
            var swiper = new Swiper('.swiper-container', {
              slidesPerView: 'auto',
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
            });
          },60)
        },
        components: {
          tBanner
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minx";
  .detail{
    padding: 0 0 0 16px;
    background:#FFFFFF;
    .products-head{
      height: 41px;
      text-align: center;
      background-color: #FFFFFF;
      padding-top: 16px;
      font-size: 18px;
      line-height: 25px;
      margin-top:10px ;
    }
    .detail-img{
      width: 98px;
      height: 98px;

    }
    .mt-10{margin-top: 10px}
    .swiper-slide{
      margin-right: 8px;
      width: 98px;
      padding-bottom: 30px;
      margin-bottom:10px ;
      .name{
        font-size: 12px;
        width: 90px;
        white-space: normal;
        text-overflow: ellipsis;
        overflow:hidden;
        color: #666666;
        padding: 8px 0 12px 0;
      }
      .price{
        text-align: center;
        padding-bottom: 8px;
        .new-price{
          color: #FF5000;
          font-size: 14px;
          margin-right: 4px;
          .cl{
            font-size: 10px;
          }
        }
        .market{
          text-align: center;
          font-size: 10px;
          color: #999999 ;
          text-decoration:line-through;
        }
      }
    }
    .swiper-wrapper{
      .more{
        width: 98px;
        height: 68px;
        padding-top: 30px;
        text-align: center;
        border: 2px solid #f3f3f3;
        padding-bottom: 0;
        & p:first-child{
          font-size: 11px;
          margin: 0 auto;
          line-height: 17px;
          padding-bottom: 4px;
          color: #329BFF ;
        }
        & p:nth-child(2){
          font-size: 10px;
          display: inline-block;
          border-top: 1px solid #ccc;
          text-align: center;
          padding-top: 2px;
        }
      }
    }
  }

</style>
