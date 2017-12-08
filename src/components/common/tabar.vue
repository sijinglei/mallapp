<template>
  <mt-tabbar v-model="selectedVal" fixed @input="goId" ref="coco">
    <mt-tab-item id="Home">
      <i class="icon icon-home" ></i>
      首页
    </mt-tab-item>
    <mt-tab-item id="Category">
      <i class="icon icon-cate" ></i>
      分类
    </mt-tab-item>
    <mt-tab-item id="UserIndex">
      <i class="icon icon-mine"  ></i>
         我的
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
    props:['selected'],
  data() {
    return {
    };
  },
  methods: {
    goId(id){
      this.$router.push({ name: id });
    }
  },
  deactivated(){

  },
  created(){

  },
  computed: {
    selectedVal:{
        get(){
            return this.selected
        },
        set(){
          return this.selected
        }
    }
  },
  watch: {

  }
};
</script>

<style lang="scss" >
  @import "./../../assets/css/minx";
  .is-selected{
    .icon{
      color: #26a2ff;
    }
  }
  .icon{
    display: block;
    font-size: 22px;
  }
</style>
