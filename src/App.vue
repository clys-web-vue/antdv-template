<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view/>
    </a-config-provider>
  </div>
</template>

<script>
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import moment from 'moment';

  moment.locale('zh-cn');

  export default {
    data() {
      return {
        locale: zhCN,
        moment,
      };
    }
  };
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
