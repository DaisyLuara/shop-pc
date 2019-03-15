<template>
  <div class="account-root">
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
  padding: 0px 50px;
  height: 100%;
  margin-left: -110px;
  background-color: #eff2f7;
}
</style>
