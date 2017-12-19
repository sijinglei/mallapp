<template>
  <div class="header">
    <div class="news">
      <router-link to="/messagecenter">
        <i class=" icon icon-xiaoxi"></i>
      </router-link>
    </div>
    <div class="ipt">
      <i class="icon icon-search"></i><input type="text" @focus="search" value="搜索商品" /></div>
    <div class="shoppingCart">
      <router-link to="/cars">
        <i class="icon icon-cart"></i>
        <span class="cnt" v-show="carsLength>0">{{carsLength}}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "t-head",
  props: ["carsLength"],
  data() {
    return {};
  },
  methods: {
    search: function() {
      console.log("12");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/minx";
.header {
  display: flex;
  height: 44px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  justify-content: space-between;
  background-color: #319eff;
  font-size: 14px;
  .icon {
    color: #ffffff;
  }
  .news {
    width: 15%;
    text-align: center;
    position: relative;
    .icon {
      position: absolute;
      left: 50%;
      top: 10px;
      margin-left: -11px;
    }
  }
  .ipt {
    width: 70%;
    height: 30px;
    position: relative;
    .icon {
      position: absolute;
      left: 10px;
      top: 11px;
    }
    input {
      height: 100%;
      margin-top: 7px;
      color: #ffffff;
      border: 0;
      background-color: #52abff;
      text-indent: 38px;
      width: 100%;
      border-radius: 4px;
      &:focus {
        outline: none;
      }
    }
  }
  .cnt {
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background-color: red;
    border-radius: 50%;
    color: #fff;
    font-size: 8px;
    text-align: center;
    top: 4px;
    right: 4px;
  }
  .shoppingCart {
    width: 15%;
    position: relative;
    .icon {
      position: absolute;
      left: 50%;
      top: 10px;
      margin-left: -11px;
    }
  }
}
</style>
