<template>
  <div class="ad-root">
    <second-sidebar module="ad"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "AdView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.ad-root {
  height: 100%;
  padding: 76px 50px 0;
  background-color: #eff2f7;
}
</style>
