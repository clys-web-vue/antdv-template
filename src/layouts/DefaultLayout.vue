<template>
  <a-layout id="homeContainer">
    <a-layout-sider
      breakpoint="sm"
      collapsedWidth="0"
      :style="{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }"
    >
      <div class="logo"/>
      <Menu theme="dark" mode="inline" name="page"></Menu>
    </a-layout-sider>
    <a-layout ref="routerView" :style="{ marginLeft: '200px'}">
      <a-layout-content :style="{ margin: '0 16px', overflow: 'initial' ,paddingBottom:'15px'}">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="v in titles()" :key="v">{{v}}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-card :bodyStyle="{minHeight: '360px' ,padding:'15px',cursor:'initial',}" :hoverable="true">
          <router-view/>
          <a-back-top/>
        </a-card>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  import Menu from '@/components/layouts/Menu'

  export default {
    name: 'DefaultLayout',
    components: {Menu},
    methods: {
      titles() {
        let titles = [...((((this.$route || {}).meta || {})._titles) || [])];
        titles.shift();
        return titles;
      }
    },
  };
</script>

<style lang="scss">
  #homeContainer {
    min-height: 100%;

    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
    }
  }
</style>
