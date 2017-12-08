<template>
  <section class="h-swipe">
    <mt-swipe :auto="auto?auto:2000">
      <mt-swipe-item v-for="item in imgs">
        <router-link :to="item.linkValue"><img :src="item.imageUrl" :alt="item.title" /></router-link>
      </mt-swipe-item>
    </mt-swipe>
  </section>
</template>

<script>
    export default {
        props:['imgs','auto'],
        data () {
            return {}
        },
        methods: {},
        mounted: function () {

        },
        components: {}
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/minx";
  .h-swipe{height:200px ;
    img{width: 100%;height: 100%}
  }
</style>
