<template>
    <div>
      <mt-header title="系统消息">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
      </mt-header>
      <section class="content">
        <a v-for="item in SystemInfo" @click="systemInfo(item.id)">
          <div class="main">
            <p class="times">{{item.sendTime}}</p>
            <div class="conbox">
              <div class="top">
                <div class="tip-title">{{item.msgTitle}}</div>
                <div class="tip-text">{{item.msgContent}}</div>
                <div class="dot" v-if="item.read == 0"></div>
              </div>
              <div class="bot">
                <div class="tip">查看详情</div>
                <div class="go"></div>
              </div>
            </div>
          </div>
        </a>
      </section>
    </div>
</template>
<script>
    import api from "@/api";
    export default {
        components: {},
        data() {
            return {
              systemParams:{
                requrl:api.my.messagelist,
                inmail:1,       //系统消息
                isReader:2,     //0 未读消息列表 1已读消息列表 2：所有
              },
              SystemInfo:[]
            }
        },
        mounted () {
          this.getSystemList();
        },
        methods: {
          goBack () {
            this.$router.go(-1);
          },
          systemInfo(id){
          this.$router.push({path:'/infodetail',query:{id:id}});
          },
          getSystemList(){
            var that = this;
            that.$axios.get(api.get,{params:that.systemParams}).then(data =>{
              if(data.code == '999'){
                let SystemInfo = data.data.list;
                this.SystemInfo = SystemInfo;
                console.log(SystemInfo);
              }
            })
          }
        }
    }
</script>
<style scoped lang="scss">
  @import "../../assets/css/global";
  .content{
    padding: 10px 18px;
    .main{
      border-radius: 4px;
      margin-bottom:10px;
      .times{
        font-size: 12px;
        color: #999999;
        letter-spacing: 0.14px;
        text-align: center;
        margin-bottom: 10px;
      }
      .conbox{
        padding: 10px 18px;
        background: #FFF;
      }
      .top{
        position: relative;
        border-bottom: 1px solid #F0F0F0;
        .tip-title{
          font-size: 16px;
          color: #333333;
          letter-spacing: 0.19px;
          font-weight: bold;
          line-height: 18px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .tip-text{
          margin-top: 8px;
          font-size: 14px;
          color: #666666;
          line-height: 21px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .dot{
          width: 6px;
          height: 6px;
          border-radius: 100%;
          background: #FB474F;
          position: absolute;
          top: 8px;
          right: 4px;
        }
      }
      .bot{
        font-size: 14px;
        color: #666666;
        position: relative;
        margin-top:10px;
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
