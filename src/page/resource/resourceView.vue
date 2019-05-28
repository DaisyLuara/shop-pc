<template>
  <div class="resource-root">
    <second-sidebar module="resource"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "ResourceView"
};
</script>

<style lang="less" scoped>
.resource-root {
  height: 100%;
  padding: 76px 50px 0;
  background-color: #eff2f7;
}
</style>
