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
          <div  class="normdlist" v-for="(spec,cindex) in carDate.detail.specVoList">
            <p class="tit">{{spec.name}}</p>
            <div class="item " v-for="(ms,msindex) in spec.specValueVoList">
              <span class=" rk" :class="{'backtheme':ms.isActive}" @click="changeSpecs(cindex,ms.id)">{{ms.name}}</span>
            </div>
          </div>
        </div>
      </div>
       <div class="mor-box">
         <div class="snub bot-b">数量
        <t-chose :data="carDate.cardata" :index="nubIndex" ></t-chose>
         </div>
       </div>

      <div class="normdlist-box" v-if="carDate.detail.tenancy!=''">
        <div class="bot-b">
          <p class="tit">租期</p>
          <div class="item " v-for="(item,index) in tenancyId">
            <span class=" rk" @click="leaseMonth=index" :class="{'backtheme':index==leaseMonth}">{{item}}个月</span>
          </div>
        </div>
      </div>
      <div class="mor-box">
        <p class="volist-tit">服务</p>
        <div class="volist-content" v-for="(item,index) in carDate.detail.vasTypeVoList">
          <p class="center">{{item.name}}</p>
          <div v-for="(citem,cindex) in item.goodsVasVoList" >
            <div class="volist-box" @click="checkType(citem,index)">{{citem.vasTypeName}} | ¥{{citem.cost}} ({{citem.isCheck | isCheck}}) <span
              class="mint-checkbox">
                  <input type="checkbox" class="mint-checkbox-input" value="optionA" :checked="citem.isChecked || citem.isCheck">
                   <span class="mint-checkbox-core"></span>
                </span></div>
          </div>
        </div>
      </div>
      <a class="btn active" v-if="enable==0">无货</a>
      <a v-else class="btn" @click="postDate">确定</a>
    </div>
    </div>
</template>

<script>
  import api from '@/api/index';
  import { Toast } from "mint-ui";
  import tChose from '@/components/cars/choose-amount'
    export default {
        data () {
            return {
              productId:JSON.parse(localStorage.getItem('CAR_EDIT')).id,//商品id
              id:JSON.parse(localStorage.getItem('CAR_EDIT')).id,
              productNub:0,//商品数量
              spec:{},//当前规格
              specAll:{},//所有规格
              nubIndex:JSON.parse(localStorage.getItem('CAR_EDIT')).index,//index
              //购物车给过来的数据{id:当前商品id,detail:当前商品详情,postdata:购物车上传数据,cardata:购物车列表数据,index:当前商品在购物车的索引}
              carDate:JSON.parse(localStorage.getItem('CAR_EDIT')),
              leaseMonth:0//租期初始值 index
              //productVoList 各类规格商品
            }
        },
        methods: {
            getSp(key){
                //获取商品数据
              var vm=this;
              var val='';
              this.carDate.detail.productVoList.forEach((item)=>{
                if(vm.productId==item.id){
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
              this.carDate.detail.productVoList.forEach((item)=>{
                  if(item.specsIds==this.specsids.join('_')){
                    vm.productId=item.id;
                  }
              })
            },
            activeTheme(specsids){
              let vm=this;
              this.carDate.detail.specVoList.forEach((item)=>{
                item.specValueVoList.forEach((valItem)=>{
                  vm.$set(valItem,'isActive',false);
                })
              });

              this.carDate.detail.specVoList.forEach((item)=>{
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
        this.carDate.detail.vasTypeVoList[index].goodsVasVoList.forEach((item)=>{
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

          nubSub(index){
            if(this.carDate.cardata[index].num<=1){
              this.carDate.cardata[index].num=1
            }else {
              this.carDate.cardata[index].num--;
            }
          },
          nubAdd(index,promptNum){
            if(this.carDate.cardata[index].num>=9999 || this.carDate.cardata[index].num>=promptNum){
              this.carDate.cardata[index].num=promptNum
            } else {
              this.carDate.cardata[index].num++;
            }

          },
          nubChange(index,nub,promptNum){
            if(this.carDate.cardata[index].num>=9999 || this.carDate.cardata[index].num>=promptNum){
              this.carDate.cardata[index].num=promptNum
            } else if(nub<=1){
              this.carDate.cardata[index].num=1;
            }else {
              this.carDate.cardata[index].num=nub;
            }
          },
          //提交
          postDate(){
            var vm=this;
            if(vm.id==vm.productId){
              vm.$axios.post(api.post,{requrl:api.cart.edit, data:[{productId:vm.id,
                toNum:vm.carDate.cardata[vm.nubIndex].num,
                isCheck:1}]
              })
                .then((res)=>{
                  if(res.code=='999'){
                    vm.$emit('hidepopup',vm.carDate.cardata,vm.nubIndex)
                  }else {
                    Toast({
                      message: ""+res.message+""
                    });
                  }
                })
                .catch((err)=>{
                  console.log(err);
                })
            }else {
              vm.$axios.post(api.post,{requrl:api.cart.change,  productId:vm.id,
                updateId:vm.productId,
                toNum:vm.carDate.cardata[vm.nubIndex].num
              })
                .then((res)=>{
                  if(res.code=='999'){
                    vm.$emit('hidepopup',vm.carDate.cardata,vm.nubIndex)
                  }else {
                    Toast({
                      message: ""+res.message+""
                    });
                  }
                })
                .catch((err)=>{
                  console.log(err);
                })
            }



          }
        },
        created(){
          this.activeTheme(this.specsids)
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
            this.carDate.detail.galleryVoList.forEach((item)=>{
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
          tenancyId(){
            //租期
            if(this.carDate.detail.tenancy!=''){
              return this.carDate.detail.tenancy.split(',')
            }
          },
          serviceIds(){
            let arr=[];
            this.carDate.detail.vasTypeVoList.forEach((item)=>{
              item.goodsVasVoList.forEach((citem)=>{
                if(citem.isChecked==true || citem.isCheck){
                  arr.push(citem.id)
                }
              })
            });
            return arr;
          }

        },
        components: {tChose}
    }
</script>


<style lang="scss" scoped>
  @import "../../assets/css/global";
  .gray{color: #cccccc!important;}
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
    .normd{
      height:313px ;
      padding-bottom: 50px;/*no*/
      overflow-y: auto;
      .btn{height: 48px;background-color: $WtsColor ;line-height: 48px;text-align: center;font-size:16px; display: block;position: absolute;left: 0;bottom: 0;width: 100%;color: #ffffff;
         &.active{
        background-color:#B3E5BB!important;
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
        padding-bottom: 8px;

      }
    }

    .snub{
      display: flex;justify-content: space-between; padding-bottom: 11px; }
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
  .mor-box{
    padding:  11px 16px 0 16px;
  }
  .bot-b{border-bottom: 1px solid #f0f0f0;/*no*/width: 100%}
</style>
