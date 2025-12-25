<template>
  <div>
    <div class="project-db-select">
      <!--sql提交-->
      <el-card class="card-one">
        <el-divider><strong><i class="el-icon-s-promotion"></i>sql操作</strong></el-divider>
        <div class="info">
          <el-row :gutter="20">
          <el-col :span="1" class="col-1">
            <el-select v-model="project" multiple clearable placeholder="请选择项目">
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
          <el-col :span="1" class="wd-1">
            <el-button type="success" icon="el-icon-hot-water" @click="sqlRun">提交</el-button>
          </el-col>
          <el-col :span="1" class="wd-2">
            <el-button type="primary" icon="el-icon-bank-card" @click.native="formatCode">格式化</el-button>
          </el-col>
          <el-col :span="1" class="wd-3">
            <div class="wd-3-notice"><i>*记得要带上库名</i></div>
          </el-col>
        </el-row>
        </div>
        <div class="string" v-loading="runStatus">
          <textarea ref="sqlCode" v-model="sqlContent"></textarea>
        </div>
        <transition name="el-zoom-in-center">
          <div class="file" v-show="true">
            <el-upload
              class="upload-demo"
              drag
              ref="upload"
              :action="uploadUrl()"
              :before-upload="beforeUpload"
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
    </div>
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
import { sqlList, rulSql, sqlCheck, deleteSql, downloadExcel, rulSqlAdmin, publicFileCheck, sqlIntranet, runIntranetSql } from '@/api'
import baseUrl from "../../utlis/baseUrl";
import { elConfirm } from '@/modules'

export default {
  name: 'sqlList',
  data () {
    return {
      sqlData: [],
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
      resultFormat:'',
      allSqlRes:'',
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
    this.initial()
    this.getSqlList()
    this.fileName.user = sessionStorage.getItem('user');
    this.fileName.token = sessionStorage.getItem('token');
    this.sqlContent = 'adsdadad';
    let dd = document.getElementsByClassName("CodeMirror-scroll");
    dd[0].style.width = "100%";
    let cc = document.getElementsByClassName(" CodeMirror-line");
    cc[0].getElementsByTagName("span")[1].innerHTML = "一条sql只能写在一行,不能换行, sql内容多可以写入到sql文件上传再提交"
    cc[0].getElementsByTagName("span")[1].style.color = "#DCDFE6"
  },
  methods: {
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
      return `${baseUrl}/utils/cmdb/upload/?user=${sessionStorage.getItem('user')}`
    },
    uploadSuccess (response, file) {
      if (response.status === 10000) {
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
    beforeUpload(file) {
        var filePath = file.name;
        //获取最后一个.的位置
        var index= filePath.lastIndexOf(".");
        //获取后缀
        var ext = filePath.substr(index+1);
        //输出结果
        const isSQL = ext === 'sql';
        if (!isSQL) {
          this.$message.error(`${filePath}不能上传, 只能上传sql文件!`);
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
      this.sqlContent = obj.sql
      await publicFileCheck({
        data_id: obj.id,
        item_id: 100
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
      await sqlIntranet({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
        start: this.queryPages.start,
        end: this.queryPages.end,
      }).then(res => {
        if (res.data.status === 666) {
          this.projects = res.data.projects;
          this.dbTypes = res.data.dbType;
          this.dbNames = res.data.dbName;
        } else {
          this.$message.error("nil")
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
    async sqlRun() {
      if(this.project.length == 0) {
        return this.$message.error('请选择项目')
      }
      if(!this.typeDb) {
        return this.$message.error('请选择数据库类型')
      }
      if (!this.coder.getValue() && this.$refs.upload.uploadFiles.length === 0) {
        return this.$message.error('请输入sql或者上传sql文件')
      }
      await elConfirm('确定执行吗？').then(() => {
        this.runStatus = true;
        let data = this.coder.getValue() ? this.coder.getValue().split('\n') : [];
        if (this.$refs.upload.uploadFiles.length > 0) {
          let file_list = this.$refs.upload.uploadFiles.map(res => {return res.name});
          data = [...data, ...file_list]
        }
        runIntranetSql({
          project: JSON.stringify(this.project),
          sql: JSON.stringify(data),
          dbType: this.typeDb,
          user: sessionStorage.getItem('user'),
        }).then(res => {
          if (res.data.status === 666) {
            this.allSqlRes = res.data.msg;
            for (let i=0;i<=this.allSqlRes.length;i++) {
              if (this.allSqlRes[i] === undefined) {
                continue
              }
              this.resultFormat+=`${this.allSqlRes[i]}<br>`
            }
            this.$message({
                dangerouslyUseHTMLString: true,
                message: `'<p><strong>${this.resultFormat}</strong></p>'`,
                showClose: true,
              })
          } else {
            this.$message.error(res.data.msg);
          }
          this.runStatus = false;
          this.resultFormat = "";
          this.$refs.upload.uploadFiles = [];
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
    }
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
  width: 109px;
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
  .code-1 {
    width: 100%;
  }
}
.wd-3-notice {
  font-size: 12px;
  padding-top: 23px;
  color: #df5151;
}
</style>
