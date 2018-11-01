<template>
  <div 
    class="data-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'DataView'
}
</script>

<style lang="less" scoped>
.data-root {
  height: 100%;
  margin: 10px;
  background-color: #eff2f7;
}
</style>
