<template>
  <div class="prize-root">
    <second-sidebar module="prize"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "PrizeView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.prize-root {
  height: 100%;
  padding: 76px 50px 0;
  background-color: #eff2f7;
}
</style>
