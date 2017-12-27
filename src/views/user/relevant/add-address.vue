<template>
  <section>
    <mt-header :title="title">
      <a @click="goBack" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <a slot="right" @click="delAddr()" class="font-del" v-show="isadd==2">
        <mt-button icon="">删除</mt-button>
      </a>
    </mt-header>
    <div class="form-box">
      <mt-field label="收货人" placeholder="请输入收货人" v-model="postData.name"></mt-field>
      <mt-field label="手机号码" placeholder="请输入手机号" type="tel" v-model="postData.mobile" :attr="{ maxlength: 11}"></mt-field>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text">所在区域</span>
          </div>
          <div class="mint-cell-value">
            <span class="mint-field-core" v-model="addressInfo" v-text="addressInfo" @click="popupVisible=true"></span>
          </div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </a>
      <mt-field label="详细地址" placeholder="详细地址" type="textarea" rows="4" v-model="postData.addr" :attr="{ maxlength: 50 }"></mt-field>
      <div class="mint-cell-wrapper" style="margin:17px 0;">
        <div class="mint-cell-title">
          <label class="mint-checklist-label">
            <span class="mint-checkbox">
              <input type="checkbox" class="mint-checkbox-input" v-model="isDefault" @click="setDefaltAddr()">
              <span class="mint-checkbox-core"></span>
            </span>
            <span class="mint-checkbox-label">设为默认地址</span>
          </label>
        </div>
      </div>
      <div class="btns">
        <button class="mint-button mint-button--primary mint-button--large" @click="save">
          <label class="mint-button-text">保存</label>
        </button>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-tk">
      <check-area v-on:bindClose="popupVisible=false" v-on:bindSure="sureCheck"></check-area>
    </mt-popup>

    <mt-popup v-model="sheetVisible" popup-transition="popup-bottom" position="bottom">
      <div class="sheetVisible">
        <p class="text item">确定要删除所选商品吗？</p>
        <div class="btn item" @click="deleteOk">确定</div>
        <div class="cancel item" @click="sheetVisible=false">取消</div>
      </div>
    </mt-popup>
  </section>
</template>

<script>
import api from "@/api";
import checkArea from "@/components/area/checkArea"; //选择城市组件
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      popupVisible: false,
      sheetVisible: false, //是否
      title: "新建地址",
      isadd: 1, //1添加 2编辑
      value: 1,
      addressInfo: "省份、城市、区县", //所在区域
      options: [
        {
          label: "设为默认地址",
          value: 1
        }
      ],
      isDefault: false,
      postData: {
        requrl: api.member.addaddress,
        id: 0,
        name: "", //收货人姓名
        provinceId: "", //省份Id
        cityId: "", //市Id
        regionId: "", //县区Id
        province: "", //省份名称
        city: "", //市名称
        region: "", //县区名称
        addr: "", //详细地址
        mobile: "", //手机号码
        tel: "", //电话号码
        zip: "", //邮政编码
        shipaddressname: "", //别名
        defAddr: 0 //是否设置为默认收货地址
      },
      errMsg: ""
    };
  },
  created() {
    var vm = this;
    vm.postData.id = vm.$route.query.id || 0;
    vm.isadd = vm.$route.query.isadd || 1;
    vm.title = vm.isadd == 1 ? "新建地址" : "编辑收货地址";
  },
  mounted() {
    var vm = this;
    if (vm.postData.id != 0) {
      vm.getInfo();
    }
  },
  methods: {
    setDefaltAddr() {
      var vm = this;
      vm.isDefault = !vm.isDefault;
    },
    sureCheck(strArea) {
      let addressIds = strArea.split("|")[0].split("-");
      let addressNames = strArea.split("|")[1].split("-");
      this.addressInfo = strArea.split("|")[1];
      this.postData.provinceId = addressIds[0];
      this.postData.cityId = addressIds[1];
      this.postData.regionId = addressIds[2];

      this.postData.province = addressNames[0];
      this.postData.city = addressNames[1];
      this.postData.region = addressNames[2];
      this.popupVisible = false;
    },
    getInfo() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.member.addressdetail,
            memberAddressId: vm.postData.id
          }
        })
        .then(res => {
          let data = res.data;
          if (res.code == "999") {
            for (var k in vm.postData) {
              if (k !== "requrl") {
                vm.postData[k] = data[k];
              }
            }
            vm.isDefault = data.defAddr == 1 ? true : false;
            vm.addressInfo =
              vm.postData.province +
              "-" +
              vm.postData.city +
              "-" +
              vm.postData.region;
          }
        });
    },
    save() {
      var vm = this;
      if (vm.isOk()) {
        vm.$axios.post(api.post, vm.postData).then(res => {
          if (res.code == "999") {
            Toast({
              message: vm.isadd == 1 ? "新增成功" : "更新成功",
              position: "bottom"
            });
            vm.goBack();
          }
        });
      } else {
        Toast({
          message: vm.errMsg,
          position: "bottom"
        });
      }
    },
    isOk() {
      let vm = this,
        d = vm.postData,
        errCom = "不能为空";
      var regTel = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (d.name == "") {
        vm.errMsg = `收货人${errCom}`;
        return false;
      }
      if (d.mobile == "") {
        vm.errMsg = `电话号码${errCom}`;
        return false;
      }
      if (d.province == "") {
        vm.errMsg = `所在区域${errCom}`;
        return false;
      }
      if (d.addr == "") {
        vm.errMsg = `详细地址${errCom}`;
        return false;
      }
      if (d.mobile != "" && !regTel.test(d.mobile)) {
        vm.errMsg = "手机号码格式不正确";
        return false;
      }
      return true;
    },
    delAddr() {
      this.sheetVisible = true;
    },
    deleteOk() {
      var vm = this;
      vm.$axios
        .post(api.post, {
          requrl: api.member.addressdelete,
          id: vm.postData.id
        })
        .then(res => {
          vm.sheetVisible = true;
          if ((res.code = "999")) {
            Toast({
              message: "操作成功",
              position: "bottom"
            });
            this.goBack();
          }
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  watch: {
    isDefault(val, oldval) {
      this.postData.defAddr = val ? 1 : 0;
    }
  },
  components: { checkArea }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/global";
.form-box {
  margin-top: 10px;
  input {
    font-size: 16px;
  }
}
.mint-field {
  border-bottom: 1px solid #d9d9d9;
  .mint-cell-wrapper {
    font-size: 16px;
  }
}
.sheetVisible {
  background-color: #f5f5f5;
  .item {
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background-color: #ffffff;
    &.btn {
      color: #fe3824;
      font-size: 16px;
    }
    &.cancel {
      margin-top: 9px;
      color: #333333;
      font-size: 16px;
    }
    &.text {
      border-bottom: 1px solid #f3f3f3; /*no*/
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>
