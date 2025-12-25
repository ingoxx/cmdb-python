<template>
  <div>
      <el-form :model="form" status-icon :rules="rules" ref="form">
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input clearable type="password" v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item prop="check_password" label="再次输入密码" :label-width="formLabelWidth">
          <el-input clearable type="password" v-model="form.check_password" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="button-el">
        <el-button type="primary"  @click="editUser('form')" :loading="loginLoading">确 定</el-button>
      </div>
  </div>
</template>

<script>
import { userDetailChange } from '@/api'
import { elConfirm } from '@/modules'
import {mapState} from "vuex";

export default {
  name: 'Detail',
  data () {
    var validatePass = (rule, value, callback) => {
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (value !== this.form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
    };
    return {
      loginLoading: false,
      formLabelWidth: '120px',
      form: {
        username: '',
        password: '',
        check_password: '',
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        check_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
    }
  },
  computed: {
    ...mapState({
      'userDetails': state => state.detail.userDetails
    })
  },
  mounted() {

  },
  methods: {
    async editUser (formName) {
      await this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.form.username = sessionStorage.getItem('user');
        elConfirm(`确定修改${sessionStorage.getItem('user')}吗？`).then(() => {
          this.loginLoading = true;
          userDetailChange(this.form).then(res => {
            if (res.data.status === 666) {
              this.$message.success(`${res.data.msg}`)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
            this.loginLoading = false;
          }).catch(() => {
          })
        }).catch(() => {
          this.loginLoading = false;
          this.$message.info('已取消')
        });
      })
    },
  }
}

</script>
