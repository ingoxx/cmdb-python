<template>
  <div>
    <el-card class="platformAction">
      <el-divider><strong><i class="el-icon-s-cooperation"></i>任务操作</strong></el-divider>
      <div class="select-look">
        <el-select class="select-el" v-model="project" clearable  placeholder="请选择项目">
          <el-option v-for="(item, index) in projectList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="uploadFile" v-loading="runStatus">
        <el-input
          type="textarea"
          :rows="9"
          placeholder="请输入定时任务"
          v-model="textarea">
        </el-input>
      </div>
      <div class="updateProcess">
        <el-button type="primary" size="small" plain @click="runCron(textarea, 1041)" v-if="admin.includes(currentUser) || super_user.includes(currentUser)" :disabled="function(){if(textarea && project) return false;return true;}()">执行定时任务</el-button>
      </div>
      <div class="updateProcess" v-if="super_user.includes(currentUser)">
        <el-button type="primary" size="small"  plain @click="addCron(textarea)" :loading="addCronLoading" :disabled="function(){if(textarea) return false;return true;}()">添加定时任务</el-button>
      </div>
      <div class="updateProcess" v-if="super_user.includes(currentUser)">
        <el-button type="primary" size="small"  plain @click="delCronTab(textarea)" :loading="changeCronLoading" :disabled="function(){if(textarea) return false;return true;}()">删除定时任务</el-button>
      </div>
      <div class="updateProcess">
        <el-button type="primary" size="small"  plain @click="checkCronRoot()" :disabled="function(){if(project) return false;return true;}()">查看所有定时任务</el-button>
      </div>
      <!-- <div class="updateProcess">
        <el-button type="primary" size="small"  plain @click="checkCronNowResult(textarea)" :disabled="function(){if(project) return false;return true;}()">查看crontab的输出结果</el-button>
      </div> -->
      <div class="updateProcess">
        <el-popover
          placement="top"
          trigger="click">
            <div class="card-layout">
              <div class="card-header">
                <span class="card-title">
                  正在运行的shell
                </span>
              </div>
              <el-divider class="card-divider"></el-divider>
              <el-card v-loading="shellVisible">
                <div class="card-body">
                  <div v-html="psContent"></div>
                  <!-- <p>root     13768     1  0 11:20 ?        00:00:00 /usr/local/php/bin/php -f /web/wwwroot/shell/fish_burstedgold/room_bomb_ranking.php ok</p>
                  <p>root     13768     1  0 11:20 ?        00:00:00 /usr/local/php/bin/php -f /web/wwwroot/shell/fish_burstedgold/room_bomb_ranking.php ok</p>
                  <p>root     13768     1  0 11:20 ?        00:00:00 /usr/local/php/bin/php -f /web/wwwroot/shell/fish_burstedgold/room_bomb_ranking.php ok</p> -->
                </div>
              </el-card>
            </div>
          <el-button slot="reference" size="small"  type="primary" plain @click="getRunningShell()" :disabled="function(){if(project) return false;return true;}()">查看正在运行的定时任务</el-button> 
          <!-- @click="checkRunningCrons(textarea)" -->
        </el-popover>
      </div>
    </el-card>
    <el-card class="box-card">
      <!---搜索--->
      <div class="row-el">
        <el-row :gutter="20">
          <el-col :span="1" class="col-1">
              <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getCronList">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
          </el-col>
          <el-col :span="1" class="col-2">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getCronList"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="1" v-if="admin.includes(currentUser)" class="col-3">
            <el-button type="warning" @click="runCron(110, 1042)" :loading="verifyLoading">
              <i class="el-icon-potato-strips"></i> 审核后执行shell
            </el-button>
          </el-col>
          <!-- <el-col :span="1" class="col-4">
            <el-button type="danger" @click="DeleteSelectedPlatform">
              <i class="el-icon-delete"></i> 批量删除
            </el-button>
          </el-col> -->
        </el-row>
      </div>
      <!--平台列表-->
      <div class="table-el">
        <el-table :data="CronList" border strip v-loading="loading" @selection-change="handleSelectionChange" :header-cell-style="{background: '#FAFAFA'}" element-loading-text="拼命加载中">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="project" label="项目" width="155"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" v-if="scope.row.status===104" :loading="true">执行中</el-button>
              <el-link type="warning" :underline="false" v-else-if="scope.row.status===103">已停止</el-link>
              <el-link type="danger" :underline="false" v-else-if="scope.row.status===102">失败</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.status===101">未开始</el-link>
              <el-link type="success" :underline="false" v-else-if="scope.row.status===100">完成</el-link>
              <el-link type="warning" :underline="false" v-else-if="scope.row.status===105">需审核</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="mission" label="定时任务" width="550" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operate_user" label="执行用户"></el-table-column>
          <el-table-column prop="submit_user" label="提交用户"></el-table-column>
          <el-table-column prop="start_time" label="提交时间" width="155"></el-table-column>
          <el-table-column fixed="right" label="结果" width="110">
            <template slot-scope="scope">
              <el-link type="success" @click="checkResult(scope.row)">查看结果<i class="el-icon-view el-icon--right"></i></el-link>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="stopCron(scope.row)">停止</el-button>
                <el-tooltip class="item" effect="dark" content="复制定时任务" placement="top-start">
                  <el-button size="mini" type="success" v-clipboard:copy="scope.row.mission">复制定时任务</el-button>
                </el-tooltip>
                <el-button size="mini" type="danger" @click="delCron(scope.row)" v-if="super_user.includes(currentUser)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <!---分页--->
      <div class="page-el">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryPages.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="queryPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_crons">
        </el-pagination>
      </div>
      <el-dialog title="定时任务结果" :visible.sync="CronResVisible" :close-on-click-modal="false">
        <el-card class="layout-bottom">
          <el-divider><strong><i class="el-icon-platform-eleme"></i>执行内容</strong></el-divider>
          <p>
            <span class="item-name">定时任务:</span> <el-link type="success" :underline="false">{{ cronContent }}</el-link>
          </p>
        </el-card>
        <el-card class="content-layout-height" v-loading="loadingResult"
             element-loading-text="正在拼命获取结果"
             element-loading-spinner="el-icon-loading">
          <el-divider><strong><i class="el-icon-platform-eleme"></i>结果</strong></el-divider>
          <template>
            <div class="format-code">
              <pre><code class="format-code-1">{{ curCode }}</code></pre>
            </div>
          </template>
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { cronList, runCron, checkCron, stopCron, delCron, addCron, delCronTab, createWebLog, getRunningShellMissions } from '@/api'
import { elConfirm } from '@/modules'
import { EventBus } from '@/utlis/eventBus';


