<template>
  <section>
    <mt-header title="收货地址">
      <router-link to="/userIndex" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="data-list">
      <ul>
        <li v-for="(item,index) in datalist">
          <div class="address-box" @click="Choose(index)">
            <div class="check-box" v-show="adressType==1">
              <span class="mint-checkbox">
                <input type="checkbox" class="mint-checkbox-input" value="" :checked="addressId==item.id">
                <span class="mint-checkbox-core"></span>
              </span>
            </div>
            <div class="content-box">
              <div class="name">
                {{item.name}}{{item.mobile.substr(0, 3) + '****' +item.mobile.substr(7)}}
                <span class="default" v-show="item.defAddr==1">默认</span>
              </div>
              <div class="adress">
                {{item.province}}{{item.city}}{{item.region}}{{item.town}}{{item.addr}}
              </div>
            </div>
          </div>
          <div class="edit" @click="editAdress(item.id)">
            <i class="icon icon-edit"></i>
          </div>
        </li>
      </ul>
    </div>
    <div @click="editAdress('')" class="bot-btn">添加新地址</div>
  </section>
</template>

<script>
import api from "@/api";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      option: {
        requrl: api.member.addresslist
      },
      datalist: [],
      addressId: "",
      adressType: 0 //addressType:0 是个人中心收货地址 addressType:1是付款修改付款地址
    };
  },

  created() {
    this.hidetab();
    this.getAdress();
  },
  mounted() {
    var vm = this;
    vm.adressType = vm.$route.query.addressType || 0; //0没有单选按钮 1有
  },
  methods: {
    getAdress() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: vm.option
        })
        .then(res => {
          if (res.code == "999") {
            vm.datalist = res.data;
          }
        })
        .catch(err => {});
    },
    Choose(index) {
      var vm = this;
      vm.$store.commit('SETADDRESS',vm.datalist[index]);
      this.$router.go(-1);
    },
    editAdress(val) {
      var vm = this;
      var query = {
        isadd: val == "" ? 1 : 2,
        id: val
      };
      vm.$router.push({
        path: "/addaddress",
        query: query
      });
    },
    ...mapMutations({
      hidetab: "TABAR_HIDE",
      showtab: "TABAR_SHOW"
    })
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/global";
@import "../../assets/fonts/iconfont.css";
.mint-checkbox-core {
  width: 20px;
  height: 20px;
}
.data-list {
  margin-top: 9px;

  ul {
    li {
      width: 100%;
      background-color: #fff;
      height: 73px;
      padding: 0 16px;
      position: relative;
      .address-box {
        display: flex;
        height: 73px;
        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          height: 1px;
          width: 100%;
          background-color: #f3f3f3;
        }
      }
      .check-box {
        padding-top: 20px;
        width: 36px;
        height: 33px;
        line-height: 33px;
      }
      .content-box {
        flex: 1;
        padding-top: 16px;
        position: relative;
        padding-right: 30px;
        .name {
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          .default {
            display: inline-block;
            width: 40px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border: 1px solid #ff9a00;
            border-radius: 2px;
            font-size: 12px;
            color: #ff9a00;
          }
        }
        .adress {
          font-size: 12px;
          color: #999;
          line-height: 17px;
          margin-top: 4px;
        }
      }
      .edit {
        position: absolute;
        width: 30px;
        height: 33px;
        line-height: 33px;
        right: 35px;
        top: 20px;
        z-index: 2000;
      }
    }
  }
}
.bot-btn {
  display: inline-block;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background-color: $WtsColor;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 48px;
}
</style>
