<template>
  <section>
    <mt-header title="设置">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>

    <!-- <mt-cell title="账号管理" is-link to="/help">
    </mt-cell>

    <mt-cell title="意见反馈" is-link to="/help">
    </mt-cell>

    <mt-cell title="关于梧桐树" is-link to="/help">
    </mt-cell> -->
    <div class="btn-box">
      <button @click="layout" class="login-out">退出登录</button>
    </div>
  </section>
</template>

<script>
import com from "@/api/common";
export default {
  data() {
    return {};
  },
  methods: {
    layout() {
      this.$store
        .dispatch("LOGIN_OUT")
        .then(() => {
          this.$router.push({
            path: "/home"
          });
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/global";

.mint-cell {
  margin-top: 10px;
}
.btn-box {
  padding: 16px;
  .login-out {
    display: block;
    width: 100%;
    height: 48px;
    font-size: 16px;
    color: $WtsColor;
    border: 1px solid $WtsColor;
    border-radius: 4px;
    background-color: #fff;
  }
}
</style>
