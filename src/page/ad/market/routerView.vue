<template>
  <div 
    class="market-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'MarketView',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.market-root {
  height: 100%;
  margin: 10px;
  background-color: #eff2f7;
}
</style>
