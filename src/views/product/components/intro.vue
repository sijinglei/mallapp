<template>
    <div class="intro" >
      <div v-html="productDateProp.intro"></div>
    </div>
</template>

<script>

    export default {
        name:'detailIntro',//商品详情组件
        props:['productDateProp'],
        components: {},
        data () {
            return {}
        },
        methods: {},
        mounted() {

        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
.intro{
  margin-top: 48px;/*no*/
  overflow-y: auto;
}

</style>
