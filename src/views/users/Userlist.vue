<template>
  <div class="table-sha">
    <div>
      <el-card class="box-card">
        <!---搜索--->
        <div class="search-el">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-input placeholder="请输入内容" v-model="queryPages.search" clearable suffix-icon="el-icon-date" @click.native="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="AddFormVisible = true">
              <i class="el-icon-circle-plus-outline"></i> 添加用户
              </el-button>
            </el-col>
            <el-col :span="2" class="col-3">
              <el-button type="danger" @click="handleDeleteSelectUser">
                <i class="el-icon-delete"></i> 批量删除
              </el-button>
            </el-col>
          </el-row>
        </div>
        <!---用户列表--->
        <div class="table-el">
          <el-table border ref="multipleTable" :data="tableData" :header-cell-style="{background: '#FAFAFA'}" v-loading="loading" style="width: 100%"
                    :key="Math.random()" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
            <el-table-column prop="groups.name" label="角色"></el-table-column>
            <el-table-column prop="is_active" label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.is_active"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="userStatusChange(scope.row.id, scope.row.is_active)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="date_joined" label="创建时间" width="200">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="155">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            :total="total_user">
          </el-pagination>
        </div>
        <!---用户添加--->
        <el-dialog title="添加用户" :visible.sync="AddFormVisible" :center="true">
          <el-form :model="form" status-icon :rules="rules" ref="form">
            <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
              <el-input clearable class="el-input" v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
              <el-input clearable v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
              <el-input clearable type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="check_password" label="再次输入密码" :label-width="formLabelWidth">
              <el-input clearable type="password" v-model="form.check_password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="is_active" label="是否激活" :label-width="formLabelWidth">
              <el-switch
                class="switch-el"
                v-model="form.is_active"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item prop="role" label="用户角色" :label-width="formLabelWidth">
              <el-select class="select-el" v-model="form.role" placeholder="请选择用户角色">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="AddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser('form')" :loading="addUserLoading">确 定</el-button>
          </div>
        </el-dialog>
        <!---用户编辑--->
        <el-dialog title="编辑用户" :visible.sync="EditFormVisible" :center="true">
          <el-form :model="form" status-icon :rules="rules" ref="form">
            <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
              <el-input disabled class="el-input" v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  prop="email" label="邮箱" :label-width="formLabelWidth">
              <el-input clearable v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  prop="" label="密码" :label-width="formLabelWidth">
              <el-input clearable type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  prop="" label="再次输入密码" :label-width="formLabelWidth">
              <el-input clearable type="password" v-model="form.check_password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="is_active" label="是否激活" :label-width="formLabelWidth">
              <el-switch
                class="switch-el"
                v-model="form.is_active"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item prop="role" label="用户角色" :label-width="formLabelWidth">
              <el-select class="select-el" v-model="values" placeholder="请选择用户角色" @change="handleSelected">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value=item.id></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser('form')" :loading="editUserLoading">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userList, userAdd, userDel, userDelAll, userStatus, userInfoChange, getRolesList } from '@/api'
import { elConfirm, dateForm } from '@/modules'
import { EventBus } from '@/utlis/eventBus';


