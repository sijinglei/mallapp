<template>
  <div class="m-login m-register">
    <mt-header title="注册">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="m-login-body">
      <mt-field placeholder="手机号" type="number" v-model="mobile" :attr="{ maxlength: 11 }">
        <timer-btn ref="timerbtn" class="sms-btn" v-on:run="sendCode"></timer-btn>
      </mt-field>
      <mt-field placeholder="短信验证码" type="number" v-model="code">
      </mt-field>
      <div class="mint-cell-wrapper" style="margin:17px 0;">
        <div class="mint-cell-title">
          <label class="mint-checklist-label">
            <span class="mint-checkbox">
              <input type="checkbox" class="mint-checkbox-input" v-model="isDefault" @click="setDefaltAddr()">
              <span class="mint-checkbox-core"></span>
            </span>
            <span class="mint-checkbox-label">我已阅读并同意《
              <a>Tronker网社区服务协议</a>》</span>
          </label>
        </div>
      </div>
      <mt-button type="primary" size="large" @click.native="register" :disabled="!isDefault">确定</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import api from "@/api";
import timerBtn from "@/components/common/timer-btn";
export default {
  data() {
    return {
      isDefault: false,
      mobile: "",
      code: ""
    };
  },
  created() {},
  methods: {
    setDefaltAddr() {
      this.isDefault = !this.isDefault;
    },
    register() {
      var vm = this;
      vm.$axios
        .get(api.account.register, {
          params: {
            mobile: vm.mobile,
            code: vm.code
          }
        })
        .then(function(data) {
          console.log("注册成功");
          //保存用户登录信息
          vm.$router.push({
            path: "/login"
          });
        });
    },
    sendCode() {
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
      vm.$refs.timerbtn.start(); //启动倒计时
      vm.$axios
        .get(api.account.getmobilecode, {
          params: {
            mobile: vm.mobile
          }
        })
        .then(res => {
          console.log(res);
          if (res.code == "999") {
            vm.$refs.timerbtn.start(); //启动倒计时
          } else {
            Toast("获取验证码失败");
            vm.$refs.timerbtn.stop(); //停止倒计时
          }
        });
    }
  },
  components: {
    timerBtn
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/login-register";
</style>
