<template>
    <div class="back-f5 pay-box">
      <t-pay-head :Title="tit"></t-pay-head>
       <!-- <div class="pay-result-box">
          <div class="text-center item">
            <img src="../../assets/images/success.png" />
            付款成功
            <div class="voucher">
            <span class="left-r it"></span>
            <span class="right-r it"></span>
             </div>
          </div>

          <div class="item">
            <p class="flexJ "><span>支付方式</span><span>微信支付</span></p>
            <p class="flexJ "><span>支付金额</span><span>￥180.00</span></p>
            <p class="pay-btn"><span>查看订单</span><span>回到首页</span></p>
          </div>
        </div>-->
        <div class="pay-result-box">
          <div class="text-center item">
            <img src="../../assets/images/fail.png" />
            付款失败
            <div class="voucher">
            <span class="left-r it"></span>
            <span class="right-r it"></span>
             </div>
          </div>

          <div class="item">
           <p class="fail-text">请在<span>N小时/分钟</span>内完成付款否则订单会被系统取消</p>
            <p class="pay-btn" ><span>查看订单</span><span :style="resultBtn.style">{{resultBtn.text}}</span></p>
          </div>
        </div>
    </div>
</template>

<script>
    import tPayHead from '@/components/common/head-d'
    export default {
        components: {tPayHead},
        data () {
            return {
                tit:'付款结果',
                resultBtn:{
                    style:'background: #FF7733;border-color:#FF7733',
                    text:'重新付款'
                }
            }
        },
        methods: {},
        mounted() {

        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";
  .pay-box{width: 100%}
.pay-result-box{
  padding: 16px;
  font-size: 16px;
  .item{
    background-color: #FFFFFF;
    padding-top: 16px;
    width:100%;
    position: relative;
    .fail-text{
      padding: 16px 24px 0 24px ;line-height: 24px;
      span{
        color: #FF7733;
      }
    }
    .voucher{
      height: 1px;
      position: absolute;
      width: 100%;
      z-index: 5;
      margin-top: 20px;
       border-bottom: 1px dashed #f5f5f5;/*no*/
      .it{
        position: absolute;
        display: block;
        width: 20px;height: 20px;border-radius: 50%; background-color: #f5f5f5;
      }
      .left-r{
        left: -10px;
        top: -10px;
      }
      .right-r{
        right: -10px;
        top: -10px;
      }
    }
    .pay-btn{
      padding: 40px 24px  16px 24px;
      display: flex;
      justify-content: space-between;
      span{
        width: 120px;
        height: 35px;
        line-height: 35px;
        text-align: center;border-radius: 4px;
      }
      span:first-child{
        border: 1px solid #999999;
        color: #999999;
      }
      span:last-child{
        border: 1px solid #42BD56;;
        color: #FFFFFF;
        background-color: #42BD56;;
     }
    }
  }
  .flexJ{
    padding: 16px 24px 0 24px;
    display: flex;justify-content: space-between;
    color: #333333;
    line-height: 22px;
    span:first-child{
      color: #999999;
    }
  }
  img{
    width: 66px;
    position: relative;
    display: block;
    margin: 0 auto 8px auto;
  }
}

</style>