export default {
  name: 'Userlist',
  data () {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
      callback()
    };
    var validateEmail = (rule, value, callback) => {
      const rep = /^([a-zA-Z\d])(\w|-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (value === '') {
        callback(new Error('请输入邮箱地址'))
      } else {
        if (!rep.test(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
    };
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
    var validateRole = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择用户组'))
      }
      callback()
    };
    return {
      user_list: [],
      tableData: [],
      rolesList: [],
      value: false,
      values: '',
      loading: true,
      AddFormVisible: false,
      EditFormVisible: false,
      addUserLoading:false,
      delUserLoading: false,
      editUserLoading:false,
      total_user: 10,
      multipleSelection: [],
      formLabelWidth: '120px',
      form: {
        username: '',
        email: '',
        password: '',
        check_password: '',
        role: '',
        is_active: ''
      },
      rules: {
        username: [
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        check_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        role: [
          { validator: validateRole, trigger: 'blur' }
        ]
      },
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: ''
      }
    }
  },
  methods: {
    loadingEvent () {
      EventBus.$on('updateData', this.handleDataUpdate);
    },
    handleDataUpdate (data) {
      this.loading = data.message;
      this.addUserLoading = data.message;
      this.EditFormVisible = data.message;

    },
    async getUserList () {
      this.loading = true;
      await userList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
      }).then(res => {
          this.tableData = res.data.data;
          this.total_user = res.data.total_user;
          this.loading = false;
      })
    },
    async userStatusChange (user_id, status) {
      userStatus(
        { user_id: user_id,
          is_active: status ? 1 : 0,
        }
        ).then(res => {
          if (res.data.status === 666) {
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        }).catch(() => {
      })
    },
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.getUserList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.getUserList()
    },
    async handleDelete (index, row) {
      await elConfirm(`确定删除${row.username}吗？`).then(() => {
        userDel(
          { user_id: JSON.stringify([row.id]) }
          ).then(res => {
          if (res.data.status === 666) {
            this.getUserList();
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        }).catch(() => {})
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async handleDeleteSelectUser () {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选要删除的用户')
      }
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.user_list.push(this.multipleSelection[i].id)
      }
      await elConfirm(`确定删除吗？`).then(() => {
        this.loading = true;
        userDelAll(
          { user_id: JSON.stringify(this.user_list) }
        ).then(res => {
          if (res.data.status === 666) {
            this.getUserList();
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
          this.loading = false;
        }).catch(() => {})
      }).catch(() => {
        this.loading = false;
        this.$message.success('已取消')
        })
    },
    async addUser (formName) {
      await this.$refs[formName].validate((valid) => {
        if (!valid) return;
        elConfirm(`确定添加${this.form.username}吗？`).then(() => {
          this.addUserLoading = true;
          userAdd(
              this.form
          ).then(res => {
            if (res.data.status === 666) {
              this.getUserList();
              this.$message.success(`${res.data.msg}`)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
            this.addUserLoading = false;
          }).catch(() => {})
        }).catch(() => {
          this.addUserLoading = false;
          this.$message.success('已取消')
        })
      })
    },
    async editUser (formName) {
      await this.$refs[formName].validate((valid) => {
        if (!valid) return;
        elConfirm(`确定修改${this.form.username}吗？`).then(() => {
          this.EditFormVisible = true;
          userInfoChange(
            this.form
          ).then(res => {
            if (res.data.status === 666) {
              this.getUserList();
              this.$message.success(`${res.data.msg}`)
            } else {
              this.$message.error(`${res.data.msg}`)
            }
            this.EditFormVisible = false;
          }).catch(() => {
            this.EditFormVisible = false;
            this.$message.error('请求参数错误')
          })
        }).catch(() => {
            this.$message.info('已取消')
          })
      })
    },
    async getRolesList () {
      await getRolesList({
        search: '',
        size: 10,
        page: 1,
      }).then(res => {
        this.rolesList = res.data.data;
      })
    },
    handleSelected () {
      this.form.role = this.values;
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEdit (index, row) {
      this.EditFormVisible = true;
      this.form.username = row.username;
      this.form.email = row.email;
      this.form.is_active = row.is_active;
      this.values = row.groups.name;
    },
  },
  mounted () {
    this.getUserList();
    this.getRolesList();
    this.loadingEvent();
  }
}
</script>

<style lang="scss" scoped>
.search-el {
  min-width: 1621px;
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
::v-deep .el-dialog {
  width: 35%;
}
/*::v-deep .switch-el{*/
/*  right:44%*/
/*}*/
::v-deep .el-form{
  width: 88%;
}
::v-deep .select-el{
  margin-right: 196px;
}
::v-deep .el-col-5 {
  width: 380px;
}
::v-deep .el-col-2 {
  width: 119px!important;
}
.col-3 {
  padding-left: 26px!important;
}
</style>
