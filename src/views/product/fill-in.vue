<template>
    <div class="">
      <t-dhead :Title="pageTitle"></t-dhead>
      <mt-cell is-link :to="{name:'Address'}">
        <div slot="title" class="cell-key">
          <div class="address-box">
            <div v-if="currentAddress">
              <p class="name-mobile"><span class="name">{{currentAddress.name}}</span><span class="mobile">{{currentAddress.mobile}}</span><span class="defAddr" v-if="currentAddress.defAddr==1">默认</span></p>
              <p class="address">{{currentAddress.province}}{{currentAddress.city}}{{currentAddress.region}}{{currentAddress.town}}{{currentAddress.addr}}</p>
            </div>
          </div>
        </div>
      </mt-cell>
      <div class="coupon-box" @click="addcoupon">
        <mt-cell is-link  >
          <div slot="title" class="cell-key">
            优惠券
          </div>
          <div class="coupon text-over">
            <span v-text="productDate.coupon==null?'无可用':productDate.coupon.availableList.length+'张可用'"></span>
            <span v-if="couponUsed">/-￥{{couponUsed.money}}</span>
          </div>
        </mt-cell>
      </div>
      <mt-cell>
        <div slot="title" class="cell-key">
          商品合计
        </div>
        <div class="priceAll text-over">
          ￥{{price}}
        </div>
        <div class="bor-line"></div>
      </mt-cell>
      <mt-cell>
        <div slot="title" class="cell-key">
          运费
        </div>
        <div class="price-freight text-over">
          <span v-if="isFreight" class="icon-freight">免运费</span>￥{{priceFreight}}
        </div>
        <div class="bor-line"></div>
      </mt-cell>
      <mt-cell>
        <div slot="title" class="cell-key">
          优惠券
        </div>
        <div class="coupon-price text-over">
          <span  v-if="couponUsed">-￥{{couponUsed.money}}</span>
        </div>

      </mt-cell>
      <div class="enter-prise-pay" v-show="productDate.enterprisePay=='1'">
        <mt-cell>
          <div slot="title" class="cell-key">
            付款方式
          </div>
          <div class="pay-type text-over">
             全款
          </div>
        </mt-cell>
      </div>
      <div class="coupon-box">
        <mt-cell>
          <div slot="title" class="cell-key">
            支付方式
          </div>
          <div class="color-333 text-over">
            暂且支持微信支付
        </div>
        </mt-cell>
      </div>
      <div class="remark-box" @click="openRemark">
        <mt-cell is-link>
          <div slot="title" class="cell-key">
            买家留言
          </div>
          <div class="text-over" >
          {{postDate.remark}}
        </div>
        </mt-cell>
      </div>
      <t-dateil :detail="productDate.productList"></t-dateil>
      <div class="fill-in-btn">
        <div class="text">
          应付:<span class="pay"><span class="ic">￥</span>{{pay}}</span>
        </div>
        <div class="btn" @click="addProduct">提交订单</div>
      </div>
    </div>
</template>

