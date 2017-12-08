<template>
    <div>
      <mt-header title="帮助中心">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
      </mt-header>
      <div class="content">
        <span class="min-title"></span>
        <div class="text">{{contents}}</div>

      </div>
    </div>
</template>
<script>
  import api from "@/api";
    export default {
        components: {},
        data() {
            return {
              params:{
                requrl:api.my.helpdetail,
                messageId:0
              },
              contents:[]
            }
        },
      created(){
        var vm=this;
        vm.params.messageId=vm.$route.query.id;
      },
        methods: {
          goBack () {
            this.$router.go(-1);
          },
          getDetail(){
            var that = this;
            this.$axios.get(api.get,{params:that.params}).then(data =>{
              if(data.code == '999'){
                let thisContent = data.data.content;
                console.log(data.data);
                this.contents =thisContent;
              }
            })
          }
        },
        mounted: function () {
          this.getDetail();
        }
    }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/global";
  .min-title{
    display: block;
    height: 26px;
    font-size: 12px;
    color: #666666;
    padding:24px 0 0 16px;
  }

  .text{
    padding:13px 16px;
    height:100%;
    background: #FFF;
  }
</style>
