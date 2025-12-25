<template>
  <div class="select">
    <el-row :gutter="10">
      <el-col :span="6">项目名</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入项目名"
          v-model="projectName"
          clearable
        >
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">数据库主ip</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入数据库主ip"
          v-model="dbIp"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">数据库从ip</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入数据库从ip"
          v-model="slaveIp"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">游戏服ip</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入游戏服ip"
          v-model="gameIp"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">前置机ip</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入前置机ip"
          v-model="frontIp"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">数据库端口</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入数据库端口"
          v-model="dbPort"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">数据库密码</el-col>
      <el-col :span="12">
        <el-input
          placeholder="请输入数据库密码"
          v-model="dbPassword"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">启用主从</el-col>
      <el-col :span="12">
        <el-switch
          v-model="rw"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import store from "../../../store/index";

  export default {
    name: 'Extranet',
    data () {
      return {
        projectName: "",
        dbIp: "",
        slaveIp: "",
        dbPort: "",
        dbPassword: "",
        frontIp: "",
        gameIp: "",
        rw: "",
      }
    },
    watch: {
      projectName (data) {
        sessionStorage.setItem('projectName', data)
      },
      dbPort (data) {
        sessionStorage.setItem('dbPort', data)
      },
      dbIp (data) {
        sessionStorage.setItem('dbIp', data)
      },
      slaveIp (data) {
        sessionStorage.setItem('slaveIp', data)
      },
      gameIp (data) {
        sessionStorage.setItem('gameIp', data)
      },
      frontIp (data) {
        sessionStorage.setItem('frontIp', data)
      },
      dbPassword (data) {
        sessionStorage.setItem('dbPassword', data)
      },
      rw (data) {
        let _data = data ? 1 : 2;
        sessionStorage.setItem('rw', _data)
      },
    },
    methods: {
      sendDeployMsg () {
        this.$emit('getDeployParams', this.deployInfo)
      }
    },
  }
</script>

<style lang="scss" scoped>
.select {
  margin-left: 45px;
}
.select > * {
  margin: 14px 0;
  line-height: 46px;
}
.notice {
  color: #e55656;
  font-size: 8px;
}
</style>
