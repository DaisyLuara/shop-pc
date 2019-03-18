<template>
  <div class="smart-root">
    <second-sidebar module="smart"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "SmartView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.smart-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>
