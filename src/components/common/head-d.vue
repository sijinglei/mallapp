<template>
    <div class="">
      <div class="head">
        <div slot="left">
          <div @click="back()" class="left">
            <i class="icon icon-large"></i>
          </div>
        </div>
        <div v-text="Title"></div>
      </div>
    </div>
</template>

<script>

    export default {
        props:['Title'],
        components: {},
        data () {
            return {}
        },
        methods: {
          back(){
            this.$router.go(-1);
          }
        },
        mounted() {

        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
  .head{
    height: 48px;/*no*/
    text-align: center;
    position: relative;
    line-height: 48px;/*no*/
    background-color: #ffffff;
    border-bottom: 1px solid #ddd;/*no*/
    font-size: 18px;
    .left{
      position: absolute;
      top: 0;
      height: 100%;
      left: 10px;
    }
  }

</style>