export default {
  name: 'cronList',
  data () {
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
      loopGetRunningShellInterval: null,
      shellVisible: false,
      verifyLoading: false,
      CronResVisible: false,
      visible: false,
      loading: true,
      loadingResult: true,
      status: true,
      updateLoading: false,
      beginLoading: false,
      addCronLoading: false,
      changeCronLoading: false,
      createLogLoading: false,
      runStatus: false,
      currentUser: "",
      psContent: "",
      project: "",
      projectList: [],
      admin: [],
      cronContent: '',
      super_user: "",
      total_crons: 10,
      formLabelWidth: '120px',
      textarea: "",
      value: "",
      result: "",
      multipleSelection: [],
      CronList: [],
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: '',
        start: '',
        end: '',
      },
      curCode:'',
      cmOptions: { //codeMirror的配置
    // 　　value: '', //编辑器的初始值（文本）
    // 　　mode: "html", //以什么格式进行代码高亮
    　　theme: "ambiance",// ambiance, foo bar, darcula //配置编辑器的主题样式
   //  　　indentUnit: 1, //缩进单位
   //  　　smartIndent: true, // 自动缩进
   // 　　 tabSize: 1, //tab字符的宽度
    　　lineNumbers: true, // 是否显示行
   //  　　firstLineNumber: 1, //第一行的行号
   //  　　showCursorWhenSelecting: true, // 在选择时是否显示光标
    　　readOnly: true //是否只读,不能获取焦点
      },
    }
  },
  methods: {
    loadingEvent () {
      EventBus.$on('updateData', this.handleDataUpdate);
    },
    handleDataUpdate(data) {
      this.addCronLoading = data.message;
      this.changeCronLoading = data.message;
      this.loading = data.message;
      this.runStatus = data.message;
      this.loadingResult = data.message;
      this.shellVisible = data.message;
      this.createLogLoading = data.message;


    },
    async delCron (row) {
      await elConfirm(`确定删除"${row.id}"吗？`).then(() => {
        delCron(
          { cron_id: JSON.stringify([row.id]) }
          ).then(res => {
          if (res.data.status === 666) {
            this.getCronList();
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async addCron (row) {
      if (!this.project) {
        return this.$message.error('请选择项目')
      }
      if (row === "") {
        return this.$message.error('请输入定时任务内容')
      }
      await elConfirm("确定添加吗？").then(() => {
        this.addCronLoading = true;
        addCron(
          { crons: JSON.stringify(row.split('\n')), project: this.project, user: sessionStorage.getItem('user') }
        ).then(res => {
          if (res.data.status === 666) {
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.addCronLoading = false;
        })
      }).catch(() => {
        this.addCronLoading = false;
        this.$message.info('已取消')
      })
    },
    async delCronTab (row) {
      if (!this.project) {
        return this.$message.error('请选择项目')
      }
      if (row === "") {
        return this.$message.error('请输入定时任务内容')
      }
      await elConfirm("确定删除吗？").then(() => {
        this.changeCronLoading = true;
        delCronTab(
          { crons: JSON.stringify(row.split('\n')), project: this.project, user: sessionStorage.getItem('user')}
        ).then(res => {
          if (res.data.status === 666) {
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
          this.changeCronLoading = false;
        })
      }).catch(() => {
        this.changeCronLoading = false;
        this.$message.info('已取消')
      })
    },
    async DeleteSelectedPlatform () {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选需要删除的平台.')
      }
      var platform_list = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        platform_list.push(this.multipleSelection[i].id)
      }
      await elConfirm(`确定都删除${platform_list}吗？`).then(() => {
        delCron(
          { cron_id: JSON.stringify(platform_list) }
          ).then(res => {
          if (res.data.status === 666) {
            this.getCronList();
            this.$message.success(`${res.data.msg}`);
          } else {
            this.$message.error(`${res.data.msg}`);
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async getCronList () {
      this.loading = true;
      if (this.value !== null) {
        this.queryPages.start = this.value[0];
        this.queryPages.end = this.value[1];
      } else {
        this.queryPages.start = '';
        this.queryPages.end = '';
      }
      await cronList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
        start: this.queryPages.start,
        end: this.queryPages.end,
      }).then(res => {
        this.CronList = res.data.data;
        this.total_crons = res.data.total_crons;
        this.projectList = res.data.projects;
        this.admin = res.data.admin;
        this.loading = false;
        this.super_user = res.data.super_user;
      })
    },
    async runCron (row, action) {
      let data = "";
      let choose = "";
      if (action === 1041) {
        if (!this.project) {
          return this.$message.error('请选择项目')
        }
        if (row === "") {
          return this.$message.error('请输入定时任务内容')
        }
        choose = 1041;
        data = {cron_id: 1041, crons: JSON.stringify(row.split('\n')), project: this.project }
      }
      else if (action === 1042) {
        if (this.multipleSelection.length ===  0) {
          return this.$message.error('请勾选需要执行的定时任务')
        }
        choose = 1042;
        data = {cron_id: 1042, crons: JSON.stringify(this.multipleSelection.map(res => {return res.id})), project: "id" }
      }
      else {
        if (row === "") {
          return this.$message.error('请输入定时任务内容')
        }
      }
      await elConfirm('确定执行吗？').then(() => {
        this.runStatus = true;
        runCron(
          data
        ).then(res => {
          if (res.data.status === 666) {
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.getCronList();
          this.runStatus = false;
        })
      }).catch(() => {
        this.runStatus = false;
        this.$message.info('已取消');
      })
    },
    async stopCron (row) {
      let data = {cron_id: row.id, project: row.project, user: sessionStorage.getItem('user')};
      await elConfirm('确定停止吗？').then(() => {
        stopCron(
          data
        ).then(res => {
          if (res.data.status === 666) {
            this.getCronList();
            this.$message.success(res.data.msg)
          } else {
            this.$message.success(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async checkResult (row) {
      this.CronResVisible = true;
      this.cronContent = row.mission;
      this.result= "";
      this.curCode = "";
      this.loadingResult = true;
      await checkCron({ cron_id: row.id, project: row.project, user: row.submit_user }).then(res => {
        if (res.data.status === 666) {
          this.curCode = res.data.data;
        } else {
          this.CronResVisible = false;
          this.$message.error(res.data.data);
        }
        this.loadingResult = false
        this.getCronList();
      }).catch(error => {
        this.loadingResult = false;
        this.$message.error(error);
      })
    },
    async checkCronRoot () {
      if (!this.project) {
        return this.$message.error('请选择项目')
      }
      this.CronResVisible = true;
      this.cronContent = this.project;
      this.result= "";
      this.curCode = "";
      this.loadingResult = true;
      await checkCron({ cron_id: 10000, project: this.project }).then(res => {
        if (res.data.status === 666) {
          this.curCode = res.data.data;
        } else {
          this.$message.error(res.data.data);
        }
        this.loadingResult = false;
      })
    },
    async checkCronNowResult (row) {
      if (!this.project) {
        return this.$message.error('请选择项目')
      }
      if (row === "") {
        return this.$message.error('请输入保存定时任务输出的文件名，点击[ 查看所有定时任务 ]按钮可以查看文件名')
      }
      this.cronContentLen = row.split('\n');
      if (this.cronContentLen.length !== 1) {
        return this.$message.error('每次只能查看一个定时任务日志')
      }
      this.CronResVisible = true;
      this.result= "";
      this.cronContent = row;
      this.loadingResult = true;
      this.curCode = "";
      await checkCron({ cron_id: 20000, project: this.project+'now', crons: row }).then(res => {
        if (res.data.status === 666) {
          this.curCode = res.data.data;
        } else {
          this.$message.error(res.data.data);
        }
        this.loadingResult = false;
      })
    },
    async getRunningShell() {
      if (!this.project) {
        return this.$message.error('请选择项目');
      }
      this.psContent = "";

      this.shellVisible = true;

      const resp = await getRunningShellMissions(
        { cron_id: 1, project: this.project, user: sessionStorage.getItem('user') }
      );
      if (resp.status && resp.status == 200) {
        this.psContent = resp.data;
      } else {
        this.$message.error(resp.data);
      }
      this.shellVisible = false;
      
    },
    async createWebLog (row) {
      var data = "";
      if (!this.project) {
        return this.$message.error('请选择项目')
      }
      if (row === "") {
        return this.$message.error('请输入路径')
      }
      data = {content: JSON.stringify(row.split('\n')),
              project: this.project+'log' };
      await elConfirm('确定创建吗？').then(() => {
        this.createLogLoading = true;
        createWebLog(
          data
        ).then(res => {
          if (res.data.status === 666) {
            this.getCronList();
            this.$message.success(res.data.msg)
          } else {
            this.$message.success(res.data.msg)
          }
          this.createLogLoading = false;
        })
      }).catch(() => {
        this.$message.info('已取消');
        this.createLogLoading = false;
      })
    },
    handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      this.getCronList()
    },
    handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      this.getCronList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    open() {
        this.$notify({
          title: "注意",
          message: "点击搜索框可刷新表格数据",
          offset: 620,
          type: "warning",
          duration: 1800,
          position: 'top-left'
      });
    },
  },
  mounted () {
    this.loadingEvent();
    this.getCronList();
    this.open();
    this.currentUser = sessionStorage.getItem('user')
  }
}
</script>

<style lang="scss" scoped>
.row-el {
  min-width: 1612px;
  margin-bottom: 22px;
  overflow: hidden;
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
.platformAction {
  margin-bottom: 30px;
}
.uploadFile {
  width: 100%;
  margin: 15px auto;
}
.updateProcess{
  float: left;
  margin-bottom: 18px;
}
.updateProcess > *{
  display: inline-block;
  //line-height: 7px;
  width: auto;
  text-align: center;
  margin: 5px 10px;
}
::v-deep .el-popover .el-popper {
  width: auto!important;
}
.tip-gap {
  font-size: 12px;
  margin: 1px 4px;
}
.set-position {
  right: 0;
}
.set-sure {
  margin-top: 7px;
}
.set-tag-inline {
  display: inline-block;
}
.set-tag-height {
  margin-top: 10px;
}
.look-good {
  position: relative;
  right: 48px;
  min-width: 356px;
}
.look-good-1 {
  min-width: 265px;
}
.layout-bottom {
  margin-bottom: 8px;
}
.content-layout-height {
  height: 600px;
}
.content-height {
  height: 500px;
  overflow: auto;
}
.select-look {
  float: left;
  margin-bottom: 22px;
}
::v-deep .CodeMirror {
  height: 533px;
}
::v-deep .CodeMirror-code {
  text-align: justify;
  font-size: 17px;
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
  box-sizing: border-box;
  width: auto;
}
::v-deep .el-dialog {
  width: 88%;
}
.col-1 {
  width: 350px;
}
.col-1 div {
  width: 350px;
  margin-left: 34px;
}
.col-2 {
  width: 350px;
}
.col-2 div {
  width: 350px;
  margin-left: 24px;
}
.col-3 {
  width: 150px;
  margin-left: 55px;
}
.col-4 {
  width: 140px;
  margin-left: 15px;
}
.format-code-1 {
  white-space: break-spaces;
}
.el-popover-crd {
  width: auto!important;
}
.card-layout {
  .card-header {
    .card-title {
      font-weight: 500;
      font-size: 18px;
      color: #303133;
      .card-notice {
        font-size: 11px;
        color: #fc4343;
      }
    }
  }
  
  .card-divider {
    margin: 10px 0;
  }
  .card-body > p:nth-child(n+2) {
    padding-top: 10px;
  }
  .el-card{
    background: #353535;
    color: #fff;
  }
}
</style>
