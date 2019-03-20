<template>
  <div class="auth-root">
    <second-sidebar module="auth"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "AuthView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.auth-root {
  padding: 76px 50px 0;
  height: 100%;
  background-color: #eff2f7;
}
</style>