<script>
    import tDhead from '@/components/common/head-d';
    import api from '@/api/';
    import tDateil from '@/views/product/components/list';
    import { MessageBox } from 'mint-ui';
    import {mapState} from 'vuex'
    export default {
        components: {tDhead,tDateil},
        data () {
            return {
              pageTitle:"填写订单",
              coupon:{
                nub:1,
                money:2
              },
              currentAddress:{},
              postDate:{},//提交数据
              isFreight:true,//是否免运费
              priceFreight:0,//运费
              nowAddIndex:false,

            }
        },
        methods: {
            init(){
            //  this.getDate();
              window.localStorage.removeItem('CHECKEDCOUPON');//清空优惠券
            },
            openRemark(){
                  //买家留言
              let vm=this;
              MessageBox.prompt('请输入姓名','',).then((res)=>{
                  vm.$set(vm.postDate,'remark',res.value)
              })
            },
          addcoupon(){
                let vm=this;
                window.localStorage.setItem('PRODUCTSCOUPON',JSON.stringify(vm.productDate.coupon));
                this.$router.push({name:'coupon-wts',query:{id:vm.couponUsed?vm.couponUsed.id:0}});
          },
            getProducts(){
                let vm=this;
                let productList=[];
              if(vm.productDate) {
                vm.productDate.productList.forEach((item)=>{
                  let obj={};
                  obj.productId=item.productId;
                  obj.num=item.num;
                  if(obj.leaseMonth!=null){
                    obj.leaseMonth=item.leaseMonth;
                  }
                  obj.serviceIds=function () {
                    let arr=[];
                    item.services.forEach((item)=>{
                      arr.push(item.id);
                    });
                    return arr;
                  };
                  productList.push(obj);
                })
                return productList
              }},
            getCouponUsed(){
                if(this.couponUsed){
                    return this.couponUsed.id
                }
            },
            getPostDate(){
                let vm=this;
                //整理上传数据
              vm.postDate.addressId=vm.currentAddress.id;
              vm.postDate.myCouponId=vm.getCouponUsed();
              vm.postDate.leasePayType=vm.productDate.leasePayType;
              vm.postDate.products=vm.getProducts();
              return vm.postDate;
            },
            addProduct(){
                let vm=this;
              vm.$axios.post(api.post,{requrl:api.order.add,...vm.getPostDate()})
                .then((res)=>{
                  if(res.code=='999'){
                    vm.Toast({
                      message: '付款成功'
                    });
                    this.router.push({name:'Home'})
                  }
                })
            },
          currentAdd(){
                //地址
            let vm=this;
            if(vm.address.length>0){
              vm.$set(vm,'currentAddress',vm.address[0])
            }else {
              vm.productDate.addressList.forEach((item)=>{
                if(item.defAddr==1){
                  vm.currentAddress= item;
                }
              })
            }
          },
        },
        created(){

        },
        mounted() {
           this.init();
            this.currentAdd();
        },
        computed: {
          price(){
              let price=0;
              this.productDate.productList.forEach((item)=>{
                price+=(item.price*item.num)
              });
            return price
          },
          pay(){
              let conMoney=0;
              if(this.couponUsed){
                conMoney=this.couponUsed.money
              }
              let pay=this.price-conMoney+this.priceFreight;
              if(pay>0){
                  return pay
              }else {
                  return 0
              }
          },
          ...mapState({
            //状态里面地址
            address:state => state.product.address
          }),
          productDate() {
            if(this.$store.state.cars.productDate.addressList!=undefined){
              return this.$store.state.cars.productDate
            }else {
              return JSON.parse(window.localStorage.getItem('PRODUCTDATE'));
            }
          },
          couponUsed(){
              //使用的优惠券
              let data=JSON.parse(window.localStorage.getItem('CHECKEDCOUPON'));
              if(data){
                  return data
              }
          }
        },
        watch:{
            'productDate.addressList'(n,o){
              this.$set(this.productDate,'addressList',n)
            },


        }
    }
</script>

<style lang="scss" scoped>
  .color-333{color: #333333}
  .cell-key{padding-left: 8px;}
  .text-over{
    width: 210px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
  }
  .bor-line{height: 1px;/*no*/;background-color: #f3f3f3;position: absolute;left: 16px;bottom: 0;width: 100%}
.address-box{
  font-size: 14px;
  color: #333333;
  padding: 16px;
  .name-mobile{
    line-height: 20px;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .name{
      padding-right: 4px;
    }
    .mobile{
      padding-right: 4px;
    }
    .defAddr{
      padding:2px 4px;
      display: inline-block;
      color: #FF9A00;
      line-height: 17px;
      font-size: 12px;
      border: 1px solid #FF9A00;
    }
  }
  .address{
    width: 68%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999999;
  }
  .coupon{
    padding: 16px;
    color: #333333;
  }
}
.enter-prise-pay{margin-top: 9px;}
.coupon-box{margin: 9px 0;}
.priceAll{color: #FF7733;padding-right: 16px;}
  .price-freight{color: #FF7733;padding-right: 16px;
    .icon-freight{font-size: 12px;display: inline-block;border: 1px solid #FF9A00;margin-right: 4px;padding: 2px 4px;line-height: 17px;}
  }
  .coupon-price{color: #FF7733;padding-right: 16px;}
  .fill-in-btn{width: 100%;position: fixed;z-index: 10;height: 48px;/*no*/;line-height: 48px;/*no*/;display: flex;background-color: #FFFFFF;
    bottom: 0;left: 0;
    .text{
      padding-left: 16px;
      flex-shrink: 2;
      width: 100%;
      color: #666666;
      .pay{
        font-size: 18px;
        color: #FF7733 ;
        padding-left: 8px;
        .ic{font-size: 12px;line-height: 17px;}
      }
    }
    .btn{
      width: 113px;color: #FFFFFF;text-align: center;background-color: #FF7733;
    }

  }
</style>
