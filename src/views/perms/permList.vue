<template>
  <div>
    <el-card class="box-card">
      <div class="row-el">
        <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryPages.search" clearable suffix-icon="el-icon-date" @click.native="getPermList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      </div>
      <div class="table-el">
        <el-table :data="permList" border strip :header-cell-style="{background: '#FAFAFA'}" v-loading="loading">
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="name" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === 1">一级</el-tag>
              <el-tag v-if="scope.row.level === 2" type="success">二级</el-tag>
              <el-tag v-if="scope.row.level === 3" type="warning">三级</el-tag>
            </template>
          </el-table-column>
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
          :total="total_perms">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { permsList } from '@/api'

export default {
  name: 'Permslist',
  data () {
    return {
      permList: [],
      loading: true,
      total_perms:10,
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: ''
      },
    }
  },
  methods: {
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.getPermList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.getPermList()
    },
    async getPermList () {
      await permsList(
      {
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
      }
    ).then(res => {
      this.permList = res.data.data;
      this.total_perms = res.data.total_perms;
      this.loading = false;
    }).catch((err) => {
      console.log(err)
      })
    }
  },
  mounted () {
    this.getPermList()
  }
}
</script>

<style lang="scss">
.row-el {
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
</style>
