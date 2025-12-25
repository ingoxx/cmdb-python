<template>
  <div>
    <div class="project-db-select">
      <!--sql提交-->
      <el-card class="card-one">
        <el-divider><strong><i class="el-icon-s-promotion"></i>sql操作</strong></el-divider>
        <div class="info">
          <el-row :gutter="20">
          <el-col :span="1" class="col-1">
            <el-select v-model="project" clearable multiple placeholder="请选择项目">
              <el-option
                v-for="data in projects"
                :key="data"
                :label="data"
                :value="data">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" class="col-2">
            <el-select v-model="typeDb" clearable placeholder="请选择数据库类型">
              <el-option
                v-for="data in dbTypes"
                :key="data"
                :label="data"
                :value="data">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" class="col-3">
            <el-select v-model="dbName" clearable placeholder="请选择数据库">
              <el-option
                v-for="data in dbNames"
                :key="data"
                :label="data"
                :value="data">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" class="col-4" v-if="dbuser.includes(cur_user)">
            <el-select v-model="submitter" clearable placeholder="请选择提交人">
              <el-option
                v-for="data in users"
                :key="data"
                :label="data"
                :value="data">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" class="wd-1">
            <el-button type="success" icon="el-icon-hot-water" @click="sqlRun">提交</el-button>
          </el-col>
          <el-col :span="1" class="wd-2">
            <el-button type="primary" icon="el-icon-bank-card" @click.native="formatCode">格式化</el-button>
          </el-col>
          <el-col :span="1" class="wd-3">
            <el-button type="info" icon="el-icon-upload" @click="showHidden = !showHidden">上传sql文件</el-button>
          </el-col>
        </el-row>
        </div>
        <div class="string" v-loading="runStatus">
          <textarea ref="sqlCode" v-model="sqlContent"></textarea>
        </div>
        <transition name="el-zoom-in-center">
          <div class="file" v-show="showHidden">
            <el-upload
              class="upload-demo"
              drag
              ref="upload"
              :action="uploadUrl()"
              :on-preview="handlePreview"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              multiple
              :limit="5"
              :data="fileName"
              :on-exceed="uploadLimit"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将sql文件拖到此处, 或<em>点击上传</em></div>
            </el-upload>
          </div>
        </transition>
      </el-card>
      <!--sql列表-->
      <el-card class="card-two">
        <el-divider><strong><i class="el-icon-s-promotion"></i>sql列表</strong></el-divider>
        <!--sql内容查询-->
        <div class="info">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getSqlList">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="5" class="wd-4">
              <el-date-picker
                v-model="getDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="getSqlList"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="8" class="wd-1">
              <el-button type="success" icon="el-icon-sunny" @click="adminSqlRun()">批量执行</el-button>
            </el-col>
          </el-row>
        </div>
        <!--sql列表数据-->
        <div class="table-data">
          <el-table :data="dataList" border strip v-loading="loading" :header-cell-style="{background: '#FAFAFA'}" @selection-change="handleSelectionChange" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="project" label="项目" width="150"></el-table-column>
            <el-table-column prop="status" label="执行状态" width="110">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 100" type="success">完成</el-tag>
                <el-tooltip class="item" effect="dark" content="执行中" placement="right-start">
                  <i v-if="scope.row.status === 200" class="el-icon-loading" style="font-size: 17px;color: red"></i>
                </el-tooltip>
                <el-tag v-if="scope.row.status === 300" type="danger">失败</el-tag>
                <el-tag v-if="scope.row.status === 400" type="info">待执行</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sql" label="sql" width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link type="primary" v-if="scope.row.sql.match(/.*?sql$/g)" :underline="false" @click.native="lookSqlContent(scope.row)">{{ scope.row.sql }}</el-link>
                <span v-else>{{ scope.row.sql }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人"></el-table-column>
            <el-table-column prop="submitter" label="提交人"></el-table-column>
            <el-table-column prop="dbtype" label="数据库类型" width="150"></el-table-column>
            <el-table-column prop="dbname" label="数据库" width="130"></el-table-column>
            <el-table-column prop="start" label="执行时间" width="180"></el-table-column>
            <el-table-column prop="spend" label="耗时(秒/s)" width="100"></el-table-column>
            <el-table-column fixed="right" label="查看sql输出" width="100">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click.native="checkSqlResult(scope.row)">查看</el-link>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="320">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="info" icon="el-icon-receiving" @click="excelDownload(scope.row)">
                  导出Excel
                </el-button> -->
                <el-button size="mini" type="success" icon="el-icon-files" v-clipboard:copy="scope.row.sql">复制sql</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delSql(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            </el-table>
          </div>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryPages.currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="queryPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_sql">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog title="sql文件内容" :visible.sync="SqlLookVisible">
      <el-card class="info">
        <el-divider><strong><i class="el-icon-platform-eleme"></i>sql文件内容</strong></el-divider>
        <p>
          <span class="item-name">项目:</span> <el-link type="success" :underline="false">{{ project_name }}</el-link>
        </p>
        <p>
          <span class="item-name">sql:</span> <el-link type="success" :underline="false">{{ sqlContent }}</el-link>
        </p>
      </el-card>
      <el-card class="content-layout-height" v-loading="loadingLook"
           element-loading-text="正在拼命获取"
           element-loading-spinner="el-icon-loading">
        <el-divider><strong><i class="el-icon-platform-eleme"></i>内容</strong></el-divider>
        <template>
          <div class="format-code content-res">
            <pre><code class="format-code-1">{{ sqlContents }}</code></pre>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <el-dialog title="sql执行输出" :visible.sync="SqlResVisible">
      <el-card class="card-one">
        <el-divider><strong><i class="el-icon-platform-eleme"></i>sql</strong></el-divider>
        <p>
          <span class="item-name">项目:</span> <el-link type="success" :underline="false">{{ project_name }}</el-link>
        </p>
        <p>
          <span class="item-name">sql:</span> <el-link type="success" :underline="false">{{ sqlContent }}</el-link>
        </p>
      </el-card>
      <el-card class="content-layout-height" v-loading="loadingResult"
           element-loading-text="正在拼命获取"
           element-loading-spinner="el-icon-loading">
        <el-divider><strong><i class="el-icon-platform-eleme"></i>输出内容</strong></el-divider>
        <template>
          <div v-if="showTableText" class="content-res">
            <el-table :data="sqlRes" border strip>
              <el-table-column
                v-for="(prop, label) in title"
                :key="label"
                :prop="prop.prop"
                :label="prop.label"
                show-overflow-tooltip
              >
              </el-table-column>
          </el-table>
          </div>
          <div class="format-code" v-else>
            <pre><code class="format-code-1">{{ sqlText }}</code></pre>
          </div>
        </template>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>

import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");
import sqlFormatter from "sql-formatter"
import { sqlList, rulSql, sqlCheck, deleteSql, downloadExcel, rulSqlAdmin, publicFileCheck, publicUploadFile } from '@/api'
import baseUrl from "../../utlis/baseUrl";
import { elConfirm } from '@/modules'
import { EventBus } from '@/utlis/eventBus';


export default {
  name: 'sqlList',
  data () {
    return {
      project_name: "",
      cur_user: "",
      sqlData: [],
      dbuser: [],
      multipleSelection: [],
      dataList: [],
      sqlCheckData: [],
      projects: '',
      dbTypes: '',
      dbNames: '',
      value: '',
      getDate: '',
      sqlContent: '',
      sqlContents: '',
      typeDb: '',
      dbName: '',
      project: [],
      submitter: '',
      sqlText: '',
      users: [],
      sqlRes: [],
      title: [],
      coder: null,
      loading: true,
      showHidden: false,
      SqlResVisible: false,
      SqlLookVisible: false,
      loadingResult: false,
      loadingLook:false,
      runStatus: false,
      total_assets: 10,
      total_sql: 10,
      showTableText: '',
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: '',
        start: '',
        end: '',
      },
      // 默认配置
      option: {
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'cobalt',
        // 显示行号
        lineNumbers: true,
        line: true
      },
      props: {
        sqlContent: {
            type: String,
            default: ''
        },
        sqlStyle: {
            type: String,
            default: 'default'
        },
        readOnly: {
            type: [Boolean, String]
        }
      },
      watch: {
        newVal (newV, oldV) {
            if (this.coder) {
                this.$emit('changeTextarea', this.coder.getValue())
            }
        }
      },
      computed: {
        newVal () {
            if (this.coder) {
                return this.coder.getValue()
            }
        }
      },
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
      fileName: {
      },
    }
  },
  mounted() {
    this.cur_user = sessionStorage.getItem('user');
    this.initial();
    this.getSqlList();
    this.fileName.user = sessionStorage.getItem('user');
    this.fileName.token = sessionStorage.getItem('token');
    this.sqlContent = 'adsdadad';
    let dd = document.getElementsByClassName("CodeMirror-scroll");
    dd[0].style.width = "100%";
    let cc = document.getElementsByClassName(" CodeMirror-line");
    cc[0].getElementsByTagName("span")[1].innerHTML = "一条sql只能写在一行,不能换行写否则报大错特错, sql内容多可以写入到sql文件上传再提交"
    cc[0].getElementsByTagName("span")[1].style.color = "#9f9f9f"
    this.loadingEvent();
  },
  methods: {
    loadingEvent () {
      EventBus.$on('updateData', this.handleDataUpdate);
    },
    handleDataUpdate () {
      this.loadingResult = data.message;
      this.loadingLook = data.message;
      this.loading = data.message;
      this.runStatus = data.message;
    },
    initial () {
      let mime = 'text/x-mariadb'
      this.coder = CodeMirror.fromTextArea(this.$refs.sqlCode, {
          value: this.sqlContent,
          mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          matchBrackets: true,
          cursorHeight: 1,
          lineWrapping: true,
          readOnly: this.readOnly,
          extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
          hintOptions: {//自定义提示选项
          // 当匹配只有一项的时候是否自动补全
              completeSingle: false,
              // tables: {
              //     users: ['name', 'score', 'birthDate'],
              //     countries: ['name', 'population', 'size']
              // }
          }
      })
      //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      this.coder.on('inputRead', () => {
          this.coder.showHint()
      })
    },
    formatCode () {
        let sqlContent="";
        sqlContent=this.coder.getValue();
        this.coder.setValue(sqlFormatter.format(sqlContent));
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    uploadUrl () {
      return `${baseUrl}/utils/public/upload/`
    },
    uploadSuccess (response, file) {
      if (response.status === 666) {
        this.$message.success(response.msg)
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError(err) {
      this.$message.error(err)
    },
    uploadLimit(err) {
      this.$message.error('只能同时上传5个文件')
    },
    beforeAvatarUpload(file) {
        console.log(file.name)
        var filePath = file.name;
        //获取最后一个.的位置
        var index= filePath.lastIndexOf(".");
        //获取后缀
        var ext = filePath.substr(index+1);
        //输出结果
        console.log(ext);
        const isSQL = ext === 'sql';
        if (!isSQL) {
          this.$message.error(`该文件${filePath}不能上传, 只能上传sql文件!`);
        }
        return isSQL;
      },
    downloadExcel (row) {
      window.open(`${baseUrl}/sql/download?sql_id=${row.id}&user=${sessionStorage.getItem('user')}&token=${sessionStorage.getItem('token')}`, '_self');
      // return `${baseUrl}/web/download?web_id=${row.id}&project=${row.project}&user=${sessionStorage.getItem('user')}&token=${sessionStorage.getItem('token')}`
    },
    async checkSqlResult (obj) {
      this.sqlRes = [];
      this.SqlResVisible = true;
      this.loadingResult = true;
      this.sqlContent = obj.sql
      this.project_name = obj.project != undefined ? obj.project : "all";
      await sqlCheck({
        sql_id: obj.id
      }).then(res => {
        if (res.data.status===666) {
          this.showTableText = 100;
          this.sqlRes = res.data.data;
          this.title = res.data.title;
        }
        else if (res.data.status===555) {
          this.showTableText = '';
          this.sqlText = res.data.data;
        }
        else {
          this.showTableText = '';
          this.sqlText = res.data.data;
        }
        this.loadingResult = false
      })
    },
    async lookSqlContent(obj) {
      this.sqlContents = '';
      this.SqlLookVisible = true;
      this.loadingLook = true;
      this.project_name = obj.project != undefined ? obj.project : "all";
      this.sqlContent = obj.sql != undefined ? obj.sql : obj.file;
      await publicFileCheck({
        data_id: obj.id,
        item_id: obj.item_id != undefined ? 101 : 100,
        file_name: obj.file != undefined ? obj.file : "file",
      }).then(res => {
        if (res.data.status === 666) {
          this.sqlContents = res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
        this.loadingLook = false;
      }).catch(error => {
        this.loadingLook = false;
        this.$message.error(error)
      })
    },
    async getSqlList () {
      this.loading = true;
      if (this.getDate !== null) {
        this.queryPages.start = this.getDate[0];
        this.queryPages.end = this.getDate[1];
      } else {
        this.queryPages.start = '';
        this.queryPages.end = '';
      }
      await sqlList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
        start: this.queryPages.start,
        end: this.queryPages.end,
      }).then(res => {
        if (res.data.status === 666) {
          this.total_sql = res.data.total_sql;
          this.projects = res.data.projects;
          this.dbTypes = res.data.dbtype;
          this.dbNames = res.data.dbname;
          this.dataList = res.data.data;
          this.users = res.data.users;
          this.dbuser = res.data.dbuser;
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.getSqlList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.getSqlList()
    },
    handlePreview(file) {
        let data = {
          id: 1,
          item_id: 101,
          file: file.name,
        }
        this.lookSqlContent(data);
        // this.downloadFile(file.name);
    },
    async sqlRun() {
      if(this.project.length == 0) {
        return this.$message.error('请选择项目')
      }
      if(!this.typeDb) {
        return this.$message.error('请选择数据库类型')
      }
      if(!this.dbName) {
        return this.$message.error('请选择数据库')
      }
      // if(!this.submitter) {
      //   return this.$message.error('请选择提交人')
      // }
      if (!this.coder.getValue() && this.$refs.upload.uploadFiles.length === 0) {
        return this.$message.error('请输入sql或者上传sql文件')
      }
      await elConfirm("确定执行吗？").then(() => {
        this.runStatus = true;
        let data = this.coder.getValue() ? this.coder.getValue().split('\n') : [];
        if (this.$refs.upload.uploadFiles.length > 0) {
          let file_list = this.$refs.upload.uploadFiles.map(res => {return res.name});
          data = [...data, ...file_list]
        }
        rulSql({
          operator: sessionStorage.getItem('user'),
          submitter: this.submitter || sessionStorage.getItem('user'),
          project: JSON.stringify(this.project),
          sql: JSON.stringify(data),
          dbname: this.dbName,
          dbtype: this.typeDb,
        }).then(res => {
          if (res.data.status === 666) {
            this.getSqlList();
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.runStatus = false;
        }).catch( () => {
          this.runStatus = false;
        })
      }).catch( () => {
        this.runStatus = false
        this.$message.success('操作已取消')
      })
    },
    async adminSqlRun() {
      if (this.multipleSelection.length === 0) {
          return this.$message.error('请勾选需要执行的sql.')
        }
      let data_ = this.multipleSelection.map(res => {return res.id})
      await elConfirm("确定执行吗？").then(() => {
        this.loading = true;
        rulSqlAdmin({
          id: JSON.stringify(data_),
          operator: sessionStorage.getItem('user'),
        }).then(res => {
          if (res.data.status === 666) {
              this.getSqlList();
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
          this.loading = false;
        })
        }).catch( () => {
          this.loading = false;
          this.$message.success('操作已取消')
        })
    },
    async delSql(data) {
      let data_ = [];
      if (this.multipleSelection.length === 0) {
        if (data) {
          data_.push(data.id)
        } else {
          return this.$message.error('请勾选需要删除的sql.')
        }
      } else {
        data_ = this.multipleSelection.map(res => {return res.id})
      }
      await elConfirm("确定删除吗？").then(() => {
        deleteSql({
          id: JSON.stringify(data_)
        }).then(res => {
          if (res.data.status === 666) {
              this.getSqlList();
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
        })
        }).catch( () => {
          this.$message.success('操作已取消')
        })
    },
    async excelDownload(row) {
      await downloadExcel({
        sql_id: row.id
      }).then(res => {
        if (res.data.status!==-4) {
          window.open(`${baseUrl}/sql/download?sql_id=${row.id}&user=${sessionStorage.getItem('user')}&token=${sessionStorage.getItem('token')}`, '_self');
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getCurrentUser() {

    },
  }
}

</script>

<style lang="scss" scoped>
.info {
  min-width: 1612px;
}
.card-one {
  margin-bottom: 15px;
}
.output {
  margin-bottom: 15px;
}
.info {
  margin-bottom: 15px;
}
::v-deep .CodeMirror-code {
  float: left;
}
::v-deep .CodeMirror-wrap pre.CodeMirror-line, .CodeMirror-wrap pre.CodeMirror-line-like {
  white-space: nowrap;
  text-align: justify;
}
::v-deep .CodeMirror {
  overflow: unset;
}
.wd-1 {
  width: 108px;
}
.wd-2 {
  width: 121px;
}
.wd-3 {
  width: 108px;
}
.wd-4 {
  width: 370px;
}
.wd-5 {
  width: 195px;
}
.table-data {
  margin-bottom: 15px;
}
.file {
  margin-top: 78px;
  float: left;
  margin-bottom: 22px;
}
.format-code {
  height: 533px;
  /*width: 889px;*/
  text-align: justify;
  font-size: 17px;
  overflow: auto;
  color: #c3c3c3;
  background-color: #292828;
  padding: 6px 12px;
}
.result {
  //height: 300px;
  /*width: 889px;*/
  text-align: justify;
  font-size: 17px;
  overflow: auto;
}
::v-deep .el-dialog {
  width: 88%;
}
.content-res {
  height: 600px;
  overflow-y: auto;
  padding: 6px 12px;
}
.col-1 {
  width: 240px;
}
.col-2 {
  width: 240px;
  margin-left: -10px;
}
.col-3 {
  width: 240px;
  margin-left: -10px;
}
.col-4 {
  width: 240px;
  margin-left: -10px;
}
.format-code-1 {
  white-space: break-spaces;
}
@media only screen and (max-width: 1441px) {
  .col-1 {
    width: 180px;
  }
  .col-2 {
    width: 180px;
    margin-left: -10px;
  }
  .col-3 {
    width: 180px;
    margin-left: -10px;
  }
  .col-4 {
    width: 180px;
    margin-left: -10px;
  }
  
}
</style>
