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
        <router-link to="/about">忘记密码？</router-link>
        <router-link to="/about">注册</router-link>
      </div>
      <mt-button type="primary" size="large" @click.native="login">登录</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import api from "@/api";
import com from "@/api/common";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "登陆",
      userInfo: {
        username: "15180000002",
        userpwd: "aaaaaa"
      }
    };
  },
  created() {},
  methods: {
    login() {
      var that = this;
      console.log("======请求开始=======");
      that.$axios
        .get(api.account.login, {
          params: that.userInfo
        })
        .then(function(data) {
          console.log("请求成功！！！！");
          console.log(data);
          if (data.code == "999") {
            //保存用户登录信息
            com.setSession("loginUserBaseInfo", JSON.stringify(data.data));
            Toast({
              message: "登录成功"
            });
            that.$router.push({
              path: "/home"
            });
          } else {
          }
        })
        .catch(function(error) {
          console.log("请求异常");
          console.log(error);
        });
    }
  },
  destroyed: function() {}
};
</script>

<style scoped lang="scss">
@import "../assets/css/login-register";
</style>
