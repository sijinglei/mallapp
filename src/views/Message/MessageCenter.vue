<template>
    <div>
      <mt-header title="消息中心">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
      </mt-header>
      <div class="content">
        <router-link to="/serviceinfo">
          <div class="main">
            <div class="left">
              <div class="icon">
                <img src="../../assets/images/zxkf.png">
              </div>
              <div class="text">
                <p class="title">在线客服</p>
                <p class="described">查看与客户的沟通记录</p>
              </div>
            </div>
            <div class="right"></div>
          </div>
        </router-link>
        <router-link to="/serviceinfo" >
          <div class="main">
            <div class="left">
              <div class="icon">
                <img src="../../assets/images/fwxx.png">
              </div>
              <div class="text">
                <p class="title">服务消息</p>
                <p class="described">您有{{serviceMsgCount}}张优惠券到账了</p>
              </div>
            </div>
            <div class="right">
              <div class="infonum" v-show="serviceMsgCount>0">{{serviceMsgCount}}</div>
            </div>
          </div>
        </router-link>
        <router-link to="/systeminfo">
          <div class="main">
            <div class="left">
              <div class="icon">
                <img src="../../assets/images/xtxx.png">
              </div>
              <div class="text">
                <p class="title">系统消息</p>
                <p class="described">根据后台站内信发送最新消息显示,超…</p>
              </div>
            </div>
            <div class="right">
              <div class="infonum" v-show="sysMessageCount>0">{{sysMessageCount}}</div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
</template>
<script>
  import api from "@/api";
    export default {
        components: {},
        data() {
            return {
              // serviceParams:{
              //   requrl:api.my.messagelist,
              //   inmail:1,       //系统消息
              //   isReader:2,     //0 未读消息列表 1已读消息列表 2：所有
              //   sendType:''     //是否全站发送
              // },
              changeColor:false,
              serviceMsgCount:0,
              sysMessageCount:0
            }
        },
        created () {
          var vm=this;
          vm.getCouponMsg();
        },
        methods: {
          getCouponMsg(){
            var that = this;
            that.$axios.get(api.get,{params:{requrl:api.my.messageunread}}).then(res =>{
              that.serviceMsgCount=res.data.serviceMsgCount;
              that.sysMessageCount=res.data.sysMessageCount;
            })
          },
          goBack(){
            this.$router.go(-1);
          },
        }
    }
</script>
<style scoped lang="scss">
  @import "../../assets/css/global";
  .abc{
    background:green;
  }
  .content{
    margin-top: 9px;
    .main{
      display: flex;
      height: 40px;
      padding: 8px 16px;
      background: #FFFFFF;
      position: relative;
      border-bottom: 1px solid #F5F5F5;
      .left{
        display: flex;
        img{
          width: 40px;
          height: 40px;
          -webkit-background-size: cover;
          background-size: cover;
        }
        .text{
          margin-left: 16px;
          .title{
            font-size: 14px;
            color: #333333;
            font-weight: bold;
          }
          .described{
            font-size: 12px;
            color: #999999;
            margin-top:10px;
          }
        }
      }
      .right:after{
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
    }
    .infonum{
      position: absolute;
      top: 17px;
      right:30px;
      width: 22px;
      height: 22px;
      background: #FE3824;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      color: #FFFFFF;
      border-radius: 100%;
    }
  }

</style>
