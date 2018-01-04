<template>
  <div>
    <mt-header fixed title="购物车">
      <a @click='back' slot="left">
        <mt-button icon="back"></mt-button>
      </a>
      <div class="WtsColor head-right" slot="right" v-show="data.length>0">
        <span @click="edit" v-html='!isEdit?"编辑":"完成"'></span>
      </div>
    </mt-header>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <t-more slot="top"></t-more>
      <div class="box">
        <div v-for="(item,index) in data" class="shops">
          <div class="shops-checkbox" v-if="!isEdit">
            <span class="mint-checkbox" @click="changeCheck(index)">
              <input type="checkbox" class="mint-checkbox-input" value="optionA" :checked="item.isCheck==0?false:true">
              <span class="mint-checkbox-core"></span>
            </span>
          </div>
          <div class="shops-checkbox" v-else>
            <span class="mint-checkbox" @click="changeDel(index)">
              <input type="checkbox" class="mint-checkbox-input" value="optionA" :checked="delids[index].isCheck">
              <span class="mint-checkbox-core"></span>
            </span>
          </div>
          <!--<router-link :to=""></router-link>-->
          <div class="shop-img-box">
            <img class="shop-img" :src="item.imageUrl" :alt="item.name" />
            <p class="isMarket" v-if="item.isMarket!=1">已下架</p>
            <p class="isMarket" v-if="item.store==0">无货</p>
            <p class="prompt" v-else v-show="item.promptNum<=10">仅剩{{item.promptNum}}件</p>
          </div>
          <div class="shop-detail">
            <p class="chose" v-show="isEdit" @click="choseNorm(item.productId,index)">重选规格</p>
            <p class="name">{{item.name}}</p>
            <p class="specs">{{item.specs}}</p>
            <div class="bt">
              <span class="price">¥{{item.price}}</span>
              <chose :index="index" :data="data" @postCar="postCar"></chose>
            </div>
          </div>
        </div>
      </div>
    </mt-loadmore>
    <div v-if="data.length>0">
      <div class="del-all" v-if="isEdit">
        <div class="checkAll" @click="checkAllMeth">
          <span class="mint-checkbox">
            <input type="checkbox" class="mint-checkbox-input" value="" :checked="checkAll">
            <span class="mint-checkbox-core"></span>
          </span>
          <span class="tit">全选</span>
        </div>
        <div class="del-btn" @click="sheetVisible=true">删除所选</div>
      </div>
      <div class="settlement" v-else>
        <div class="checkAll" @click="checkAllMeth">
          <span class="mint-checkbox">
            <input type="checkbox" class="mint-checkbox-input" value="" :checked="checkAll">
            <span class="mint-checkbox-core"></span>
          </span>
          <span class="tit">全选</span>
        </div>
        <div class="price">
          总价：
          <span class="t">¥
            <span class="ice">{{price}}</span>
          </span>
        </div>
        <div class="set-btn" @click="payMoney">结算
          <span v-show="nub>0">{{nub}}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <t-empty :is-show="empty.isShow" :empty-text="empty.text" :link-url="empty.linkUrl" :link-text="empty.linkText" :img-type="empty.type"></t-empty>
    </div>

    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
      <router-view @hidepopup="hidepopup"></router-view>
    </mt-popup>
    <mt-popup v-model="sheetVisible" popup-transition="popup-bottom" position="bottom">
      <div class="sheetVisible">
        <p class="text item">确定要删除所选商品吗？</p>
        <div class="btn item" @click="delidsMa">确定</div>
        <div class="cancel item" @click="sheetVisible=false">取消</div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapMutations } from "vuex";
