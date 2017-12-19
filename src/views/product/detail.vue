<template>
    <div class="detail">
      <t-detail-head :isDetail="isDetail" @choseDetail="choseDetail"></t-detail-head>
        <div v-if="isDetail==0">
            <mt-loadmore :bottomMethod="loadBot"  :auto-fill="false" ref="loadBot">
             <div>
               <div slot="bottom" class="load-bottom">
                 上拉显示图文详情
               </div>
               <div class="detail-img">
                 <mt-swipe :auto="0" :show-indicators="false" @change="handleChange">
                   <mt-swipe-item  v-for="item in productDate.galleryVoList">
                     <img :src="item.imgUrl"/>
                   </mt-swipe-item>
                 </mt-swipe>
                 <div class="img-nub">{{hanleIndex}}/{{allImgLength}}</div>
               </div>
               <div class="content">
                 <p class="tit">{{productDate.name}}</p>
                 <p class="price"><span class="new"><i>¥</i><span v-text="price?price:0">{{price}}</span></span>
                   <del class="old" v-text="mktprice?'¥'+mktprice:0">¥{{mktprice}}</del>
                 </p>
                 <div class="cell-mt" @click="openSp">
                   <mt-cell is-link>
                     <div slot="title" class="cell-key">选择规格</div>
                     <div class="cell-value">{{specs}}</div>
                   </mt-cell>
                 </div>
                 <div class="cell-mt9" @click="openBa">
                   <mt-cell is-link>
                     <div slot="title" class="cell-key">说明</div>
                     <div class="cell-value">商品包税 | 假一赔十 | 全场免邮 | 不支持7天无理由退货，最多显示两行文字，超过过的文字用…省略</div>
                   </mt-cell>
                 </div>
               </div>
             </div>
            </mt-loadmore>
        </div>
        <div v-else>
          <mt-loadmore :topMethod="loadTop" :auto-fill="false"  ref="loadTot">
            <div slot="top" class="load-top">
              下拉显示商品
            </div>
            <div class="productT">
              <div class="odiv"></div>
              <div  v-html="productDate.intro"></div></div>

          </mt-loadmore>
        </div>
      <div class="detail-buy">
          <div class="customer">
            <i class="icon icon-cart"></i>
            <span>客服</span>
          </div>
          <div class="cart" @click="goCart">
            <i  class="icon icon-cart"></i>
            <span class="cnt" v-show="carsLength>0">{{carsLength}}</span>
            <span>购物车</span>
          </div>
          <a class="add-car" @click="openSp">{{btnText}}</a>
      </div>
        <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        position="bottom"
      >
        <component v-bind:is="choseCar" @setId="setId" @hidePopup="hidePopup"  :productDateProp="productDate"  :productId="productId" :btnText="btnText"></component>
      </mt-popup>


    </div>
</template>

<script>
  import { Toast } from "mint-ui";
  import tDetailHead from '@/views/product/components/head';
  import api from "@/api";
  import tChose from '@/components/cars/detail-chose';
  import tDetailBasic from '@/views/product/components/basic'; //产品说明
  import tDetailintro from '@/views/product/components/intro';//
  export default {
      components:{
            tDetailHead,tChose,tDetailBasic,tDetailintro
        },
        data () {
            return {
              productDate: {}, //产品数据
              hanleIndex:1, //img index
              popupVisible:false, //
              choseCar:'',
              productId:this.$route.params.id,
              carsLength:0,//购物车数量
              isDetail:0,//是否详情
              nub:1,
              bottomAllLoaded:false,
              autoFill:true,
              isFir:true

            }
        },
        methods: {
          getDate(){
              let vm=this;
            vm.$axios.get(api.get,{
              params:{
                requrl:api.goods.productinfobyid,
                id:vm.productId
              }
            }).then((res)=>{
              if(res.code=='999'){
                 // vm.allImgLength=res.data.galleryVoList.length;
                  vm.productDate=res.data
              }else {
                Toast({
                  message: res.message,
                  className:'zIndex4'
                });
              }

            }).catch((err)=>{
              Toast({
                message: err.message,
                className:'zIndex4'
              });
            })
          },
          getSp(key){
            //获取商品数据
            var vm=this;
            var val='';
            if(this.productDate.productVoList&&this.productDate.productVoList.length>0){
              this.productDate.productVoList.forEach((item)=>{
                if(vm.productId==item.id){
                  val=item[key]
                }
              });
              return val;
            }

          },
          handleChange(index){
              this.hanleIndex=index+1;
          },
          loadBot(){
              //下拉事件
            let vm=this;
            vm.isDetail=1;
            vm.$refs.loadBot.onBottomLoaded();
           // vm.bottomAllLoaded=true

          },
          loadTop(){
              this.isDetail=0;
              this.$refs.loadTot.onTopLoaded();
             // this.bottomAllLoaded=false;
          },
          choseDetail(val){
            this.isDetail=val;
          },
          top(){},
          openSp(){
              this.popupVisible=true;
              this.choseCar=tChose;
          },
          openBa(){
            this.popupVisible=true;
            this.choseCar=tDetailBasic;
          },
          setId(id){
              this.productId=id;
          },
          hidePopup(){
              this.popupVisible=false;

          },
          getPostDate(){
            let vm=this;
            let obj={};
            obj.productId=vm.productId
            obj.num=vm.nub;
            if(vm.productDate.vasTypeVoList.length>0){
              obj.leaseMonth=vm.tenancyId[vm.leaseMonth]
              obj.serviceIds=vm.serviceIds
            }
            return obj;
          },
          buy(){
              let vm=this;
            vm.$axios.post(api.post,{requrl:api.cart.add,...vm.getPostDate()})
              .then((res)=>{
                 if(res.code=='999'){
                   Toast({
                     message: '添加成功'
                   });
                 }
              })
          },
          goCart(){
              this.$router.push({name:'cars'})
          }
        },
        mounted() {
          var vm=this;
          vm.getDate();
          //获取购物车数量
          vm.$axios.get(api.get,{
            params:{
              requrl:api.cart.count
            }}).then((res)=>{
            vm.carsLength=res.data;
          }).catch((err)=>{
            console.log(err.message)
          });
        },
        computed:{
          allImgLength(){
              //图片总张数
            if(this.productDate.galleryVoList){
              return this.productDate.galleryVoList.length
            }
          },
          specs(){
            //规格名称
            var specs=this.getSp('specs');
            return specs
          },
          specsids(){
            // 选中规格id
            var specsIds=this.getSp('specsIds');
            return specsIds.split('_')
          },
          price(){
            //价格
            var price=this.getSp('price');
            return price
          },
          mktprice(){
            //原价
            var mktprice=this.getSp('mktprice');
            return mktprice
          },
          tenancyId(){
            //租期
            if(this.productDate.tenancy!=''){
              return this.productDate.tenancy.split(',')
            }
          },
          serviceIds(){
            let arr=[];
            if(this.productDate.vasTypeVoList.length>0){
              this.productDate.vasTypeVoList.forEach((item)=>{
                item.goodsVasVoList.forEach((citem)=>{
                  if(citem.isChecked==true || citem.isCheck){
                    arr.push(citem.id)
                  }
                })
              });
              return arr;
            }

          },
          btnText(){
            if(this.productDate.vasTypeVoList&&this.productDate.vasTypeVoList.length>0){
                return '立即租贷'
            }else {
                return '我的购物车'
            }
          }
          }

    }
