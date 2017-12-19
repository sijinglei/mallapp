
<template>
  <div class="popup-body">
    <div class="popub-head clearfix">
      <span class="cancel" @click="close()">取消</span>
      <span class="sure" @click="sure()">确定</span>
    </div>
    <div class="popub-content">
      <mt-picker :slots="dateSlots" @change="onDateChange" :visible-item-count="5" :show-toolbar="false"></mt-picker>
    </div>
  </div>
</template>

<script>
import api from "@/api";
//选择省市区（县)子组件
// import areaList from "./areajson";
export default {
  data() {
    return {
      dateSlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      provCode: [],
      cityCode: [],
      areaCode: [],
      provName: [],
      cityName: [],
      areaName: [],
      provSelectName: "",
      provSelectCode: "",
      citySelectName: "",
      citySelectCode: "",
      areaSelectName: "",
      areaSelectCode: "",
      areaList: [] //城市数据
    };
  },
  created() {
    var vm = this;
    vm.getArea();
  },
  mounted() {
    var vm = this;
    // vm.getProvAddress();
    // vm.resetArea();
    // console.log(areaList);
  },
  methods: {
    getArea() {
      var vm = this;
      vm.$axios
        .get(api.get, {
          params: {
            requrl: api.area.tree
          }
        })
        .then(res => {
          console.log("获取省");
          console.log(res);
          if (res.code == "999") {
            vm.areaList = res.data;
            vm.getProvAddress(res.data);
            vm.resetArea();
          }
        });
    },
    close() {
      this.$emit("bindClose");
    },
    sure() {
      var vm = this;
      var prov = vm.provCode[vm.provName.indexOf(vm.provSelectName)],
        city = vm.cityCode[vm.cityName.indexOf(vm.citySelectName)],
        area = vm.areaCode[vm.areaName.indexOf(vm.areaSelectName)];
      var strPca =
        prov +
        "-" +
        city +
        "-" +
        area +
        "|" +
        vm.provSelectName +
        "-" +
        vm.citySelectName +
        "-" +
        vm.areaSelectName;
      this.$emit("bindSure", strPca);
    },
    /**重置**/
    resetArea() {
      var vm = this;
      vm.dateSlots[0].values = vm.provName;
      vm.dateSlots[1].values = vm.cityName;
      vm.dateSlots[2].values = vm.areaName;
    },
    onDateChange(picker, values) {
      var vm = this;
      // console.log(values);
      vm.provSelectName = values[0] || "";
      vm.citySelectName = values[1] || "";
      vm.areaSelectName = values[2] || "";
      if (vm.areaList.length > 0) {
        vm.getProvAddress(vm.areaList);
        vm.resetArea();
      }
    },

    getProvAddress(allData) {
      var vm = this;
      vm.provCode = [];
      vm.provName = [];
      if (allData.length > 0) {
        for (var d in allData) {
          let item = allData[d];
          vm.provCode.push(item.id);
          vm.provName.push(item.name);
          if (vm.provSelectName === item.name) {
            vm.getCityAddress(item.children);
          } else {
            if (d == 0) {
              vm.getCityAddress(item.children);
            }
          }
        }
      }
      // areaList.forEach(function(item, i) {
      //   vm.provCode.push(item.value);
      //   vm.provName.push(item.name);
      //   if (vm.provSelectName === item.name) {
      //     vm.getCityAddress(item.sub);
      //   } else {
      //     if (i === 0) {
      //       vm.getCityAddress(item.sub);
      //     }
      //   }
      // });
    },
    getCityAddress(citylist) {
      var vm = this;
      vm.cityCode = [];
      vm.cityName = [];
      citylist.forEach((item, i) => {
        vm.cityCode.push(item.id);
        vm.cityName.push(item.name);
        if (vm.citySelectName === item.name) {
          vm.getAreaAddress(item.children);
        } else {
          if (i === 0) {
            vm.getAreaAddress(item.children);
          }
        }
      });
    },
    getAreaAddress(areaedlist) {
      var vm = this;
      vm.areaCode = [];
      vm.areaName = [];
      areaedlist.forEach(function(item, i) {
        if (i != 0) {
          vm.areaCode.push(item.id);
          vm.areaName.push(item.name);
        }
      });
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/global";
/***选择城市列表***/
.popup-body {
  background: #fcfcfc;
  width: 100%;
  .popub-head {
    border-bottom: 1px solid #f2f2f2;
    padding: 10px 16px;
    span {
      width: 50%;
      display: block;
      float: left;
      color: $WtsColor;
      font-size: 14px;
      &.sure {
        text-align: right;
      }
    }
  }
  .popub-content {
    background-color: #fbfbfb;
    position: relative;
  }
  .picker-slot {
    font-size: 14px;
  }
}

.picker-slot-wrapper,
.picker-item {
  backface-visibility: hidden;
  font-size: 16px;
}
</style>
