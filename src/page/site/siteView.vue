<template>
  <div class="site-root">
    <second-sidebar module="site"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "SiteView"
};
</script>

<style lang="less" scoped>
.site-root {
  padding: 0px 50px;
  height: 100%;
  background-color: #eff2f7;
}
</style>
