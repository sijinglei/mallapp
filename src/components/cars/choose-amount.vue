<template>
  <div class="detail-amount">
            <span class="addSub">
                   <span class="sub" :class="{gray:data[index].num==1}" @click="nubSub(index)">-</span>
                  <input type="number" @change="nubChange(index,data[index].num,data[index].promptNum)" v-model="data[index].num"/>
                   <span class="add" :class="{gray:data[index].num==data[index].promptNum}" @click="nubAdd(index,data[index].promptNum)">+</span>
               </span>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";
  export default {
    name:'carAmount',//购物车数量加减
      props:['index','data'],
    data () {
      return {}
    },
    methods: {
      nubSub(index){
        if(this.data[index].num<=1){
          this.data[index].num=1
        }else {
          this.data[index].num--;
          this.$emit('postCar')
        }
      },
      nubAdd(index,promptNum){
        if(this.data[index].num>=9999 || this.data[index].num>=promptNum){
          this.data[index].num=promptNum;
          Toast({
            // 错误提醒
            message: '库存不足',
            position: "bottom",
            className:'zIndex4'
          });
        } else {
          this.data[index].num++;
          this.$emit('postCar')
        }
      },
      nubChange(index,nub,promptNum){
        if(this.data[index].num>=9999 || this.data[index].num>=promptNum){
          this.data[index].num=promptNum;
          Toast({
            // 错误提醒
            message: '库存不足',
            position: "bottom",
            className:'zIndex4'
          });
        } else if(nub<=1){
          this.data[index].num=1;
        }else {
          this.data[index].num=nub;
        }
        this.$emit('postCar')
      },
    },
    mounted() {

    },
    components: {}
  }
</script>

<style lang="scss">
  @import "../../assets/css/global";
  .detail-amount{
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
    .gray{color: #cccccc!important;}
  }

</style>
