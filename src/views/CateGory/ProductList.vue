<template>
  <div>
    <t-search @search-list="clickSearch"></t-search>
    <div class="list-header">
      <ul class="nav">
        <li :class="{active:current=='buyCount'}" @click="getList('buyCount')">销量</li>
        <li :class="{active:current=='price',active1:click==1,active2:click==2}" @click="getList('price')">
          价格
          <div class="btn-icon">
            <span class="top">上</span>
            <span class="bot">下</span>
          </div>
        </li>
        <li :class="{active:current=='blank'}" @click="getList('blank')">品牌</li>
      </ul>
    </div>
    <div class="list-content" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <ul>
          <li v-for="item in productList">
            <router-link :to="{path:'product/detail/'+item.id+''}">
              <div class="left-icon">
                <img :src="item.imgUrl">
              </div>
              <div class="right-content">
                <div class="productname">{{item.name}}</div>
                <span class="productprice">￥{{item.price}}</span>
                <span class="productnum">销量：{{item.buyCount}}</span>
              </div>
            </router-link>
          </li>
        </ul>
        <!--无数据显示-->
        <t-empty :is-show="productList.length == 0" :empty-text="emptyText"></t-empty>
      </mt-loadmore>
      <div class="nomore" v-if="allLoaded">
        <p>没有更多了...</p>
        <img src="../../assets/images/nomore.png" alt="">
        <div class="backTop" @click="backTop()"></div>
      </div>

    </div>
    <mt-popup v-model="popupVisible" position="right" class="popup-box" :modal="true">
      <div class="header-box">品牌
        <span @click="checkBrand()">确认</span>
      </div>
      <div class="content-box">
        <mt-checklist align="right" class="page-part" title="" v-model="value" :options="checklist">
        </mt-checklist>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import tSearch from "@/components/category/search";
