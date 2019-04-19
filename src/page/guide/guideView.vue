<template>
  <div class="guide-root">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "GuideView",
  data() {
    return {};
  },
  mounted() {
    console.log(this.$router)
  },
  methods: {}
};
</script>

<style lang="less" scoped>
// .guide-root {
//   height: 100%;
//   padding: 76px 50px 0;
//   background-color: #eff2f7;
// }
</style>
