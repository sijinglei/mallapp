<template>
  <div class="m-login">
    <div class="m-login-head">
      <h1>{{title}}</h1>
      <p>发现更大的世界</p>
    </div>
    <div class="m-login-body">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="userInfo.username"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="userInfo.userpwd"></mt-field>
      <div class="m-help">
        <router-link to="/forget">忘记密码？</router-link>
        <router-link to="/register">注册</router-link>
      </div>
      <mt-button type="primary" size="large" @click.native="login">登录</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import api from "@/api";
export default {
  data() {
    return {
      title: "登陆",
      userInfo: {
        username: "13528800028", //"15180000002",
        userpwd: "w111111" //aaaaaa
      }
    };
  },
  methods: {
    login() {
      var vm = this;
      vm.$store.dispatch("LOGIN_IN", vm);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/login-register";
</style>
