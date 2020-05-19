<template>
  <a-layout class="home-container">
    <a-layout-sider
      class="sider"
      breakpoint="sm"
      collapsedWidth="0"
    >
      <UserSimple class="user-simple"/>
      <Menu theme="dark" mode="inline" activityRouteName="user"></Menu>
    </a-layout-sider>
    <a-layout ref="routerView">
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
  import UserSimple from '@/components/layouts/UserSimple'

  export default {
    name: 'UserLayout',
    components: {Menu, UserSimple},
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
  .home-container {
    height: 100%;
    overflow: hidden;

    .sider {
      overflow-y: auto;
      overflow-x: hidden;

      .user-simple {
        padding: 5px 10px;
        border: solid #000c17;
        border-width: 3px 0;
      }

      .sider-logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
      }

    }

    * {
      &::-webkit-scrollbar {
        width: 7px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        border: solid rgba(99, 99, 99, 0.3);
        border-width: 3px 1px;
        /*box-shadow: inset 0 0 2px rgba(255, 192, 203, 0.5);*/
        background: rgba(155, 155, 155, 0.6);
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
      }
    }
  }
</style>
