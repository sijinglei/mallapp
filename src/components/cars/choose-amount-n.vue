<template>
  <div  class="detail-amount">
            <span class="addSub">
                   <span class="sub" :class="{gray:num==1}" @click="nubSub()">-</span>
                  <input type="number" @change="nubChange(num,promptNum)" v-model="num"/>
                   <span class="add" :class="{gray:num==promptNum}" @click="nubAdd(promptNum)">+</span>
               </span>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";
  export default {
      name:'chooseAmount',//详情页数量加减
    props:['nub','promptNum'],
    data () {
      return {
        num:this.nub
      }
    },
    methods: {
      nubSub(){
        if(this.num<=1){
          this.num=1
        }else {
          this.num--;
          this.$emit('postCar')
        }
      },
      nubAdd(promptNum){
        if(this.num>=9999 || this.num>=promptNum){
          this.num=promptNum;
          Toast({
            // 错误提醒
            message: '库存不足',
            position: "bottom",
            className:'zIndex4'
          });
        } else {
          this.num++;
          this.$emit('postCar')
        }
      },
      nubChange(nub,promptNum){
        if(this.num>=9999 || this.num>=promptNum){
          this.num=promptNum;
          Toast({
            // 错误提醒
            message: '库存不足',
            position: "bottom",
            className:'zIndex4'
          });
        } else if(nub<=1){
          this.num=1;
        }else {
          this.num=nub;
        }
        this.$emit('postCar')
      },
    },
    mounted() {

    },
    components: {}
  }
</script>

<style lang="scss" >
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
