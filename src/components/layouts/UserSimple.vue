<template>
  <div class="user-container">
    <div class="sub-container">
      <a-card class="header-card">
        <div class="header-card-head"></div>
        <div class="header-card-container">
          <div class="user-nick">{{info.nick||'---'}}</div>
          <a-divider/>
          <div class="menu-list">
            <div @click="logout">
              <a-icon type="logout"/>
              退出
            </div>
          </div>
        </div>
      </a-card>
      <div class="header">
        <a-avatar class="header-img" size="large" icon="user" :src="info.avatar"></a-avatar>
      </div>
    </div>
  </div>
</template>

<script>
  import UserUtils from "@/utils/UserUtils";

  export default {
    name: "UserSimple",
    data() {
      return {info: {}}
    },
    computed: {},
    methods: {
      async logout() {
        const hide = this.$message.loading('退出登陆中...', 0);
        try {
          await UserUtils.logout();
          location.reload();
        } finally {
          hide();
        }
      },
    },
    async mounted() {
      this.info = await UserUtils.info();
    }
  }
</script>

<style scoped lang="scss">
  .user-container {
    width: 100%;
    color: #fff;

    .sub-container {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 40px;

      .header {
        width: 100%;
        text-align: center;

        .header-img {
          color: #fff !important;
          transition: .3s ease;
        }
      }

      .header-card {
        display: none;
        position: absolute;
        top: 35px;
        left: 0;
        width: 100%;


        /deep/ .ant-card-body {
          padding: 0;
        }

        .header-card-head {
          height: 45px;
        }

        .header-card-container {
          /deep/ .ant-divider {
            margin: 5px 0;
          }

          .user-nick {
            color: #fb7299;
            /*color: #212121;*/
            font-weight: 600;
            text-align: center;
            font-size: 16px;
          }

          .menu-list {
            > * {
              cursor: pointer;
              padding: 8px 23px;
              transition: .3s ease;
              font-size: 14px;
              color: #212121;

              /deep/ .anticon {
                margin-right: 5px;
              }

              &:hover {
                background: #f4f4f4;
              }
            }
          }
        }


      }


      &:hover {

        .header-card {
          display: initial;
          animation: header-card .3s ease forwards;
        }

        .header-img {
          width: 70px;
          height: 70px;
          line-height: 70px;
        }

        .header-card-container {
          animation: header-card-container .3s ease forwards;
        }
      }
    }


  }


  @-webkit-keyframes header-card {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes header-card-container {
    0% {
      opacity: 0;
      margin-top: -100%;
    }
    35% {
      opacity: 0;
      margin-top: -50%;
    }
    70% {
      opacity: 0;
      margin-top: 0;
    }
    100% {
    }
  }

</style>
