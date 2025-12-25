<template>
  <div class="select">
    <el-row :gutter="10">
      <el-col :span="6">项目名</el-col>
      <el-col :span="13">
        <el-input
          placeholder="请输入项目名"
          v-model="projectName"
          clearable
          prop="projectName"
        >
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">数据库端口</el-col>
      <el-col :span="13">
        <el-input
          placeholder="请输入数据库端口"
          v-model="dbPort"
          clearable>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from "../../../store/index"

export default {
  name: 'Intranet',
  data () {
    return {
      projectName: "",
      dbIp: "",
      dbPort: "",
      dbPassword: "",
    }
  },
  watch: {
    projectName (data) {
      sessionStorage.setItem('projectName', data)
    },
    dbPort (data) {
      sessionStorage.setItem('dbPort', data)
    },
  }
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