</script>

<style lang="scss" scoped>
  .odiv{width: 100%;height: 50px;/*no*/}
.detail{
padding-top: 44px;/*no*/
  .mint-popup{width: 100%!important;}
  .mint-loadmore{padding-bottom: 70px;}

  .content{

    .cell-mt{margin-top: 1px;/*no*/}
    .cell-mt9{margin-top: 9px;}
    .cell-key{font-size: 14px;color: #333333;}
    .cell-value{color: #999999;font-size: 14px;width: 267px; overflow : hidden;
      text-overflow: ellipsis;
      text-align: right;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      line-height: 18px;
      -webkit-box-orient: vertical;}
    .tit{
      background-color: #ffffff;
      padding: 16px 16px 4px 16px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      font-size: 16px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 22px;
    }
    .price{
      padding: 6px 16px 13px 16px;
      background-color: #ffffff;
      .new{
        color: #FF7733;
        i{font-size: 16px;margin-right: 3px;font-style: normal;}
        font-size: 24px;
        margin-right: 4px;
      }
      .old{
        color: #999999;
        font-size:  16px
      }
    }
  }
  .detail-buy{
    width: 100%;
    height:48px;
    display: flex;
    position: fixed;
    bottom: 0;left: 0;
    text-align: center;
    background-color: #ffffff;
    font-size: 10px;
    border-top: 1px solid #f3f3f3;/*no*/
    .icon{
      font-size: 20px;/*no*/
      display: block;
      padding: 5px 0;
      margin: 0 auto;
    }
    .customer{
      .icon{
        padding: 10px 12px 0px 12px;/*no*/
      }
      flex-shrink: 0;
      width: 56px;
      height: 100%;
      border-right: 1px solid #f3f3f3;/*no*/

    }
    .cart{
      .icon{
        padding: 10px 12px 0px 12px;/*no*/
      }
      flex-shrink: 0;
      width: 56px;
      height: 100%;
      position: relative;
    }
    .add-car{

      display: block;
      width: 100%;
      background-color: #FF7733;
      line-height: 48px;
      color: #ffffff;
      font-size: 16px;
    }
  }
}
.detail-img{
  height: 375px;
  position: relative;
  .img-nub{
    background-color: #f3f3f3;
    border-radius: 4px;
    color: #666666;
    line-height: 17px;
    padding: 2px 6px;
    position: absolute;
    right: 16px;
    bottom: 16px;
    font-size: 12px;
  }
}
.load-bottom{text-align: center;font-size: 12px;color: #666666;padding: 8px 0;margin-bottom: -70px;}
.load-top{text-align: center;font-size: 12px;color: #666666;padding: 8px 0;margin-top: -70px;}
.mint-swipe{
  width: 100%;
  height: 375px;
  .mint-swipe-item{
    text-align: center;
  }
  img{height: 100%;object-fit: cover}
}
.cnt {
  position: absolute;
  width: 18px;
  height: 18px;
  line-height: 18px;
  background-color: red;
  border-radius: 50%;
  color: #fff;
  font-size: 8px;
  text-align: center;
  top: 4px;
  right: 4px;
}
.fold-enter-active {
  position: fixed;
  top: 0;
  left: 0;
}
.fold-leave-active {
  top: 100px;
  left: 0;
}


</style>
