<template>
    <div>
      <mt-header title="消息详情">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
      </mt-header>
      <div class="content">
          <h1>{{InfoDetail.msgTitle}}</h1>
          <P v-text="InfoDetail.sendTime"></P>
          <div class="main" v-html="InfoDetail.msgContent"></div>
      </div>
    </div>
</template>
<script>
    import api from "@/api";
    export default {
        components: {},
        data() {
            return {
              detailParams:{
                requrl:api.my.messagedetail,
                messageId:0
              },
              InfoDetail:{
                msgTitle:'',
                sendTime:'',
                msgContent:''
              }
            }
        },
        created(){
          var vm = this;
          vm.detailParams.messageId = vm.$route.query.id;
          console.log(vm.detailParams.messageId);
        },
        mounted: function () {
          this.getDetailList();
        },
        methods: {
          goBack () {
            this.$router.go(-1);
          },
          getDetailList(){
            var that = this;
            that.$axios.get(api.get,{params:that.detailParams}).then(data =>{
              if(data.code == '999'){
                that.InfoDetail=data.data;
              }
            })
          }
        }
    }
</script>
<style scoped lang="scss">
  @import "../../assets/css/global";
  body{
    background-color:#FFF !important;
  }
  .mint-header{
    border-bottom: 1px solid  #F3F3F3;
  }
  .content{
    padding: 16px;
    h1{
      font-size: 18px;
      color: #333333;
      font-weight: bold;
    }
    p{
      font-size: 12px;
      color: #999999;
      margin-top: 12px;
    }
    .main{
      font-size: 14px;
      color: #666666;
      line-height: 21px;
      margin-top: 13px;
    }
  }
</style>
