<template>
  <div>
    <el-card v-loading="pullLogLoading">
      <el-divider><strong><i class="el-icon-s-promotion"></i>日志查询</strong></el-divider>
      <div class="card-div">
        <el-row  :gutter="1" class="row-1">
          <el-col :span="3">
            <template>
              <el-select v-model="value" clearable :loading="itemLoading" placeholder="请选择项目">
                <el-option
                  v-for="data in dataList"
                  :key="data"
                  :label="data"
                  :value="data">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="getWeblog">获取日志</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>

import { webLogsList, checkWebLog } from '@/api'

export default {
  name: 'webLogs',
  data() {
    return {
      value:"",
      dataList: [],
      pullLogLoading: false,
      itemLoading: false,
    };
  },
  mounted() {
    this.webLog()
  },
  methods: {
    async webLog () {
      this.itemLoading = true;
      await webLogsList({project: 'all'}).then(res => {
        if (res.data.status===666) {
          this.dataList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
        this.itemLoading = false;
      }).catch(error => {
        this.itemLoading = false;
      })
    },
    async getWeblog() {
      if (!this.value) {
        return this.$message.error('请先选择项目')
      }
      this.pullLogLoading = true;
      await checkWebLog({project: this.value}).then(res => {
        if (res.data.status===666) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
        this.pullLogLoading = false;
        window.open(res.data.data)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.card-div {
  min-width: 1600px;
}
//.row-1 {
//  margin-bottom: 10px;
//}
//.row-2 {
//  float: left;
//  margin-bottom: 10px;
//}
</style>
