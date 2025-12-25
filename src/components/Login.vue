<template>
  <div class="login-color">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0" class="login-f">
      <div class="login-title">
        <h3 class="title">cmdb登录</h3>
      </div>
      <el-form-item prop="username">
        <el-input type="text" prefix-icon="iconfont iconuseryonghu" v-model="ruleForm.username" autocomplete="off" placeholder="用户"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" prefix-icon="iconfont iconunlock" v-model="ruleForm.password" autocomplete="off" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item class="login-item">
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loginStatus">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api'

export default {
  name: 'Login',
  data () {
    let validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
      callback()
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 5) {
          callback(new Error('密码长度不合法要大于6位'))
        } else {
          callback()
        }
      }
    };
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      loginStatus: false
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.loginStatus = true;
        login(this.ruleForm).then(res => {
          if (res.data.status === 666){
            this.$message.success(res.data.msg);
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', this.ruleForm.username);
            this.$router.replace('/').catch((err) => err);
            this.loginStatus = false
          } else {
            this.$message.error(res.data.msg);
            this.loginStatus = false
          }
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-color {
  height: 100%;
  background-color: #2d3a4b;
}
.login-f {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}
.login-title {
  font-size: 26px;
  color: #fff;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: 700;
}
::v-deep .el-input__inner  {
  padding: 0 35px;
  height: 48px;
  line-height: 48px;
  z-index: 100;
  background: rgba(0,0,0,.1);
  border: 1px solid rgba(0,0,0,.1);
}
</style>
