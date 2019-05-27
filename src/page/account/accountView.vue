<template>
  <div class="account-root">
    <second-sidebar module="account"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "AccountView",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.account-root {
  padding: 76px 50px 0;
  height: 100%;
  // margin-left: -100px;
  background-color: #eff2f7;
}
</style>
