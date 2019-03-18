<template>
  <div 
    class="report-root">
    <second-sidebar 
      module="report"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'ReportView',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.report-root {
  height: 100%;
  padding: 0px 50px;
  background-color: #eff2f7;
}
</style>
