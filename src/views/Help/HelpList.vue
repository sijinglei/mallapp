<template>
    <div>
      <mt-header title="帮助中心">
        <div slot="left">
          <mt-button  icon="back" @click="goBack()"></mt-button>
        </div>
      </mt-header>

      <div class="content">
        <span class="min-title">{{typeName}}</span>
        <template  v-for="item in list">
          <mt-cell :title="item.name" isLink="" :to="{path:'/helpdetail',query:{id:item.id,typeName:typeName}}"></mt-cell>
        </template>
      </div>
    </div>
</template>
<script>
import api from "@/api";
    export default {
        data() {
            return {
              typeName:'',
              params:{
                requrl:api.my.helpcenter,
                pageIndex:1,
                pageSize:10,
                typeId:0
               },
              list:[],
            }
        },
       created(){
          var vm=this;
           vm.params.typeId=vm.$route.query.id;
         console.log(vm.params.typeId);
       },
        methods: {
          goBack () {
            this.$router.go(-1);
          },
          getList(){
            var that = this;
            that.$axios.get(api.get,{params:that.params}).then(data =>{
              if(data.code == '999'){
                var thisList = data.data.list;
                that.list=thisList;
                that.typeName = that.list[0].typeName;
              }
            })
          }
        },
        mounted () {
             this.getList();
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
</style>
