<template>
  <div class="put-root">
    <second-sidebar module="put"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "PutView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.put-root {
  height: 100%;
  padding: 76px 50px 0;
  background-color: #eff2f7;
}
</style>
