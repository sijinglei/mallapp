<template>
    <div>
        <div v-for="item in detail">
          <div><input type="checkbox" /></div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['detail'],
        data () {
            return {}
        },
        methods: {},
        mounted: function () {

        },
        components: {}
    }
</script>

<style>

</style>
