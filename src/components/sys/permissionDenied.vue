<template>
  <a-result status="403" title="403" sub-title="抱歉，您无权访问此页面。">
    <template #extra>
      <a-button type="primary" @click="backPage">
        返回上一页
      </a-button>
    </template>
  </a-result>
</template>

<script>
  export default {
    name: "dp",
    methods: {
      backPage() {
        this.$router.go(-2);
      }
    },
  }
</script>

<style scoped>

</style>