import api from "@/api";
import axios from "axios";
import qs from "qs";
import chose from "@/components/cars/choose-amount";
import tEmpty from "@/components/common/empty"; //暂无数据
export default {
  data() {
    return {
      value: ["123"],
      options: [],
      price: 0, //总价
      nub: 0, //个数
      checkAll: false,
      ischeck: false,
      isEdit: false, //是否在编辑
      data: [], //购物车数据
      chose: {}, //重选规格数据
      popupVisible: false,
      itemId: "",
      delids: [], //删除id
      sheetVisible: false,
      actions: [{ name: "确定要删除所选商品吗？" }, { name: "确定" }],
      empty: {
        isShow: true,
        text: "去挑几件好货吧~",
        type: 2,
        linkUrl: "/home",
        linkText: "去逛逛"
      }
    };
  },
  methods: {
    init() {
      this.tabarselect();
    },
    loadTop() {
      this.Refresh();
    },
    back() {
      this.$router.go(-1);
    },
    checkAllMeth() {
      //全选
      var vm = this;
      vm.checkAll = !this.checkAll;
      var isc = 0;
      if (vm.checkAll) {
        isc = 1;
      } else {
        isc = 0;
      }
      if (!this.isEdit) {
        vm.data.forEach(function(item) {
          item.isCheck = isc;
        });
        vm.postCar();
      } else {
        let iscs = isc == 0 ? false : true;
        vm.delids.forEach((item, index) => {
          vm.$set(vm.delids[index], "isCheck", iscs);
        });
      }
    },
    priceAll(data) {
      //计算总价
      let price = 0;
      data.forEach(item => {
        item.isCheck == 1 ? (price += item.price * item.num) : "";
      });
      return price.toFixed(2);
    },
    postCar() {
      var vm = this;
      this.$axios
        .post(api.post, {
          requrl: api.cart.edit,
          data: vm.ShopCarDate(vm.data)
        })
        .then(res => {
          if (res.code == "999") {
            vm.price = vm.priceAll(vm.data);
          } else {
            console.log(res.data.code);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    ShopCarDate(data) {
      let arr = [];
      data.forEach(item => {
        arr.push({
          productId: item.productId,
          toNum: item.num,
          isCheck: item.isCheck ? 1 : 0
        });
      });
      console.log(arr);
      return arr;
    },
    getPostDate() {
      //提交下单的数据
      let arr = [];
      this.data.forEach(item => {
        let postDate = {};
        if (item.isCheck == 1) {
          postDate.productId = item.productId;
          postDate.num = item.num;
          postDate.leaseMonth = item.leaseMonth;
          let carr = [];
          item.services.forEach(citem => {
            carr.push(citem.id);
          });
          postDate.serviceIds = carr;
          arr.push(postDate);
        }
      });
      return arr;
    },
    payMoney() {
      let vm = this;
      this.$axios
        .post(api.post, { requrl: api.order.preadd, data: this.getPostDate() })
        .then(res => {
          if (res.code == "999") {
            //将下单数据存入vuex
            vm.$store.commit("PRODUCTDATE", res.data);
            window.localStorage.setItem(
              "PRODUCTDATE",
              JSON.stringify(res.data)
            );
            vm.$router.push({ name: "productfill" });
          }
        });
    },
    ...mapMutations({
      tabarselect: "TABAR_SELECT",
      hidetab: "TABAR_HIDE",
      showtab: "TABAR_SHOW"
    }),
    //emit
    hidepopup(data, index) {
      this.popupVisible = false;
      this.data = data;
      this.data[index].isCheck = true;
      this.Refresh();
    },
    changeCheck(index) {
      [this.data[index].isCheck] = [!this.data[index].isCheck];
      if (!this.isEdit) {
        this.postCar();
      }
    },
    changeDel(index) {
      [this.delids[index].isCheck] = [!this.delids[index].isCheck];
    },
    //编辑
    edit() {
      let vm = this;
      [this.isEdit] = [!this.isEdit];
      vm.delids = [];
      vm.data.forEach(item => {
        vm.delids.push({ isCheck: false, id: item.productId });
      });
    },
    //刷新
    Refresh() {
      this.$router.go(0);
    },

    //popup
    choseNorm(id, index) {
      var vm = this;
      vm.itemId = id;
      this.$axios
        .get(api.get, {
          params: {
            requrl: api.goods.productinfobyid,
            id: vm.itemId
          }
        })
        .then(res => {
          vm.popupVisible = true;
          //vuex 引用问题
          localStorage.setItem(
            "CAR_EDIT",
            JSON.stringify({
              id: id,
              detail: res.data,
              postdata: vm.ShopCarDate(vm.data), //提交数据
              cardata: vm.data,
              index: index
            })
          );
          this.$store.commit("CAR_EDIT", {
            id: id,
            data: res.data,
            postdata: vm.ShopCarDate(vm.data), //提交数据
            cardata: vm.data,
            index: index
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    delidsMa() {
      let vm = this;
      let delis = [];
      vm.delids.forEach(item => {
        if (item.isCheck) {
          delis.push(item.id);
        }
      });
      this.$axios
        .post(api.post, {
          requrl: api.cart.delete,
          data: delis
        })
        .then(res => {
          console.log(res);
          if (res.code == "999") {
            this.Refresh();
          }
        })
        .catch(err => {
          vm.sheetVisible = false;
        });
    }
  },
  created: function() {
    this.hidetab();
  },
  mounted: function() {
    this.init();
    var vm = this;
    this.$axios
      .get(api.get, {
        params: {
          requrl: api.cart.my
        }
      })
      .then(res => {
        vm.data = res.data;
        vm.price = vm.priceAll(res.data);
      })
      .catch(err => {});
    /* axios.get('https://easy-mock.com/mock/5a1bada19144e669fc6e37a8/mall/carlist#!method=get')
            .then((res) => {
              vm.data=res.data.data;
              vm.price=vm.priceAll(res.data);
            }).catch((err) => {
          })*/
  },
  destroyed: function() {
    this.showtab();
  },
  components: {
    chose,
    tEmpty
  },
  watch: {
    data() {},
    $route(to) {},
    popupVisible(a) {
      a
        ? this.$router.replace({ name: "carschose" })
        : this.$router.replace({ name: "cars" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/global";
.t-center {
  text-align: center;
  height: 70px;
  margin-top: -70px;
  .text {
    color: #cccccc;
    margin-bottom: 8px;
    padding-top: 8px;
  }
  .logo {
    width: 37px;
  }
}
//$WtsColor
.WtsColor {
  color: $WtsColor;
}
.mint-header {
  background-color: #ffffff;
  font-size: 18px;
  color: #333333;
}
.mint-popup-bottom {
  width: 100%;
}
.gray {
  color: #cccccc !important;
}
.head-right {
  font-size: 14px;
}
.back {
  font-size: 12px;
}
.box {
  padding-top: 40px;
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
.shops {
  background-color: #ffffff;
  margin-top: 9px;
  display: flex;
  padding: 8px 0;
  .shops-checkbox {
    padding-top: 24px;
    padding-left: 16px;
    width: 36px;
  }
  .shop-img {
    width: 72px;
    height: 72px;
  }
  .shop-detail {
    width: 227px;
    padding-left: 8px;
    position: relative;
    .name {
      width: 132px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 20px;
      font-size: 14px;
      color: #333333;
      margin-bottom: 4px;
    }
    .specs {
      color: #999999;
      width: 132px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .bt {
      display: flex;
      justify-content: space-between;
      .price {
        font-size: 16px;
        color: #ff5000;
      }
    }
    .chose {
      color: #666666;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 20px;
    }
  }
}
.del-all {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  height: 48px;
  display: flex;
  justify-content: space-between;
  .checkAll {
    padding-left: 12px;
    padding-top: 14px;
    .tit {
      margin-left: 8px;
    }
  }
  .del-btn {
    width: 113px;
    background-color: #ff5000;
    color: #ffffff;
    line-height: 48px;
    text-align: center;
  }
}
.settlement {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  height: 48px;
  display: flex;
  justify-content: space-between;
  .checkAll {
    padding-left: 12px;
    padding-top: 14px;
    .tit {
      margin-left: 8px;
    }
  }
  .price {
    color: #666666;
    font-size: 14px;
    padding-left: 70px;
    line-height: 48px;
    .t {
      font-size: 14px;
      .ice {
        font-size: 18px;

        color: #ff5000;
      }
      color: #ff5000;
    }
  }
  .set-btn {
    width: 113px;
    background-color: #ff5000;
    color: #ffffff;
    font-size: 16px;
    line-height: 48px;
    text-align: center;
  }
}
.shop-img-box {
  position: relative;
  width: 72px;
  height: 72px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  .isMarket {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    line-height: 72px;
  }
  .prompt {
    background-color: rgba(0, 0, 0, 0.6);

    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 23px;
    line-height: 23px;
  }
}
</style>
