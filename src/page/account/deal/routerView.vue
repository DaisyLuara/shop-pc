<template>
  <div 
    class="deal-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'DealView',
}
</script>

<style lang="less" scoped>
  .deal-root {
    height: 100%;
    background-color: #EFF2F7;
  }
</style>
