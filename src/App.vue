<template>
  <div id="app" class="app">
    <keep-alive include="Home,UserIndex,Category">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<!--
:title="title" :menu-display="menuDisplay" :back-display="backDisplay" :map-display="mapDisplay"
-->
<script>
import { mapState } from "vuex";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {},
  computed: {}
};
</script>

<style scoped lang="scss">
@import "./assets/css/minx";

#app {
  padding-bottom: 48px;
  font-size: 14px;
}
</style>