import api from "@/api";
import tEmpty from "@/components/common/empty"; //暂无数据
export default {
  components: { tSearch, tEmpty },
  data() {
    return {
      emptyText: "暂无相关商品",
      checklist: [],
      value: [],
      popupVisible: false,
      current: "buyCount", //默认销量页
      productList: [], //所有商品

      // requrl:api.goods.productlist,
      // searchField:value,

      postData: {
        requrl: api.goods.goodlistbycatid,
        catId: "",
        brandIds: "",
        sortName: "buyCount", //buyCount,
        sortOrder: "desc",
        searchField: "",
        pageIndex: "0", //分页属性
        pageSize: "5" //显示条数
      },
      blrandParams: {
        requrl: api.brand.list,
        catId: 0
      },
      blrandList: [],
      click: 1,
      val: "",

      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉.
      scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动

      nomore:false,//没有更多
    };
  },
  mounted() {
    var vm = this;
    let catId = vm.$route.query.catid;
    vm.postData.catId = catId;
    vm.blrandParams.catId = catId;
    //获取搜索框数据
    let value = vm.$route.query.value || "";
    vm.postData.searchField = value;
    vm.getSearchList();
  },
  methods: {
    clickSearch(val) {
      var vm = this;
      vm.postData.catId = null;
      vm.postData.searchField = val;
      vm.getSearchList();
    },
    //按条件搜索
    getSearchList() {
      var vm = this;
      vm.$axios.post(api.post, vm.postData).then(res => {
        var thisList = res.data.list;
        console.log(thisList);
        vm.productList = thisList;
        // vm.$nextTick(function() {
        //   vm.scrollMode = "touch";
        // });
      });
    },
    //当前选项
    getList(cur) {
      var vm = this;
      vm.current = cur;
      if (cur == "blank") {
        vm.popupVisible = true;
        vm.getBrandList();
      }
      if (cur == "price") {
        if (vm.click == 1) {
          vm.click = 2;
          vm.postData.sortOrder = "asc";
        } else {
          vm.click = 1;
          vm.postData.sortOrder = "desc";
        }
      }
      vm.getSearchList();
    },
    //获取品牌信息
    getBrandList() {
      var vm = this;
      vm.$axios
        .get(api.get, { params: vm.blrandParams })
        .then(res => {
          let blrandList = res.data;
          vm.checklist = [];
          blrandList.forEach(item => {
            vm.checklist.push({ label: item.name, value: item.id });
          });
        })
        .catch(err => {});
    },
    //品牌选择
    checkBrand() {
      var vm = this;
      vm.postData.catId = null;
      vm.postData.brandIds = vm.value.join(",");
      vm.getSearchList();
      vm.popupVisible = false;
    },
    //下拉刷新
    loadTop() {
      console.log("下拉刷新");
      this.getSearchList();
      this.$refs.loadmore.onTopLoaded(); // 固定方法，查询完要调用一次，用于重新定位
    },
    //上拉加载更多
    loadBottom() {
      console.log("加载更多");
      this.more();
      this.$refs.loadmore.onBottomLoaded(); // 固定方法，查询完要调用一次，用于重新定位
    },
    //分页查询
    more() {
      var that = this;
      that.postData.pageIndex = parseInt(this.postData.pageIndex) + 1;
      that.$axios.post(api.post, that.postData).then(res => {
        if (res.code == "999") {
          var AllData = res.data;
          console.log(AllData);
          that.productList = that.productList.concat(AllData.list);
          this.isHaveMore(res.data.count > that.productList.length);
          var aaa = res.data.count > that.productList.length;
          console.log('布尔值：' + aaa);
          console.log('返回的数据长度:' + res.data.count,'当前列表的数据长度:' + that.productList.length);
          console.log(AllData.pageIndex);
          console.log(that.postData.pageIndex);
          if(AllData.pageIndex ==that.postData.pageIndex){

          }
        }
      });
    },
    //是否还有下一页，如果没有就禁止下拉
    isHaveMore(isHaveMore) {
      if(isHaveMore){
        console.log(111);
        this.allLoaded=false;// false表示可以上拉加载
      }else{
        console.log(222);
        this.allLoaded=true;// true表示禁止上拉加载
        this.nomore = true;
      }

      // this.allLoaded = true;

      // console.log(111);
      // if (isHaveMore) {
      //   this.allLoaded = false;
      //   console.log(222);
      // }
    },
    backTop(){
      window.scrollTo(0,0);
    }
  }
};
</script>
<style  lang="scss">
@import "../../assets/css/minx";
/*@import "../assets/css/global";*/
.mint-checkbox-input:checked + .mint-checkbox-core {
  background-color: $WtsColor;
  border-color: $WtsColor;
}
span.mint-checkbox-core {
  border-color: $WtsColor;
}
.mint-checkbox-label {
  font-size: 14px;
}
.popup-box {
  width: 335px;
  height: 100%;
  background: #f5f5f5;
  .header-box {
    height: 47px;
    line-height: 47px;
    text-align: center;
    font-size: 18px;
    color: #333333;
    background: #ffffff;
    position: relative;
    span {
      font-size: 14px;
      color: #42bd56;
      position: absolute;
      right: 16px;
    }
  }
  .item-header {
    height: 10px;
    line-height: 10px;
    background: #f5f5f5;
    padding-left: 16px;
    span {
      font-size: 12px;
      color: #333333;
    }
  }
  .item-content {
    height: 48px;
    line-height: 48px;
    background: #ffffff;
    padding-left: 16px;
    span {
      font-size: 14px;
      color: $WtsColor;
    }
  }
}
.list-header {
  width: 100%;
  background: #fff;
  overflow: hidden;
  ul {
    display: flex;
    li {
      flex: 1;
      height: 36px;
      text-align: center;
      line-height: 36px;
      color: #666666;
      position: relative;
    }
  }
}
.list-content {
  background: #fff;
  li {
    height: 100px;
    border-top: 1px solid #e8e8e8;
    padding: 8px 16px;
    a {
      display: flex;
    }
    .left-icon {
      img {
        width: 100px;
        height: 100px;
        -webkit-background-size: cover;
        background-size: cover;
      }
    }
    .right-content {
      width: 227px;
      margin: 8px 0 0 8px;
      position: relative;
      .productname {
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .productprice {
        position: absolute;
        left: 0;
        bottom: 8px;
        font-size: 16px;
        color: #ff5000;
      }
      .productnum {
        position: absolute;
        right: 0;
        bottom: 8px;
        font-size: 12px;
        color: #999999;
      }
    }
  }
  .nomore{
    height: 76px;
    text-align: center;
    background: #F5F5F5;
    font-size: 14px;
    color: #CCCCCC;
    padding-top: 24px;
    position: relative;
    img{
      width: 37px;
      height: 37px;
      margin-top: 8px;
      -webkit-background-size: cover;
      background-size: cover;
    }
  }
  .backTop{
    width: 40px;
    height: 40px;
    background: #000;
    border-radius: 100%;
    position: absolute;
    right: 16px;
    top: 0;
  }
}
.nav {
  .active {
    color: $WtsColor;
    font-weight: bold;
  }
  .btn-icon {
    position: absolute;
    top: 13px;
    right: 30%;
    span {
      text-indent: 9999pt;
      width: 0;
      height: 0;
      display: block;
    }
    .top {
      margin-bottom: 2px;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 4px solid #999;
    }
    .bot {
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 4px solid #999;
    }
  }
  .active1 .top {
    border-bottom-color: $WtsColor;
  }
  .active2 .bot {
    border-top-color: $WtsColor;
  }
}
.isempty {
  background: #f5f5f5;
}
.mint-cell {
  margin-bottom: 10px;
}
</style>
