<template>
    <div class="" >
        <h4 class="head">商品说明</h4>
        <div class="bassic-box" v-html="productDateProp.basicContext"></div>
    </div>
</template>

<script>
    export default {
        name:'detailBasic',//商品说明
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
.head{height: 54px;line-height: 54px;
text-align: center;font-size: 16px;}
  .bassic-box{
    height: 344px;
    overflow-y: auto;
  }

</style>
