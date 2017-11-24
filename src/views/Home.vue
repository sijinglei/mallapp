<template>
  <div class="m-home">
    <h1>{{msg}}</h1>
    <t-header></t-header>
      <mt-button type="primary" size="large" @click.native="orderAdd">下订单</mt-button>
      
      <mt-button type="primary" size="large" @click.native="sendMobileCode">发送手机验证码</mt-button>
  </div>
</template>
<script>
import tHeader from "@/components/common/m-header";
import api from "@/api";
export default {
  data() {
    return {
      msg: "首页"
    };
  },
  components: {
    tHeader
  },
  mounted() {
    // this.goodsCat();
  },
  methods: {
    goodsCat() {
      var that = this;
      that.$axios
        .get(api.goods.catlist)
        .then(data => {
          console.log("获取列表成功！！！！");
          console.log(data.data);
          if (data.data.code != "999") {
            that.msg = data.data.message;
          } else {
          }
        })
        .catch(error => {
          console.log("请求异常");
          console.log(error);
        });
    },
    orderAdd() {
      var that = this;
      that.$axios
        .post(api.order.add, {})
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log("请求异常");
          console.log(error);
        });
    },
    sendMobileCode() {
      var that = this;
      that.$axios
        .get(api.account.getmobilecode, {
          params: {
            mobile: "17665256879"
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log("请求异常");
          console.log(error);
        });
    }
  }
};
</script>

<style scoped lang="scss">

</style>