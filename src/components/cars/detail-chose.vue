<template>
  <div class="norm">
    <div class="head">
      <img :src="imgUrl" class="shopImg" />
      <p class="price"><span class="sub">¥</span>{{price}}</p>
      <p class="withChose">已选择<span class="text">{{specs}}</span></p>
    </div>
    <div class="normd">
      <div class="normdlist-box">
        <div class="bot-b">
          <div  class="normdlist" v-for="(spec,cindex) in productDate.specVoList">
            <p class="tit">{{spec.name}}</p>
            <div class="item " v-for="(ms,msindex) in spec.specValueVoList">
              <span class=" rk" :class="{'backtheme':ms.isActive}" @click="changeSpecs(cindex,ms.id)">{{ms.name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mor-box">
        <div class="snub bot-b">
          数量
           <t-chose :promptNum="enableStore" :nub="productNub" ></t-chose>

        </div>
      </div>
      <div class="normdlist-box" v-if="productDate.tenancy!=''">
          <div class="bot-b">
            <p class="tit">租期</p>
            <div class="item " v-for="(item,index) in tenancyId">
              <span class=" rk" @click="leaseMonth=index" :class="{'backtheme':index==leaseMonth}">{{item}}个月</span>
            </div>
          </div>
      </div>
      <div class="mor-box"  v-if="productDate.vasTypeVoList.length>0">
        <p class="volist-tit">服务</p>
        <div class="volist-content" v-for="(item,index) in productDate.vasTypeVoList">
            <p class="center">{{item.name}}</p>
            <div v-for="(citem,cindex) in item.goodsVasVoList" >
              <div class="volist-box" @click="checkType(citem,index)">{{citem.vasTypeName}} | ¥{{citem.cost}}  ({{citem.isCheck | isCheck}}) <span
                class="mint-checkbox">
                  <input type="checkbox" class="mint-checkbox-input" value="optionA" :checked="citem.isChecked || citem.isCheck">
                   <span class="mint-checkbox-core"></span>
                </span></div>
            </div>
        </div>
      </div>
       <a class="btn active" v-if="enable==0">无货</a>
       <a v-else class="btn" @click="postDate">{{btnText}}</a>
     </div>
  </div>
</template>

<script>
  import api from '@/api/index';
  import { Toast } from "mint-ui";
  import tChose from '@/components/cars/choose-amount-n'
    export default {
      props:['productDateProp','productId','btnText'],
      data () {
        return {
          id:this.productId,
          productNub:1,//商品数量
          productDate:this.productDateProp,
          leaseMonth:0//租期初始值 index
        }
      },
      methods: {
        getSp(key){
          //获取商品数据
          var vm=this;
          var val='';

          this.productDate.productVoList.forEach((item)=>{
            if(vm.id==item.id){
              val=item[key]
            }
          });
          return val;
        },
        changeSpecs(index,id){
          //修改规格
          var vm=this;
          this.$set(this.specsids,index,id);
          this.activeTheme(this.specsids);
          this.productDate.productVoList.forEach((item)=>{
            if(item.specsIds==this.specsids.join('_')){
              vm.id=item.id;
            }
          });
          this.$emit('setId', this.id)
        },
        activeTheme(specsids){
          let vm=this;
          this.productDate.specVoList.forEach((item)=>{
            item.specValueVoList.forEach((valItem)=>{
              vm.$set(valItem,'isActive',false);
            })
          });
          this.productDate.specVoList.forEach((item)=>{
            item.specValueVoList.forEach((valItem,index)=>{
              specsids.forEach((idsItem)=>{
                if(valItem.id==idsItem){
                  vm.$set(valItem,'isActive',true);
                }
              })
            })
          })
        },
        checkTypeMe(index){
            let vm=this;
            this.productDate.vasTypeVoList[index].goodsVasVoList.forEach((item)=>{
                if(item.isChecked){
                  vm.$set(item,'isChecked',false)
                }
            })
        },
        checkType(item,index){
            if(item.isChecked){
                item.isCheck==1?this.checkTypeMe(index)&&this.$set(item,'isChecked',true):item.isChecked==true?this.$set(item,'isChecked',false):this.checkTypeMe(index)&&this.$set(item,'isChecked',true)
            }else {
              this.checkTypeMe(index);
              this.$set(item,'isChecked',true);

            }
        },
        //提交
        getPostDate(){
            let vm=this;
          let obj={};
            obj.productId=vm.id
            obj.num=vm.productNub;
            if(vm.productDate.vasTypeVoList.length>0){
              obj.leaseMonth=vm.tenancyId[vm.leaseMonth]
              obj.serviceIds=vm.serviceIds
            }
            return obj;
        },

        postDate(){
          var vm=this;
          vm.$axios.post(api.post,{requrl:api.cart.add,...vm.getPostDate()})
            .then((res)=>{
              if(res.code=='999'){
                vm.$emit('hidePopup');
                this.$router.push({name:'cars'})
              }
          })
        },
      },
      created(){
        this.productDate=this.productDateProp;
        this.activeTheme(this.specsids);
      },
      mounted: function () {


      },
      filters:{
          isCheck(val){
              if(val=='1'){
                  return '必选'
              }else{
                  return '可选'
              }
          }
      },
      computed:{
        imgUrl(){
          //图片
          var imgUrl='';
          var masterSpec=this.getSp('masterSpec');//获取关联相册关联id
          this.productDate.galleryVoList.forEach((item)=>{
            if(masterSpec==item.specValueId && item.isDefault==1){
              imgUrl=item.imgUrl;
            }
          });
          return imgUrl;
        },
        price(){
          //价格
          var price=this.getSp('price');
          return price
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
        enable(){
          //库存
          var enable=this.getSp('enableStore');
          return enable

        },
        enableStore(){
            //最大数量
          var enableStore=this.getSp('enableStore');
          return enableStore
        },
        tenancyId(){
            //租期
            if(this.productDate.tenancy!=''){
              return this.productDate.tenancy.split(',')
            }
        },
        serviceIds(){
          let arr=[];
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
      components: { tChose}
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minx";
  @import "../../assets/css/global";
  .gray{color: #cccccc!important;}
  .mint-checkbox-input:checked + .mint-checkbox-core {
    background-color: $WtsColor;
    border-color: $WtsColor;
  }
  span.mint-checkbox-core{
    border-color: $WtsColor;
  }
  .mint-checkbox-label{
    font-size:14px;
  }
  .norm{
    width: 100%;
    background-color: #ffffff;
    color: #666666;
  .shopImg{
    width: 116px;height: 116px;
    position: absolute;top: -41px;left: 16px;
  }
  .head{
    border-bottom: 1px solid #F0F0F0;/*no*/
    height:84px; position: relative;
    padding-left:141px;
  .price{
    padding-top: 8px;
    padding-bottom: 2px;
    font-size: 20px;
    line-height: 28px;
    color: #FF5000;
  .sub{
    font-size:14px ;
  }
  }
  .withChose{
    font-size: 14px;
  .text{padding-left:8px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden ;display: inline-block;width: 120px;}
  }
  }
    .tenancy-tit{
       line-height: 22px;
       padding: 0 0 8px 0;
     }
  .normd{
    height: 253px;
    overflow: auto;
    padding-bottom: 60px;/*no*/
    .btn {
      height: 48px; /*no*/
      background-color: $WtsColor;
      line-height: 48px; /*no*/
      text-align: center;
      font-size: 16px;
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding:0;
      color: #ffffff;
      &.active {
        background-color: #B3E5BB !important;
      }
  }
  .tit{
    line-height: 22px;
    padding: 0 0 8px 0;
  }
  .item{
    display: inline-block;margin-right:16px ;margin-bottom:8px ;
  &.active{
     border: 1px solid #FF9A00;
     color: #FF9A00;
   }
  .rk{border: 1px solid #999999;  padding:4px 8px;
    display: inline-block;}
  .backtheme{
    border: 1px solid #42BD56;/*no*/
    background-color: #42BD56 ;color: #ffffff
  }
  .splist{float: left;margin-right: 16px;}
  }
  }
  .addSub{
    display: inline-block;
    border: 1px solid #CCCCCC;/*no*/
    border-radius: 4px;

  input{
    width: 28px;text-align: center;
    font-size: 12px;
    color: #666666;
  }
  .sub{
    color: #999999;
    padding: 0 8px;
  }
  .add{
    color: #999999;
    padding: 0 8px;
  }
  }
  .normdlist-box{
    padding:  8px 16px 0 16px;
    overflow-y: auto;
  .normdlist{

  }

  }
    .mor-box{
      padding:  11px 16px 0 16px;
    }
  .bot-b{border-bottom: 1px solid #f0f0f0;width: 100%}
  .snub{
    display: flex;justify-content: space-between; padding-bottom: 11px; }
  }
  .volist-tit{

  }
  .volist-content{
    .center{
      font-size: 14px;
      color: #999999;
      padding: 8px 0;
      text-align: center;
    }
    .volist-box{
      width: 100%;
      height: 48px;
      border: 1px solid #c7c7cd;border-radius: 4px;
      line-height: 48px;
      text-align: center;
      font-size: 14px;color: #333333;
      margin-bottom: 8px;
      position: relative;
      .mint-checkbox-core{
        position: absolute;
        right: 16px;
        top: 16px;
      }
    }
  }
  .volist-content{
    margin-bottom: 8px;
  }

</style>



















