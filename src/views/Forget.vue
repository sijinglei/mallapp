<template>
  <div class="m-login m-register">
    <mt-header title="忘记密码">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <p class="step2" v-show="isStep2">已发送至手机：{{mobile.substr(0, 3) + '****' +mobile.substr(7)}}</p>

    <div class="m-login-body">
      <mt-field placeholder="手机号码" type="number" v-model="mobile" :attr="{ maxlength: 11 }" v-show="!isStep2">
      </mt-field>

      <mt-field placeholder="验证码" type="number" v-model="smsCode" v-show="isStep2">
      </mt-field>
      <mt-button type="primary" size="large" @click.native="getCode" :disabled="mobile.length < 11" v-show="!isStep2">获取短信验证码</mt-button>
      <mt-button style="margin-top:17px;" type="primary" size="large" @click.native="sendCode" :disabled="smsCode == ''" v-show="isStep2">下一步</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import api from "@/api";
export default {
  data() {
    return {
      isStep2: false,
      isDefault: false,
      mobile: "",
      smsCode: ""
    };
  },
  methods: {
    getCode() {
      var vm = this;
      var regTel = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (vm.mobile === "") {
        Toast("手机号码不能为空");
        return;
      }
      if (!regTel.test(vm.mobile)) {
        Toast("手机号码格式不正确");
        return;
      }
      vm.isStep2 = true;
      return;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.account.getmobilecode,
            mobile: vm.mobile
          }
        })
        .then(res => {
          console.log(res);
          if (res.code == "999") {
            vm.isStep2 = true;
          } else {
            Toast(res.message || "获取验证码失败");
          }
        });
    },
    sendCode() {
      Toast("找回密码成功，已发送到您的手机上");
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/login-register";
</style>
