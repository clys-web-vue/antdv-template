<template>
  <div class="container">
    <a-spin size="large" :spinning="loging">
      <a-card class="login" :hoverable="true"
              :tab-list="tabList"
              :active-tab-key="tabKey"
              @tabChange="key => tabChange(key)"
      >
        <a-form-model
          ref="userForm"
          :model="form"
          :rules="tabKey==='login'?loginRules:regRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="账号" prop="account" has-feedback>
            <a-input
              v-model="form.account"
            />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password" has-feedback>
            <a-input
              type="password"
              v-model="form.password"
            />
          </a-form-model-item>

          <a-form-model-item v-if="tabKey==='reg'" label="确认密码" prop="password2" has-feedback>
            <a-input
              type="password"
              v-model="form.password2"
            />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 24 }" style="text-align: center">
            <a-button v-if="tabKey==='login'"
                      icon="user"
                      type="primary"
                      block
                      @click="onLogin">
              登陆
            </a-button>
            <a-button v-else
                      icon="user-add"
                      type="primary"
                      block
                      @click="onReg">
              注册
            </a-button>
          </a-form-model-item>
        </a-form-model>

      </a-card>
    </a-spin>
  </div>
</template>

<script>
  import config from '@/config';
  import UserUtils from '@/utils/UserUtils';
  import GuguService from '@/api/GuguService'
  import Urls from 'nightnya-common-utils/Urls'


  export default {
    components: {},
    name: "login",
    data() {
      const validateAccount = (rule, value, callback) => {
        if ((/^\d/).test(value)) {
          callback(new Error('不能数字开头'));
          return;
        }
        setTimeout(() => {
          if (Math.random() > 0.5) {
            callback(new Error('已经被注册了'));
            return;
          }
          callback();
        }, 500)
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('不能少于6个字符'));
          return;
        }
        if (this.form.password2 !== '') {
          this.$refs.userForm.validateField('password2');
        }
        callback();
      };
      const validatePass2 = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error("两次输入的密码不一致"));
          return;
        }
        callback();
      };

      return {
        tabList: [
          {
            key: 'login',
            tab: '登陆',
          },
          {
            key: 'reg',
            tab: '注册',
          }
        ],
        tabKey: 'login',

        loging: false,
        labelCol: {span: 6},
        wrapperCol: {span: 16},
        form: {
          account: '',
          password: '',
          password2: '',
        },
        loginRules: {
          account: [
            {required: true, message: '不能为空', trigger: 'change'},
          ],
          password: [
            {required: true, message: '不能为空', trigger: 'change'},
          ],
        },
        regRules: {
          account: [
            {required: true, message: '不能为空', trigger: 'change'},
            {validator: validateAccount, trigger: 'blur'},
          ],
          password: [
            {required: true, message: '不能为空', trigger: 'change'},
            {validator: validatePass, trigger: 'change'},
          ],
          password2: [
            {required: true, message: '不能为空', trigger: 'change'},
            {validator: validatePass2, trigger: 'change'},
          ],
        },
      };
    },
    methods: {
      tabChange(key) {
        this.tabKey = key;
        this.resetForm();
      },
      onLogin() {
        this.$refs.userForm.validate(valid => {
          if (!valid) {
            console.log('error submit!!');
            return false;
          }
          this.login();
        });
      },
      onReg() {
        this.$refs.userForm.validate(valid => {
          if (!valid) {
            console.log('error submit!!');
            return false;
          }
          this.reg();
        });
      },
      async login() {
        this.loging = true;
        try {
          await UserUtils.login({account: this.form.account, password: this.form.password});
        }catch (e) {
          this.loging = false;
          console.error(e)
        }
        this.loging = false;
        location.reload();
      },
      async reg() {
        this.loging = true;
        try {
          await GuguService.UserApi.reg({account: this.form.account, password: this.form.password});
        }catch (e) {
          this.loging = false;
          console.error(e)
        }
        this.loging = false;
        this.$message.success('注册成功');
        this.resetForm();
        this.tabKey = 'login'
      },
      resetForm() {
        this.$refs.userForm.resetFields();
      },
    },
    mounted() {

    },
  }
</script>

<style scoped lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    padding: 0;
  }

  .container {
    height: 100%;
    background: pink;
    display: flex;
    justify-content: center;
    align-items: center;

    .login {
      width: 350px;


    }
  }

</style>

<style>
  .container .login .ant-spin-container {
    width: 100%;
    height: 100%;
  }
</style>

