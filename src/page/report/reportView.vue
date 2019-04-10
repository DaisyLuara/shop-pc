<template>
  <div class="report-root">
    <!-- <second-sidebar module="report"/> -->
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "ReportView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.report-root {
  margin-left: -100px;
  height: 100%;
  padding: 76px 50px 0;
  background-color: #1f1848;
}
</style>
