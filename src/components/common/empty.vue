<template>
  <div class="isempty" v-show="isShow">
     <div class="flex-box">
      <img :src="resultImgUrl" alt="" v-show="resultImgUrl!=''">
      <p class="text">{{emptyText}}</p>
      <p class="text2" v-show="emptyText2!=''">{{emptyText2}}</p>
      <router-link :to="{path:linkUrl}" v-show="linkUrl!=''">{{linkText}}</router-link>
       </div>
  </div>

</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    emptyText2: {
      type: String,
      default: ""
    },
    imgType: {
      type: Number,
      default: 1
    },
    imgUrl: {
      type: String,
      default: require("@/assets/images/empty3.png")
    },
    linkText: {
      type: String,
      default: "立即前往"
    },
    linkUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      //if 组件内不能修改props的值，同时修改的值也不会同步到组件外层，即调用组件方不知道组件内部当前的状态是什么 so:要新增一个字段用于接收更改
      resultImgUrl: require("@/assets/images/empty" + this.imgType + ".png")
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/minx";
.isempty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  font-size: 18px;
  color: #666;
  text-align: center;
  .flex-box {
    flex: 1;
    height: 200px;
    img {
      width: 147px;
      height: 147px;
    }
    .text {
      margin-top: 16px;
    }
    .text2 {
      font-size: 14px;
      color: #999;
      margin-top: 4px;
    }
    a {
      display: inline-block;
      margin-top: 32px;
      width: 171px;
      height: 48px;
      line-height: 48px;
      background: #42bd56;
      border-radius: 4px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
</style>
