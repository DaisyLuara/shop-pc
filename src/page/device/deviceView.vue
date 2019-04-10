<template>
  <div class="device-root">
    <second-sidebar module="device"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "DeviceView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.device-root {
  height: 100%;
  padding: 76px 50px 0;
  background-color: #eff2f7;
}
</style>
