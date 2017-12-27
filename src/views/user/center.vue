<template>
  <div class="mine-wrap">
    <mt-header title="" fixed style=" background: transparent;">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="person">
      <router-link to="/login" v-show="userinfo.nickname==''">
        <div class="photo">
          <img :src="userinfo.portraitSuffix==''?headImg:userinfo.portraitSuffix" alt="">
        </div>
        <p class="name">登录账号</p>
      </router-link>
      <router-link to="/center" v-show="userinfo.nickname!=''">
        <div class="photo">
          <img :src="userinfo.portraitSuffix==''?headImg:userinfo.portraitSuffix" alt="">
        </div>
        <p class="name">{{userinfo.nickname}}</p>
      </router-link>
    </div>
    <mt-cell title="头像">
      <img class="photo" :src="userinfo.portraitSuffix==''?headImg:userinfo.portraitSuffix" alt="" @click="setAvatar">
      <!-- <input type="file" style="display: none;" id="img-upload" multiple accept="image/*" @change="uploadImg($event)" /> -->
    </mt-cell>
    <input class="file" style="display:none" name="file" type="file" accept="image/*" @change="uploadImg($event)" ref="avatarInput" />
    <mt-cell title="昵称" :value="userinfo.nickname"></mt-cell>
    <mt-cell title="一句话简介" to="//github.com" is-link value="我是一个小小小小鸟">
    </mt-cell>
    <mt-cell title="性别" to="//github.com" is-link value="保密">
    </mt-cell>
  </div>
</template>

<script>
import api from "@/api";
import com from "@/api/common";
import axios from "axios";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      headImg: require("../../assets/images/head.png"),
      selected: "UserIndex",
      userinfo: {
        nickname: "",
        portraitSuffix: ""
      }
    };
  },
  created() {
    this.userinfo = com.getSession("loginUserBaseInfo")
      ? JSON.parse(com.getSession("loginUserBaseInfo"))
      : this.userinfo;
  },
  mounted: function() {
    var vm = this;
  },
  methods: {
    setAvatar() {
      this.$refs.avatarInput.click();
    },
    uploadImg(e) {
      var vm = this;
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("file", file, file.name); //通过append向form对象添加数据
      param.append("chunk", "0"); //添加form表单中其他数据
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      var vm = this;
      axios.post(api.upload, param, config).then(res => {
        console.log(res);
        if (res.data.code == 999) {
          var newImgUrl = res.data.data;
          var oldUserinfo = this.userinfo;
          vm.$set(vm.userinfo, "portraitSuffix", newImgUrl);
          localStorage.setItem(
            "loginUserBaseInfo",
            JSON.stringify(vm.userinfo)
          );
        } else {
          Toast(res.data.message || "上传出错");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/minx";
@import "../../assets/fonts/iconfont.css";
.person {
  height: 180px;
  background-image: linear-gradient(-180deg, #3a9fff 0%, #1c83ff 98%);
  background: url("../../assets/images/person-bg.png") no-repeat;
  background-size: cover;
  text-align: center;
  color: #fff;
  padding-top: 30px;
  .name {
    margin-top: 10px;
  }
  .photo {
    height: 100px;
    width: 100px;
    margin: 0 auto;
    border-radius: 50%;
    margin-bottom: 5px;
    background-image: linear-gradient(
      -180deg,
      rgba(71, 153, 108, 0) 2%,
      #5dbb87 100%
    );
  }
  img {
    z-index: 2;
    height: 88px;
    width: 88px;
    margin-top: 6px;
    border-radius: 50%;
  }
  a {
    display: block;
    color: inherit;
    font-size: 16px;
  }
}
.mine-wrap {
  padding-bottom: 48px;
}
.icon {
  color: #333;
  font-size: 24px; /*no*/
}
.mint-cell {
  margin-bottom: 10px;
  .photo {
    border-radius: 50%;
    height: 60px;
    width: 60px;
  }
}

.cell-group {
  margin-top: -10px;
  border-top: 1px solid #d9d9d9;
  /*no*/
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    display: inline-block;
    flex: 1;
    height: 50px;
    text-align: center;
    .icon-wrap {
      display: block;
      width: 30px; /*no*/
      height: 20px; /*no*/
      margin: 5px auto;
      position: relative;
      .cnt {
        position: absolute;
        width: 18px; /*no*/
        height: 18px; /*no*/
        line-height: 18px; /*no*/
        background-color: red;
        border-radius: 50%;
        color: #fff;
        font-size: 10px; /*no*/
        text-align: center;
        top: -2px; /*no*/
        right: -2px; /*no*/
      }
    }
    .link-txt {
      font-size: 14px; /*no*/
      color: #333;
    }
  }
}
</style>
