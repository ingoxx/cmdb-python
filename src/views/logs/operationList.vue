<template>
  <div>
    <el-card>
      <div class="row-el">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getLogsList">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="5" class="wd-1">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getLogsList"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-col>
      </el-row>
      </div>
      <div class="table-el">
        <el-table :data="logsList" border strip :header-cell-style="{background: '#FAFAFA'}" v-loading="loading">
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="user" label="操作用户"></el-table-column>
          <el-table-column prop="action" label="动作"></el-table-column>
          <el-table-column prop="path" label="请求地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operate_ip" label="操作IP"></el-table-column>
          <el-table-column prop="operate_date" label="操作时间"></el-table-column>
        </el-table>
      </div>
      <div class="page-el">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryPages.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="queryPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_logs">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { logsList } from '@/api'

export default {
  name: 'operationList',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      logsList: [],
      value: '',
      loading: true,
      total_logs:10,
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: '',
        start: '',
        end: '',
      },
    };
  },
  mounted() {
    this.getLogsList()
  },
  methods: {
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.getLogsList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.getLogsList()
    },
    async getLogsList () {
      if (this.value !== null) {
        this.queryPages.start = this.value[0];
        this.queryPages.end = this.value[1];
      } else {
        this.queryPages.start = '';
        this.queryPages.end = '';
      }
      await logsList(
        {
          search: this.queryPages.search,
          size: this.queryPages.pageSize,
          page: this.queryPages.currentPage,
          start: this.queryPages.start,
          end: this.queryPages.end,
        }
      ).then(res => {
        if ( res.data.status === 666 ) {
          this.logsList = res.data.data;
          this.total_logs = res.data.total_logs;
          this.loading = false;
        } else {
          this.$message.error('请求失败1.')
        }
      }).catch(error => {
        this.$message.error('请求失败2.')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row-el {
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
::v-deep .el-col-7 {
  width: auto;
}
.wd-1 {
  position: relative;
  left: -5px;
}
::v-deep .el-col-5 {
  width: 380px!important;
}
</style>
