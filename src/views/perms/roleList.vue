<template>
  <div>
    <el-card class="box-card">
      <!---搜索--->
      <div class="row-el">
        <el-row :gutter="5">
          <el-col :span="4">
            <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getRolesList">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2" class="wd-1">
            <el-button type="primary" @click="AddFormVisible = true">
            <i class="el-icon-circle-plus-outline"></i> 添加角色
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--角色列表-->
      <div class="table-el">
        <el-table :data="rolesList" border strip :header-cell-style="{background: '#FAFAFA'}"
                  v-loading="loading"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['level-bottom', index === 0 ? 'level-top' : '', 'center']" v-for="(item, index) in scope.row.auth_list" :key="item.id">
                <!---一级菜单--->
                <el-col :span="5">
                  <el-tag closable @close="removePerms(item.id, scope.row)" >{{ item.name }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!---二级,三级菜单--->
                <el-col :span="19">
                  <el-row :class="[index === 0 ? '' : 'level-top']" v-for="(item2, index) in item.children" :key="item2.id">
                    <!---二级菜单--->
                    <el-col :span="5">
                      <el-tag closable type="success" @close="removePerms(item2.id, scope.row)">{{ item2.name }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!---三级菜单--->
                    <el-col :span="18">
                      <el-tag closable @close="removePerms(item3.id, scope.row)" type="warning" v-for="item3 in item2.children" :key="item3.id">{{ item3.name }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="name" label="角色"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="info" disabled @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="delRoles(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="warning" @click="givePerms(scope.$index, scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---分页--->
      <div class="page-el">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryPages.currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="queryPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_role">
          </el-pagination>
        </div>
      <el-dialog title="添加角色" :visible.sync="AddFormVisible">
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="rolename" label="角色名" :label-width="formLabelWidth">
            <el-input placeholder="请输入角色名" clearable class="el-input" v-model="form.rolename" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles('form')" :loading="addRoleLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑角色" :visible.sync="EditFormVisible">
          <el-form :model="form" status-icon :rules="rules" ref="form">
            <el-form-item prop="" label="角色名" :label-width="formLabelWidth">
              <el-input :disabled="true" placeholder="请输入角色名" clearable class="el-input" v-model="form.rolename" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles('form')">确 定</el-button>
          </div>
        </el-dialog>
      <el-dialog title="分配权限" :visible.sync="PermFormVisible">
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="" label="角色名" :label-width="formLabelWidth">
            <el-input :disabled="true" placeholder="请输入角色名" clearable class="el-input" v-model="form.rolename" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
          <!---树形控件--->
          <el-tree :data="permList" :props="permProps" show-checkbox
                   node-key="id"
                   ref="tree"
                   v-loading="treeLoading"
                   default-expand-all
                   :check-strictly="true"
                   :default-checked-keys="owner">
          </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="PermFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePerms()" :loading="addPermsLoading">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRolesList, removePerms, changePerms, allotPerms, roleAdd, roleDel } from '@/api'
import { elConfirm } from '@/modules'

export default {
  name: 'RolesList',
  data () {
    var validateRole = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名'))
      }
      callback()
    };
    return {
      rolesList: [],
      permList: [],
      dyPermList: [],
      owner: [],
      parent_id: [],
      AddFormVisible: false,
      EditFormVisible: false,
      PermFormVisible: false,
      addRoleLoading: false,
      addPermsLoading: false,
      loading: true,
      treeLoading: true,
      role_id: '',
      total_role: 10,
      formLabelWidth: '120px',
      form: {
        rolename: ''
      },
      rules: {
        rolename: [
          { validator: validateRole, trigger: 'blur' }
        ]
      },
      permProps: {
        children: 'children',
        label: 'name'
      },
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: ''
      },
    }
  },
  methods: {
    async addRoles (form) {
      await this.$refs[form].validate((valid) => {
        if (!valid) return;
        elConfirm(`确定添加${this.form.rolename}吗？`).then(() => {
          this.addRoleLoading = true;
          roleAdd({ role: this.form.rolename }
            ).then(res => {
            if (res.data.status === 666) {
              this.getRolesList();
              this.$message.success(`${res.data.msg}`)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
            this.addRoleLoading = false;
          }).catch(() => {
            this.addRoleLoading = false;
            this.$message.error('请求参数错误')
          })
        }).catch(() => {
          this.addRoleLoading = false;
          this.$message.info('已取消')
        })
      })
    },
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.RolesList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.RolesList()
    },
    async getRolesList () {
      await getRolesList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
      }).then(res => {
        this.rolesList = res.data.data;
        this.total_role = res.data.total_role;
        this.loading = false
      })
    },
    async removePerms (permID, roleId) {
      await elConfirm('确定移除该权限吗？').then(() => {
        removePerms(
          { permID: permID,
            roleId: roleId.id,
           }
          ).then(res => {
          if (res.data.status === 666) {
            roleId.auth_list = res.data.data;
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        }).catch(() => {})
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async changePerms () {
      await elConfirm('确定修改权限吗？').then(() => {
        this.addPermsLoading = true;
        changePerms(
          {
            perm_list: JSON.stringify([...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()]),
            role: this.role_id,
          }
        ).then(res => {
          if (res.data.status === 666) {
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.addPermsLoading = false;
        }).catch(() => {
          this.addPermsLoading = false;
          this.$message.error('请求参数错误')
        })
      }).catch(() => {this.$message.info('已取消')})
    },
    async givePerms (index, row) {
      // 打开分配权限的dialog
      this.PermFormVisible = true;
      // 填充dialog的用户
      this.form.rolename = row.name;
      // 用户角色的id
      this.role_id = row.id;
      this.treeLoading = true;
      this.owner = [];
      // 数据请求
      await allotPerms({
        type: 'tree',
        role_id: row.id,
      }).then(res => {
        if (res.data.status === 666) {
          this.treeLoading = false;
          this.permList = res.data.data[0].auth_list;
          this.owner = res.data.data[0].owned_auth;
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    async delRoles (index, row) {
      await elConfirm(`确定删除${row.name}吗？`).then(() => {
        roleDel(
          {
            role_id: row.id
           }
          ).then(res => {
            if (res.data.status === 666) {
              this.getRolesList();
              this.$message.success(`${res.data.msg}`)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
          }).catch(() => {
            this.$message.error('请求参数错误')
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    handleEdit (index, row) {
      this.form.rolename = row.name
    },
  },
  mounted () {
    this.getRolesList()
  }
}
</script>

<style lang="scss" scoped>
.row-el {
  min-width: 1600px;
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
.el-input {
  width: 78%;
  right: 10%;
}
.el-tag {
  margin: 7px;
}
.level-top {
  border-top: 1px solid #eee;
}
.level-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
.el-tree {
  padding: 3px 54px;
}
.page-el {

}
.wd-1 {
  position: relative;
  left: -65px;
}
::v-deep .el-col-2 {
  width: 119px!important;
}
::v-deep .el-col-4 {
  width: 400px;
}
</style>
