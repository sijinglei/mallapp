<template>
    <div>
      <mt-header title="服务消息">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
        <div slot="right" class="clear">
          <mt-button @click="removeall()">清空</mt-button>
        </div>
      </mt-header>
      <section class="section">
        <div class="content">
          <a @click="msgDetail(item.id)" v-for="item in ServiceList">
            <div class="main">
              <p class="times">{{item.sendTime}}</p>
              <div class="conbox">
                <div class="top">
                  <div class="tip">{{item.msgTitle}}</div>
                  <div class="dot" v-if="item.read == 0"></div>
                </div>
                <div class="bot">
                  <div class="tip">{{item.msgContent}}</div>
                  <div class="go"></div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
</template>
<script>
    import api from "@/api";
    export default {
        components: {},
        data() {
            return {
              serviceParams:{
                requrl:api.my.messagelist,
                inmail:0,       //服务消息
                isReader:2,     //0 未读消息列表 1已读消息列表 2：所有
                sendType:''     //是否全站发送
              },
              ServiceList:[],
              detailParams:{
                requrl:api.my.messagedetail,
                messageId:0
              }
            }
        },
        mounted: function () {
          this.getServiceList();
        },
        methods: {
          msgDetail(id){
            var that = this;
            that.detailParams.messageId=id;
            that.$axios.get(api.get,{params:that.detailParams}).then(data =>{
              that.$router.push({path:'/coupon2'});
            })
          },
          goBack () {
            this.$router.go(-1);
          },
          //消息清空
          removeall(){
            var that = this;
            that.$axios.post(api.post,{requrl:api.my.removeallmsg}).then(data =>{
              if(data.code = '999'){
                that.ServiceList = [];
              }
            })
          },
          getServiceList(){
            var that = this;
            that.$axios.get(api.get,{params:that.serviceParams}).then(data =>{
              console.log(data);
              if(data.code == '999'){
                let ServiceList = data.data.list;
                that.ServiceList = ServiceList;
              }
            })
          }
        }
    }
</script>
<style scoped lang="scss">
  @import "../../assets/css/global";
  .clear{
    color:$WtsColor;
  }
  .section .content{
    padding: 0 16px;
    .main{
      border-radius: 4px;
      .times{
        font-size: 12px;
        color: #999999;
        letter-spacing: 0.14px;
        text-align: center;
        margin: 8px 0;
      }
      .conbox{
        padding: 8px 16px;
        background: #FFF;
      }
      .top{
        position: relative;
        .tip{
          height: 30px;
          line-height: 22px;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0.19px;
          border-bottom: 1px solid #F0F0F0;
          font-weight: bold;
        }
        .dot{
          width: 6px;
          height: 6px;
          border-radius: 100%;
          background: #FB474F;
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
      .bot{
        font-size: 14px;
        color: #666666;
        margin: 8px 0;
        line-height: 21px;
        position: relative;
        .go:after{
          border: 2px solid #c8c8cd;
          border-bottom-width: 0;
          border-left-width: 0;
          content: " ";
          top: 50%;
          right: 5px;
          position: absolute;
          width: 5px;
          height: 5px;
          -webkit-transform: translateY(-50%) rotate(45deg);
          transform: translateY(-50%) rotate(45deg);
        }
      }
    }
  }
</style>
